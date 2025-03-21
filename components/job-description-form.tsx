'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { JobDescription } from '@/types';
import { useInterviewStore } from '@/store/interview-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
   title: z.string().min(3, { message: 'Job title must be at least 3 characters' }),
   company: z.string().min(2, { message: 'Company name must be at least 2 characters' }).optional(),
   location: z.string().optional(),
   jobType: z.string().optional(),
   salary: z.string().optional(),
   description: z.string().min(50, { message: 'Job description must be at least 50 characters' }),
   requirements: z.string().min(30, { message: 'Requirements must be at least 30 characters' }).optional(),
   responsibilities: z.string().min(30, { message: 'Responsibilities must be at least 30 characters' }).optional(),
});

interface JobDescriptionFormProps {
   onComplete: () => void;
}

export function JobDescriptionForm({ onComplete }: JobDescriptionFormProps) {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const { setJobDescription, jobDescription } = useInterviewStore();

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         title: jobDescription?.title || '',
         company: jobDescription?.company || '',
         location: jobDescription?.location || '',
         jobType: jobDescription?.jobType || '',
         salary: jobDescription?.salary || '',
         description: jobDescription?.description || '',
         requirements: jobDescription?.requirements || '',
         responsibilities: jobDescription?.responsibilities || '',
      },
   });

   const onSubmit = async (values: z.infer<typeof formSchema>) => {
      setIsSubmitting(true);
      try {
         setJobDescription(values as JobDescription);
         onComplete();
      } catch (error) {
         console.error('Error saving job description:', error);
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <Card className='w-full max-w-3xl mx-auto'>
         <CardHeader>
            <CardTitle>Job Description</CardTitle>
            <CardDescription>Enter the details of the job position for which you&apos;re interviewing candidates.</CardDescription>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                     <FormField
                        control={form.control}
                        name='title'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Job Title*</FormLabel>
                              <FormControl>
                                 <Input placeholder='e.g. Senior Frontend Developer' {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name='company'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Company</FormLabel>
                              <FormControl>
                                 <Input placeholder='e.g. Acme Inc.' {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                     <FormField
                        control={form.control}
                        name='location'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                 <Input placeholder='e.g. Remote, New York' {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name='jobType'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Job Type</FormLabel>
                              <FormControl>
                                 <Input placeholder='e.g. Full-time, Contract' {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name='salary'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Salary Range</FormLabel>
                              <FormControl>
                                 <Input placeholder='e.g. $80,000 - $100,000' {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  <FormField
                     control={form.control}
                     name='description'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Job Description*</FormLabel>
                           <FormControl>
                              <Textarea placeholder='Enter a detailed description of the job...' className='min-h-32' {...field} />
                           </FormControl>
                           <FormDescription>Provide a comprehensive overview of the position, including the role's purpose and objectives.</FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name='requirements'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Requirements</FormLabel>
                           <FormControl>
                              <Textarea placeholder='Enter the skills, qualifications, and experience required...' className='min-h-24' {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name='responsibilities'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Responsibilities</FormLabel>
                           <FormControl>
                              <Textarea placeholder='Enter the key responsibilities and duties...' className='min-h-24' {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <div className='flex justify-end'>
                     <Button type='submit' disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save and Continue'}
                     </Button>
                  </div>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
}
