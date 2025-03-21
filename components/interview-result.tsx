'use client';
import type { InterviewResult } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface InterviewResultProps {
   result: InterviewResult;
}

export function InterviewResult({ result }: InterviewResultProps) {
   const { scoring, averageResponseTimeMs, totalDurationMs } = result;

   const formatScore = (score: number) => (score * 10).toFixed(1);
   const formatTime = (ms: number) => (ms / 1000).toFixed(2);

   return (
      <Card className='w-full max-w-3xl mx-auto'>
         <CardHeader>
            <CardTitle>Interview Results</CardTitle>
            <CardDescription>Comprehensive evaluation of the candidate&apos;s performance</CardDescription>
         </CardHeader>
         <CardContent className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
               <div className='space-y-4'>
                  <h3 className='font-semibold'>Performance Metrics</h3>
                  <div className='space-y-2'>
                     <div className='space-y-1'>
                        <div className='flex justify-between text-sm'>
                           <span>Technical Acumen</span>
                           <span>{formatScore(scoring.technicalAcumen)}%</span>
                        </div>
                        <Progress value={scoring.technicalAcumen * 10} className='h-2' />
                     </div>
                     <div className='space-y-1'>
                        <div className='flex justify-between text-sm'>
                           <span>Communication Skills</span>
                           <span>{formatScore(scoring.communicationSkills)}%</span>
                        </div>
                        <Progress value={scoring.communicationSkills * 10} className='h-2' />
                     </div>
                     <div className='space-y-1'>
                        <div className='flex justify-between text-sm'>
                           <span>Responsiveness & Agility</span>
                           <span>{formatScore(scoring.responsivenessAgility)}%</span>
                        </div>
                        <Progress value={scoring.responsivenessAgility * 10} className='h-2' />
                     </div>
                     <div className='space-y-1'>
                        <div className='flex justify-between text-sm'>
                           <span>Problem-Solving & Adaptability</span>
                           <span>{formatScore(scoring.problemSolvingAdaptability)}%</span>
                        </div>
                        <Progress value={scoring.problemSolvingAdaptability * 10} className='h-2' />
                     </div>
                     <div className='space-y-1'>
                        <div className='flex justify-between text-sm'>
                           <span>Cultural Fit & Soft Skills</span>
                           <span>{formatScore(scoring.culturalFitSoftSkills)}%</span>
                        </div>
                        <Progress value={scoring.culturalFitSoftSkills * 10} className='h-2' />
                     </div>
                  </div>
               </div>

               <div className='space-y-4'>
                  <h3 className='font-semibold'>Response Metrics</h3>
                  <div className='space-y-4'>
                     <div>
                        <p className='text-sm text-gray-500'>Average Response Time</p>
                        <p className='text-2xl font-bold'>{formatTime(averageResponseTimeMs)}s</p>
                     </div>
                     <div>
                        <p className='text-sm text-gray-500'>Total Interview Duration</p>
                        <p className='text-2xl font-bold'>{formatTime(totalDurationMs)}s</p>
                     </div>
                     <div>
                        <p className='text-sm text-gray-500'>Overall Score</p>
                        <p className='text-2xl font-bold'>{formatScore(scoring.overallScore)}%</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
               <div className='space-y-2'>
                  <h3 className='font-semibold text-green-600'>Key Strengths</h3>
                  <ul className='list-disc list-inside space-y-1'>
                     {scoring.strengths.map((strength, index) => (
                        <li key={index} className='text-sm'>
                           {strength}
                        </li>
                     ))}
                  </ul>
               </div>
               <div className='space-y-2'>
                  <h3 className='font-semibold text-amber-600'>Areas for Improvement</h3>
                  <ul className='list-disc list-inside space-y-1'>
                     {scoring.areasForImprovement.map((area, index) => (
                        <li key={index} className='text-sm'>
                           {area}
                        </li>
                     ))}
                  </ul>
               </div>
            </div>

            <div className='space-y-2'>
               <h3 className='font-semibold'>Summary</h3>
               <p className='text-sm text-gray-600'>{scoring.summary}</p>
            </div>
         </CardContent>
      </Card>
   );
}
