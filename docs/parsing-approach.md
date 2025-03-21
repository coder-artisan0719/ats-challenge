# Job Description and CV Parsing Approach

## Job Description Parsing

my application uses a structured form to collect job description data, ensuring we capture all relevant information needed for generating tailored interview questions. The job description parsing approach includes:

1. **Structured Data Collection**: I collect job details through a form with specific fields:

   -  Job title (required)
   -  Company name
   -  Location
   -  Job type
   -  Salary range
   -  Job description (required, with minimum character validation)
   -  Requirements
   -  Responsibilities

2. **Validation**: I implement client-sid validation to ensure:

   -  Required fields are completed.
   -  The job description has sufficient detail (minimum character count)
   -  All data is properly formatted

3. **Storage**: The parsed job description is stored in the application state using Zustand, making it accessible throughout the application flow.

## Candidate CV Parsing

For candidate CVs, I implement a more complex parsing approach:

1. **File Upload Interface**: I use a drag-and-drop interface with react-dropzone to accept:

   -  PDF files
   -  DOCX files
   -  Plain text files

2. **File Validation**: Before processing, I validate:

   -  File type (only accepting PDF, DOCX, and TXT)
   -  File size (limiting to 5MB)

3. **Text Extraction**:

   -  For PDF files: We extract text content using PDF parsing libraries
   -  For DOCX files: We convert and extract text content
   -  For TXT files: We directly read the text content

4. **Data Structure**: The parsed CV is stored with metadata:
   ```typescript
   {
      rawText: string; // The extracted text content
      fileName: string; // Original filename
      fileType: string; // MIME type
      fileSize: number; // Size in bytes
      uploadDate: Date; // Upload timestamp
   }
   ```
5. Error Handling : I implement robust error handling for:
   -  File reading errors
   -  Parsing failures
   -  Unsupported file formats
      By structuring both the job description and CV data in a consistent format, i create a solid foundtion for the AI to generate relevant, context-aware interview questions.

## 2. AI Prompt Engineering for Question Generation

# AI Prompt Engineering Strategy

## Question Generation Prompts

My application uses carefully engineered prompts to generate good interview questions. The prompt design follows these principles:

### System Prompt Design

The system prompt establishes the AI's role and sets clear expectations:
You are an experienced professional recruiter with deep expertise in technical hiring. Your task is to generate a set of interview questions based on the provided job description and candidate's CV.

I then provide specific instructions on question quality:
Generate 7-8 questions that are:

1. Highly specific to both the job requirements and the candidate's background
2. A strategic mix of technical, behavioral, and situational questions
3. Designed to reveal the candidate's depth of expertise, problem-solving approach, and cultural fit
4. Challenging enough to differentiate between average and exceptional candidates
5. Formulated as a real human recruiter would ask them - conversational yet professional

### Data Fusion Approach

To combine both the job description and CV effectively:

1. **Structured Input**: I format both inputs clearly in the user prompt:
   Job Description:
   {structured job description JSON}

Candidate CV:
{extracted CV text}

2. **Response Format Specification**: I enforce a consistent JSON response format:

{
"questions": [
{
"id": "q1",
"question": "Your interview question here",
"category": "technical" | "behavioral" | "situational"
}
]
}

3. **Temperature Setting**: I use a temperature of 0.7 to balance creativity with relevance.

### Context-Awareness Techniques

To ensure questions are truly tailored to both inputs:

1. **Explicit Instructions**: I instruct the AI to pay attention to:

-  The seniority level indicated in the job description
-  The candidate's specific experience and skills
-  The technical requirements of the position

2. **Category Balance**: I require a mix of question types to ensure comprehensive candidate evaluation.

3. **Response Validation**: I validate the AI's response to ensure it follows the required format and contains meaningful questions.

## Interview Conversation Prompts

For the actual interview, I use a different prompt strategy:

1. **Persona Establishment**: The AI takes on the role of a professional human recruiter.

2. **Contextual Awareness**: I provide the full job description, candidate CV, and current question and messages.

3. **Conversation Guidelines**: I instruct the AI to:

-  Ask one question at a time
-  Ask thoughtful follow-up questions
-  Maintain a conversational, friendly tone
-  Move to the next question when sufficient information is gathered

This prompt engineering approach ensures that the generated questions and subsequent interview conversation are highly relevant to both the job requirements and the candidate's background.
