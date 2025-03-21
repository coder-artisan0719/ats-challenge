# Comprehensive Prompt Design Strategy

This document outlines my overall prompt design strategy and how I integrate both job description/CV data and timing metrics into the AI evaluation process.

## Prompt Design Philosophy

my prompt design follows these core principles:

1. **Role-Based Framing**: I establish the AI as an experienced professional recruiter to ensure responses are appropriate for a hiring context.

2. **Clear Instruction Structure**: Each prompt has distinct sections for:

   -  Role establishment
   -  Task definition
   -  Specific instructions
   -  Output format requirements

3. **Contextual Awareness**: I provide all relevant context in a structured format to ensure the AI has the necessary information.

4. **Output Consistency**: I enforce strict output formats using JSON structures to ensure reliable parsing.

## Data Integration Strategy

### Job Description and CV Integration

I integrate job description and CV data at three key points in the application flow:

1. **Question Generation**

   -  Both inputs are provided to generate tailored questions
   -  The prompt explicitly instructs the AI to consider both the job requirements and candidate background
   -  Example: "Generate questions that are highly specific to both the job requirements and the candidate's background"

2. **Interview Conversation**

   -  Both inputs inform the interview flow
   -  The AI references specific aspects of the job and CV during the conversation
   -  Example: "Based on your experience with [technology mentioned in CV], how would you approach [requirement from job description]?"

3. **Final Evaluation**
   -  Both inputs provide context for scoring
   -  The AI evaluates responses in relation to job requirements and candidate's claimed experience
   -  Example: "Considering the candidate claimed 5 years of React experience in their CV, evaluate their technical explanations of React concepts"

### Timing Metrics Integration

Timing data is integrated into the evaluation process through:

1. **Data Collection**

   -  Response time is captured for each candidate message
   -  Start and end times are recorded for the overall interview

2. **Prompt Integration**

   -  Timing data is explicitly included in the scoring prompt
   -  Example: "Their average response time was ${averageResponseTimeMs} milliseconds - factor this into your assessment"

3. **Contextual Interpretation**
   -  The AI is instructed to interpret timing in context
   -  Example: "Consider that complex technical questions may justifiably take longer to answer"

## Multi-Stage Prompt Strategy

My application uses a three-stage prompt strategy:

1. **Question Generation Stage**
   System: You are an experienced professional recruiter...
   User: Job Description: {...} Candidate CV: {...}

2. **Interview Conversation Stage**
   System: You are a professional human recruiter conducting a job interview...
   [Previous conversation history]
   User: [Candidate's latest response]

3. **Evaluation Stage**
   System: You are an experienced professional recruiter with years of expertise in candidate evaluation...
   User: Job Description: {...} Candidate CV: {...} Interview Transcript: {...} Timing Metrics: {...}

This comprehensive prompt design strategy ensures that my AI-powered interview system generates relevant questions, conducts natural interviews, and provides fair, insightful evaluations that consider both response content and timing.
