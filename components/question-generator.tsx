'use client';
import { useState } from 'react';
import { useInterviewStore } from '@/store/interview-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface QuestionGeneratorProps {
   onComplete: () => void;
}

export function QuestionGenerator({ onComplete }: QuestionGeneratorProps) {
   const [isGenerating, setIsGenerating] = useState(false);
   const [progress, setProgress] = useState(0);
   const [error, setError] = useState<string | null>(null);
   const { jobDescription, candidateCV, questions, setQuestions } = useInterviewStore();

   const generateQuestions = async () => {
      if (!jobDescription || !candidateCV) {
         setError('Job description and candidate CV are required to generate questions');
         return;
      }

      setIsGenerating(true);
      setError(null);

      // Simulate progress
      const progressInterval = setInterval(() => {
         setProgress((prev) => {
            if (prev >= 90) {
               clearInterval(progressInterval);
               return 90;
            }
            return prev + 5;
         });
      }, 200);

      try {
         const response = await fetch('/api/generate-questions', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               jobDescription,
               candidateCV,
            }),
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate questions');
         }

         const data = await response.json();
         setQuestions(data.questions);
         setProgress(100);
      } catch (err) {
         setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
         setProgress(0);
      } finally {
         clearInterval(progressInterval);
         setIsGenerating(false);
      }
   };

   return (
      <Card className='w-full max-w-3xl mx-auto'>
         <CardHeader>
            <CardTitle>Generate Interview Questions</CardTitle>
            <CardDescription>Our AI will analyze the job description and candidate's CV to generate personalized interview questions.</CardDescription>
         </CardHeader>
         <CardContent className='space-y-4'>
            {questions.length > 0 && !isGenerating && (
               <Alert className='mb-4'>
                  <AlertTitle>Questions Already Generated</AlertTitle>
                  <AlertDescription>{questions.length} questions have been generated. You can proceed to the interview or regenerate questions.</AlertDescription>
               </Alert>
            )}

            {isGenerating && (
               <div className='space-y-2'>
                  <Progress value={progress} className='h-2' />
                  <p className='text-xs text-center text-gray-500'>{progress < 100 ? 'Generating personalized questions...' : 'Questions generated successfully!'}</p>
               </div>
            )}

            {error && (
               <Alert variant='destructive'>
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
               </Alert>
            )}

            {(!jobDescription || !candidateCV) && (
               <Alert variant='default'>
                  <AlertTitle>Missing Information</AlertTitle>
                  <AlertDescription>{!jobDescription && !candidateCV ? 'Both job description and candidate CV are required to generate questions.' : !jobDescription ? 'Job description is required to generate questions.' : 'Candidate CV is required to generate questions.'}</AlertDescription>
               </Alert>
            )}
         </CardContent>
         <CardFooter className='flex justify-between'>
            {questions.length > 0 && (
               <Button variant='outline' onClick={() => onComplete()} disabled={isGenerating}>
                  Continue
               </Button>
            )}
            <Button onClick={generateQuestions} disabled={isGenerating || !jobDescription || !candidateCV}>
               {isGenerating ? 'Generating...' : questions.length > 0 ? 'Regenerate Questions' : 'Generate Questions'}
            </Button>
         </CardFooter>
      </Card>
   );
}
