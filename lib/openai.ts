import OpenAI from 'openai';

export const openai = new OpenAI({
   apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
   dangerouslyAllowBrowser: false,
});

export const DEFAULT_MODEL = 'gpt-4o-mini';

export const createSystemMessage = (content: string) => ({
   role: 'system' as const,
   content,
});

export const createUserMessage = (content: string) => ({
   role: 'user' as const,
   content,
});

export const createAssistantMessage = (content: string) => ({
   role: 'assistant' as const,
   content,
});
