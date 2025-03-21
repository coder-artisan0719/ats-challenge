import { CandidateCV } from '@/types';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
if (typeof window !== 'undefined') {
   try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
   } catch (error) {
      console.error('Failed to initialize PDF.js worker:', error);
      throw new Error('PDF parsing initialization failed');
   }
}

/**
 * Parse a file based on its type and return the text content
 * @param file The file to parse
 * @returns The parsed text content
 */
export async function parseFile(file: File): Promise<CandidateCV> {
   const fileType = file.type;
   const fileName = file.name;
   const fileSize = file.size;
   let rawText = '';

   try {
      if (fileType === 'application/pdf') {
         // Parse PDF file
         const arrayBuffer = await file.arrayBuffer();
         const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
         const numPages = pdf.numPages;
         const textContent = [];

         // Extract text from all pages
         for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map((item: any) => item?.str).join(' ');
            textContent.push(pageText);
         }

         rawText = textContent.join('\n');
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileType === 'application/msword') {
         // Parse DOCX file
         const arrayBuffer = await file.arrayBuffer();
         const result = await mammoth.extractRawText({
            arrayBuffer: arrayBuffer,
         });
         rawText = result.value;
      } else if (fileType === 'text/plain') {
         // Parse TXT file
         rawText = await file.text();
      } else {
         throw new Error(`Unsupported file type: ${fileType}`);
      }

      console.log('test!!!!!!!!!!!!!!!', rawText)

      return {
         rawText,
         fileName,
         fileType,
         fileSize,
         uploadDate: new Date(),
      };
   } catch (error) {
      console.error('Error parsing file:', error);
      throw new Error(`Failed to parse file: ${error instanceof Error ? error.message : String(error)}`);
   }
}

/**
 * Validate a file based on its type and size
 * @param file The file to validate
 * @returns An error message if validation fails, null otherwise
 */
export function validateFile(file: File): string | null {
   const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];

   if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Please upload a PDF, DOCX, or TXT file.';
   }

   // 5MB max file size
   const maxSize = 5 * 1024 * 1024;
   if (file.size > maxSize) {
      return 'File is too large. Maximum size is 5MB.';
   }

   return null;
}
