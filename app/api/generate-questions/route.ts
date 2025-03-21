import { NextRequest, NextResponse } from 'next/server';
import { openai, DEFAULT_MODEL, createSystemMessage, createUserMessage } from '@/lib/openai';
import { InterviewQuestion } from '@/types';

export async function POST(req: NextRequest) {
   try {
      const { jobDescription, candidateCV } = await req.json();

      if (!jobDescription || !candidateCV) {
         return NextResponse.json({ error: 'Job description and candidate CV are required' }, { status: 400 });
      }

      const systemPrompt = `You are an experienced professional recruiter named Alex, with deep expertise in technical hiring. Your task is to generate a set of interview questions based on the provided job description and candidate's CV.

The questions should be tailored to assess the candidate's fit for the role, focusing on their technical skills, experience, and behavioral traits relevant to the position. Pay special attention to the seniority level of the role and adjust the depth and complexity of questions accordingly.

Generate 7-8 questions that are:
1. Highly specific to both the job requirements and the candidate's background
2. A strategic mix of technical, behavioral, and situational questions
3. Designed to reveal the candidate's depth of expertise, problem-solving approach, and cultural fit
4. Challenging enough to differentiate between average and exceptional candidates
5. Formulated as a real human recruiter would ask them - conversational yet professional

You MUST return the response in this exact JSON format:
{
  "questions": [
    {
      "id": "q1",
      "question": "Your interview question here",
      "category": "technical" | "behavioral" | "situational"
    }
  ]
}

Requirements:
1. The response MUST have a 'questions' property containing an array
2. Each question MUST have all the fields above: id, question, and category
3. The category MUST be one of: "technical", "behavioral", or "situational"
4. The id should be unique for each question (e.g., "q1", "q2", etc.)
5. Do not include any additional fields or properties
6. Ensure questions are phrased naturally as a human recruiter would ask them`;

      const userPrompt = `Job Description:\n${JSON.stringify(jobDescription)}\n\nCandidate CV:\n${candidateCV.rawText}`;

      const response = await openai.chat.completions.create({
         model: DEFAULT_MODEL,
         messages: [createSystemMessage(systemPrompt), createUserMessage(userPrompt)],
         temperature: 0.7,
         response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content;
      if (!content) {
         throw new Error('Failed to generate interview questions');
      }

      const parsedContent = JSON.parse(content);
      const questions: InterviewQuestion[] = parsedContent.questions || [];

      if (questions.length === 0) {
         console.error('No valid questions generated:', questions);
         throw new Error('Failed to generate valid interview questions');
      }

      return NextResponse.json({ questions });
   } catch (error) {
      console.error('Error generating interview questions:', error);
      return NextResponse.json({ error: 'Failed to generate interview questions' }, { status: 500 });
   }
}
