// Types for the application

// Job Description type
export interface JobDescription {
   title: string;
   description: string;
   requirements?: string;
   responsibilities?: string;
   company?: string;
   location?: string;
   jobType?: string;
   salary?: string;
}

// Candidate CV type
export interface CandidateCV {
   rawText: string;
   fileName: string;
   fileType: string;
   fileSize: number;
   uploadDate: Date;
}

// Interview Question type
export interface InterviewQuestion {
   id: string;
   question: string;
   category?: 'technical' | 'behavioral' | 'situational';
   followUp?: boolean;
   parentQuestionId?: string;
}

// Interview Message type
export interface InterviewMessage {
   id: string;
   role: 'system' | 'user' | 'assistant';
   content: string;
   timestamp: Date;
   questionId?: string;
   responseTimeMs?: number;
}

// Interview Session type
export interface InterviewSession {
   id: string;
   jobDescription: JobDescription;
   candidateCV: CandidateCV;
   questions: InterviewQuestion[];
   messages: InterviewMessage[];
   startTime: Date;
   endTime?: Date;
   status: 'pending' | 'in-progress' | 'completed';
}

// Scoring Criteria type
export interface ScoringCriteria {
   technicalAcumen: number;
   communicationSkills: number;
   responsivenessAgility: number;
   problemSolvingAdaptability: number;
   culturalFitSoftSkills: number;
   overallScore: number;
   strengths: string[];
   areasForImprovement: string[];
   summary: string;
}

// Interview Result type
export interface InterviewResult {
   sessionId: string;
   scoring: ScoringCriteria;
   averageResponseTimeMs: number;
   totalDurationMs: number;
   timestamp: Date;
}
