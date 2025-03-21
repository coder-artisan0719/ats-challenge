import { NextRequest, NextResponse } from 'next/server';
import { openai, DEFAULT_MODEL, createSystemMessage, createUserMessage } from '@/lib/openai';
import { InterviewMessage } from '@/types';

export async function POST(req: NextRequest) {
   try {
      const { messages, jobDescription, candidateCV, questions, currentQuestion } = await req.json();

      if (!messages || !jobDescription || !candidateCV || !questions) {
         return NextResponse.json({ error: 'Messages, job description, candidate CV, and questions are required' }, { status: 400 });
      }

      const systemPrompt = `You are a professional human recruiter named Alex, conducting a job interview. Your goal is to have a natural, engaging conversation with the candidate based on the provided job description, their CV, and the prepared questions.

Job Description: ${JSON.stringify(jobDescription)}

Candidate CV: ${candidateCV.rawText}

${currentQuestion ? `Current Question to Ask: ${currentQuestion.question}` : ''}

Your responsibilities:
1. If this is the first message of the interview (empty messages array), start with a warm, professional greeting introducing yourself and the company, then ask the first question.
2. Ask one question at a time and listen carefully to the candidate's responses
3. Ask thoughtful follow-up questions that probe deeper into their experience and skills
4. Maintain a conversational, friendly tone while remaining professional
5. Move to the next question when you've gathered sufficient information

Important guidelines:
- Never start with "That's a great question" or similar phrases unless the candidate has actually asked you something
- Speak in a natural human tone, with appropriate warmth and professionalism
- Do not reveal that you are AI or mention that you are evaluating the candidate
- Tailor your questions and responses to the seniority level indicated in the job description
- If this is the first interaction, always begin with a proper introduction and greeting

Respond only as the interviewer. Keep your responses concise and focused on the interview process.`;

      // Format messages for the API call
      const apiMessages = [
         createSystemMessage(systemPrompt),
         ...messages.map((message: InterviewMessage) => {
            if (message.role === 'user') {
               return createUserMessage(message.content);
            } else {
               return {
                  role: message.role,
                  content: message.content,
               };
            }
         }),
      ];

      const response = await openai.chat.completions.create({
         model: DEFAULT_MODEL,
         messages: apiMessages,
         temperature: 0.7,
      });

      const content = response.choices[0].message.content;
      if (!content) {
         throw new Error('Failed to generate interview response');
      }

      return NextResponse.json({
         message: {
            role: 'assistant',
            content,
            timestamp: new Date(),
            id: crypto.randomUUID(),
         },
      });
   } catch (error) {
      console.error('Error in interview conversation:', error);
      return NextResponse.json({ error: 'Failed to process interview conversation' }, { status: 500 });
   }
}
