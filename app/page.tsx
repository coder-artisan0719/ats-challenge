'use client';

import { useState } from 'react';
import { JobDescriptionForm } from '@/components/job-description-form';
import { CVUploadForm } from '@/components/cv-upload-form';
import { QuestionGenerator } from '@/components/question-generator';
import { InterviewChat } from '@/components/interview-chat';
import { InterviewResult } from '@/components/interview-result';
import type { InterviewResult as InterviewResultType } from '@/types';

export default function Home() {
   const [step, setStep] = useState<number>(1);
   const [interviewResult, setInterviewResult] = useState<InterviewResultType | null>(null);

   const handleStepComplete = () => {
      setStep((prevStep) => prevStep + 1);
   };

   const handleInterviewComplete = (result: InterviewResultType) => {
      setInterviewResult(result);
      setStep((prevStep) => prevStep + 1);
   };

   return (
      <main className='container mx-auto py-8 px-4'>
         <div className='mb-8 text-center'>
            <h1 className='text-4xl font-bold mb-2'>AI Interview Assistant</h1>
            <p className='text-gray-600'>Streamline your hiring process with AI-powered interviews</p>
         </div>

         <div className='space-y-8'>
            {step === 1 && <JobDescriptionForm onComplete={handleStepComplete} />}
            {step === 2 && <CVUploadForm onComplete={handleStepComplete} />}
            {step === 3 && <QuestionGenerator onComplete={handleStepComplete} />}
            {step === 4 && <InterviewChat onComplete={handleInterviewComplete} />}
            {step === 5 && interviewResult && <InterviewResult result={interviewResult} />}
         </div>
      </main>
   );
}
