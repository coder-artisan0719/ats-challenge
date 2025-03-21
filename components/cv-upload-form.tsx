'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { parseFile, validateFile } from '@/lib/file-parser';
import { useInterviewStore } from '@/store/interview-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface CVUploadFormProps {
   onComplete: () => void;
}

export function CVUploadForm({ onComplete }: CVUploadFormProps) {
   const [isUploading, setIsUploading] = useState(false);
   const [uploadProgress, setUploadProgress] = useState(0);
   const [error, setError] = useState<string | null>(null);
   const { setCandidateCV, candidateCV } = useInterviewStore();

   const onDrop = async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      const validationError = validateFile(file);

      if (validationError) {
         setError(validationError);
         return;
      }

      setIsUploading(true);
      setError(null);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
         setUploadProgress((prev) => {
            if (prev >= 90) {
               clearInterval(progressInterval);
               return 90;
            }
            return prev + 10;
         });
      }, 100);

      try {
         const parsedCV = await parseFile(file);
         setCandidateCV(parsedCV);
         setUploadProgress(100);
         setTimeout(() => {
            onComplete();
         }, 500); // Small delay to show 100% progress
      } catch (err) {
         setError(`Failed to parse CV: ${err instanceof Error ? err.message : String(err)}`);
         setUploadProgress(0);
      } finally {
         clearInterval(progressInterval);
         setIsUploading(false);
      }
   };

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
         'application/pdf': ['.pdf'],
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
         'application/msword': ['.doc'],
         'text/plain': ['.txt'],
      },
      maxFiles: 1,
      disabled: isUploading,
   });

   return (
      <Card className='w-full max-w-3xl mx-auto'>
         <CardHeader>
            <CardTitle>Upload Candidate CV</CardTitle>
            <CardDescription>Upload the candidate&apos;s CV to generate personalized interview questions.</CardDescription>
         </CardHeader>
         <CardContent className='space-y-4'>
            {candidateCV && !isUploading && (
               <Alert className='mb-4'>
                  <AlertTitle>CV Already Uploaded</AlertTitle>
                  <AlertDescription>
                     {candidateCV.fileName} ({(candidateCV.fileSize / 1024).toFixed(2)} KB) - Uploaded on {new Date(candidateCV.uploadDate).toLocaleString()}
                  </AlertDescription>
               </Alert>
            )}

            <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'} ${isUploading ? 'pointer-events-none opacity-60' : ''}`}>
               <input {...getInputProps()} />
               <div className='flex flex-col items-center justify-center space-y-2'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='h-10 w-10 text-gray-400'>
                     <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                     <polyline points='17 8 12 3 7 8' />
                     <line x1='12' y1='3' x2='12' y2='15' />
                  </svg>
                  {isDragActive ? (
                     <p className='text-sm font-medium'>Drop the CV file here</p>
                  ) : (
                     <div className='space-y-1'>
                        <p className='text-sm font-medium'>Drag and drop the CV file here, or click to browse</p>
                        <p className='text-xs text-gray-500'>Supports PDF, DOCX, and TXT files (max 5MB)</p>
                     </div>
                  )}
               </div>
            </div>

            {isUploading && (
               <div className='space-y-2'>
                  <Progress value={uploadProgress} className='h-2' />
                  <p className='text-xs text-center text-gray-500'>{uploadProgress < 100 ? 'Processing CV...' : 'CV processed successfully!'}</p>
               </div>
            )}

            {error && (
               <Alert variant='destructive'>
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
               </Alert>
            )}
         </CardContent>
         <CardFooter className='flex justify-between'>
            {candidateCV && !isUploading && (
               <Button onClick={() => onComplete()} disabled={isUploading}>
                  Continue
               </Button>
            )}
         </CardFooter>
      </Card>
   );
}
