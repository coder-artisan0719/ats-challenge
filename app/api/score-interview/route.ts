import { NextRequest, NextResponse } from 'next/server';
import { openai, DEFAULT_MODEL, createSystemMessage, createUserMessage } from '@/lib/openai';
import { ScoringCriteria, InterviewResult } from '@/types';

export async function POST(req: NextRequest) {
   try {
      const { session } = await req.json();

      if (!session) {
         return NextResponse.json({ error: 'Interview session data is required' }, { status: 400 });
      }

      const { jobDescription, candidateCV, messages, startTime, endTime } = session;

      if (!jobDescription || !candidateCV || !messages || !startTime || !endTime) {
         return NextResponse.json({ error: 'Incomplete session data' }, { status: 400 });
      }

      // Calculate timing metrics
      const userMessages = messages.filter((m: any) => m.role === 'user');

      // Filter out messages with undefined or 0 responseTimeMs to avoid skewing the average
      const messagesWithResponseTime = userMessages.filter((msg: any) => msg.responseTimeMs && msg.responseTimeMs > 0);
      const totalResponseTimeMs = messagesWithResponseTime.reduce((sum: number, msg: any) => sum + (msg.responseTimeMs || 0), 0);
      const averageResponseTimeMs = messagesWithResponseTime.length > 0 ? totalResponseTimeMs / messagesWithResponseTime.length : 0;
      const totalDurationMs = new Date(endTime).getTime() - new Date(startTime).getTime();

      const systemPrompt = `You are an experienced professional recruiter named Alex, with years of expertise in candidate evaluation. Analyze the interview transcript and provide a realistic, critical assessment of the candidate based on the following criteria:

1. Technical Acumen (score 1-10): Evaluate the candidate's technical skills and knowledge relevant to the position. Be critical of any gaps or inconsistencies in their technical explanations.
2. Communication Skills (score 1-10): Assess clarity, coherence, and effectiveness in conveying complex ideas. Consider both what they said and how they said it.
3. Responsiveness & Agility (score 1-10): Evaluate how promptly and thoughtfully the candidate responds. Their average response time was ${averageResponseTimeMs} seconds - factor this into your assessment.
4. Problem-Solving & Adaptability (score 1-10): Assess their approach to challenges, ability to think on their feet, and how they handle follow-up questions.
5. Cultural Fit & Soft Skills (score 1-10): Evaluate interpersonal communication and potential fit for the company culture based on their responses.

Also provide:
- Overall Score (score 1-10): A weighted average that realistically reflects their performance.
- Strengths: List 3-5 specific, evidence-based strengths demonstrated during the interview.
- Areas for Improvement: List 2-4 concrete areas where the candidate could improve, with specific examples from the interview.
- Summary: A balanced, critical paragraph summarizing the candidate's performance and suitability for the role. Include both positive aspects and concerns.

Be honest and critical in your assessment - not every candidate deserves high scores. Base your evaluation strictly on the evidence in the transcript, not assumptions.

Return your evaluation in JSON format with the following structure:
{
  "technicalAcumen": number,
  "communicationSkills": number,
  "responsivenessAgility": number,
  "problemSolvingAdaptability": number,
  "culturalFitSoftSkills": number,
  "overallScore": number,
  "strengths": string[],
  "areasForImprovement": string[],
  "summary": string
}`;

      // Format the interview transcript for the API call
      const transcript = messages.map((msg: any) => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n\n');
      const userPrompt = `Job Description:\n${JSON.stringify(jobDescription)}\n\nCandidate CV:\n${candidateCV.rawText}\n\nInterview Transcript:\n${transcript}\n\nInterview Metrics:\n- Average Response Time: ${averageResponseTimeMs}ms\n- Total Interview Duration: ${totalDurationMs}ms`;

      const response = await openai.chat.completions.create({
         model: DEFAULT_MODEL,
         messages: [createSystemMessage(systemPrompt), createUserMessage(userPrompt)],
         temperature: 0.7,
         response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content;
      if (!content) {
         throw new Error('Failed to generate interview scoring');
      }

      const scoring: ScoringCriteria = JSON.parse(content);

      const result: InterviewResult = {
         sessionId: session.id,
         scoring,
         averageResponseTimeMs,
         totalDurationMs,
         timestamp: new Date(),
      };

      return NextResponse.json({ result });
   } catch (error) {
      console.error('Error scoring interview:', error);
      return NextResponse.json({ error: 'Failed to score interview' }, { status: 500 });
   }
}
