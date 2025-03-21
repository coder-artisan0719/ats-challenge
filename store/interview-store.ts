import { create } from 'zustand';
import { JobDescription, CandidateCV, InterviewQuestion, InterviewMessage, InterviewSession, InterviewResult } from '@/types';

interface InterviewStore {
   // Current job description
   jobDescription: JobDescription | null;
   setJobDescription: (jobDescription: JobDescription) => void;

   // Current candidate CV
   candidateCV: CandidateCV | null;
   setCandidateCV: (candidateCV: CandidateCV) => void;

   // Generated interview questions
   questions: InterviewQuestion[];
   setQuestions: (questions: InterviewQuestion[]) => void;

   // Current interview session
   currentSession: InterviewSession | null;
   startSession: () => void;
   endSession: () => void;

   // Interview messages
   messages: InterviewMessage[];
   addMessage: (message: Omit<InterviewMessage, 'id' | 'timestamp'>) => void;
   updateMessageResponseTime: (messageId: string, responseTimeMs: number) => void;

   // Interview result
   interviewResult: InterviewResult | null;
   setInterviewResult: (result: InterviewResult) => void;

   // Reset store
   resetStore: () => void;
}

export const useInterviewStore = create<InterviewStore>()((set, get) => ({
   jobDescription: null,
   candidateCV: null,
   questions: [],
   currentSession: null,
   messages: [],
   interviewResult: null,

   setJobDescription: (jobDescription) => set({ jobDescription }),

   setCandidateCV: (candidateCV) => set({ candidateCV }),

   setQuestions: (questions) => set({ questions }),

   startSession: () => {
      const { jobDescription, candidateCV, questions } = get();

      if (!jobDescription || !candidateCV || questions.length === 0) {
         console.error('Cannot start session: missing job description, CV, or questions');
         return;
      }

      const session: InterviewSession = {
         id: crypto.randomUUID(),
         jobDescription,
         candidateCV,
         questions,
         messages: [],
         startTime: new Date(),
         status: 'in-progress',
      };

      set({
         currentSession: session,
         messages: [], // Reset messages when starting a new session
      });
   },

   endSession: async () => {
      const { currentSession, messages } = get();

      if (!currentSession) {
         console.error('Cannot end session: no active session');
         return;
      }

      const updatedSession = {
         ...currentSession,
         messages: [...messages],
         endTime: new Date(),
         status: 'completed' as const,
      };

      set({ currentSession: updatedSession });

      // Return a promise to allow awaiting this operation
      return Promise.resolve();
   },

   // Message actions
   addMessage: async (message) => {
      const newMessage: InterviewMessage = {
         ...message,
         id: crypto.randomUUID(),
         timestamp: new Date(),
      };

      set((state) => ({
         messages: [...state.messages, newMessage],
         currentSession: state.currentSession
            ? {
                 ...state.currentSession,
                 messages: [...state.currentSession.messages, newMessage],
              }
            : null,
      }));

      return newMessage.id; // Return the ID for tracking response time
   },

   updateMessageResponseTime: (messageId, responseTimeMs) => {
      set((state) => ({
         messages: state.messages.map((msg) => (msg.id === messageId ? { ...msg, responseTimeMs } : msg)),
         currentSession: state.currentSession
            ? {
                 ...state.currentSession,
                 messages: state.currentSession.messages.map((msg) => (msg.id === messageId ? { ...msg, responseTimeMs } : msg)),
              }
            : null,
      }));
   },

   setInterviewResult: (result) => set({ interviewResult: result }),

   resetStore: () =>
      set({
         jobDescription: null,
         candidateCV: null,
         questions: [],
         currentSession: null,
         messages: [],
         interviewResult: null,
      }),
}));
