'use client';

import { useState, useEffect, useRef } from 'react';
import { useInterviewStore } from '@/store/interview-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { InterviewMessage, InterviewResult } from '@/types';

interface InterviewChatProps {
   onComplete: (result: InterviewResult) => void;
}

export function InterviewChat({ onComplete }: InterviewChatProps) {
   const [isLoading, setIsLoading] = useState(false);
   const [userInput, setUserInput] = useState('');
   const [error, setError] = useState<string | null>(null);
   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
   const [responseStartTime, setResponseStartTime] = useState<number | null>(null);
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const hasInitializedRef = useRef(false);

   const { jobDescription, candidateCV, questions, messages, addMessage, updateMessageResponseTime, currentSession, startSession, endSession } = useInterviewStore();

   const handleAIMessage = async () => {
      try {
         const { messages: currentMessages } = useInterviewStore.getState();

         const currentQuestion = questions[currentQuestionIndex];

         const response = await fetch('/api/interview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               messages: currentMessages,
               jobDescription,
               candidateCV,
               questions,
               currentQuestion,
            }),
         });

         if (!response.ok) {
            throw new Error('Failed to get AI response');
         }

         const data = await response.json();
         await addMessage(data.message);
         setResponseStartTime(Date.now());
      } catch (err) {
         setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      }
   };

   useEffect(() => {
      const shouldStartInterview = !currentSession && jobDescription && candidateCV && questions.length > 0 && !hasInitializedRef.current;
      if (shouldStartInterview) {
         const initializeInterview = async () => {
            hasInitializedRef.current = true;
            await startSession();

            await handleAIMessage();
         };
         initializeInterview();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useEffect(() => {
      scrollToBottom();
   }, [messages]);

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   };

   const handleUserInput = async () => {
      if (!userInput.trim()) return;

      const responseTime = responseStartTime ? Date.now() - responseStartTime : 0;
      setResponseStartTime(null);
      const currentMessage: Omit<InterviewMessage, 'id' | 'timestamp'> = {
         role: 'user',
         content: userInput,
         questionId: questions[currentQuestionIndex].id,
         responseTimeMs: responseTime,
      };

      setUserInput('');
      setIsLoading(true);
      setError(null);

      try {
         const messageId = await addMessage(currentMessage);
         console.log(`Added message ${messageId} with response time: ${responseTime}ms`);

         if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);

            await new Promise((resolve) => setTimeout(resolve, 0));
            await handleAIMessage();
         } else {
            await endSession();

            const { currentSession: updatedSession } = useInterviewStore.getState();

            const currentState = useInterviewStore.getState();
            const sessionWithResponseTimes = {
               ...updatedSession,
               messages: currentState.messages,
            };

            const response = await fetch('/api/score-interview', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ session: sessionWithResponseTimes }),
            });

            if (!response.ok) {
               throw new Error('Failed to score interview');
            }

            const data = await response.json();
            onComplete(data.result);
         }
      } catch (err) {
         setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Card className='w-full max-w-3xl mx-auto'>
         <CardHeader>
            <CardTitle>Interview in Progress</CardTitle>
            <CardDescription>Answer the questions naturally and professionally. Your responses are being evaluated.</CardDescription>
         </CardHeader>
         <CardContent className='space-y-4'>
            <div className='h-[400px] overflow-y-auto space-y-4 p-4 border rounded-lg'>
               {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[80%] p-3 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{message.content}</div>
                  </div>
               ))}
               <div ref={messagesEndRef} />
            </div>

            {error && (
               <Alert variant='destructive'>
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
               </Alert>
            )}

            <div className='space-y-2'>
               <Textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder='Type your response...' className='min-h-[100px]' disabled={isLoading} />
               {isLoading && <Progress value={50} className='h-2' />}
            </div>
         </CardContent>
         <CardFooter>
            <Button onClick={handleUserInput} disabled={!userInput.trim() || isLoading} className='w-full'>
               {isLoading ? 'Processing...' : 'Send Response'}
            </Button>
         </CardFooter>
      </Card>
   );
}
