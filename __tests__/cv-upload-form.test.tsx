import React from 'react';
import { render, screen } from '@testing-library/react';
import { CVUploadForm } from '@/components/cv-upload-form';

// Mock functions
const mockSetCandidateCV = jest.fn();
const mockOnComplete = jest.fn();

// Mock dependencies
jest.mock('@/store/interview-store', () => ({
   useInterviewStore: () => ({
      candidateCV: null,
      setCandidateCV: mockSetCandidateCV,
   }),
}));

jest.mock('@/lib/file-parser', () => ({
   validateFile: jest.fn(),
   parseFile: jest.fn(),
}));

// Mock react-dropzone
jest.mock('react-dropzone', () => ({
   useDropzone: () => ({
      getRootProps: () => ({
         role: 'presentation',
         onClick: jest.fn(),
         onDrop: jest.fn(),
      }),
      getInputProps: () => ({}),
      isDragActive: false,
      open: jest.fn(),
   }),
}));

describe('CVUploadForm', () => {
   beforeEach(() => {
      jest.clearAllMocks();
      // Update the mock implementation for each test
      jest.spyOn(require('@/store/interview-store'), 'useInterviewStore').mockImplementation(() => ({
         candidateCV: null,
         setCandidateCV: mockSetCandidateCV,
      }));
   });

   it('renders the upload form correctly', () => {
      render(<CVUploadForm onComplete={mockOnComplete} />);

      expect(screen.getByText(/upload candidate cv/i)).toBeInTheDocument();
      expect(screen.getByText(/drag and drop the cv file here, or click to browse/i, { exact: false })).toBeInTheDocument();
   });

   it('shows an alert when CV is already uploaded', () => {
      // Mock existing CV
      jest.spyOn(require('@/store/interview-store'), 'useInterviewStore').mockImplementation(() => ({
         candidateCV: {
            fileName: 'resume.pdf',
            fileSize: 102400, // 100KB
            uploadDate: new Date('2025-01-01'),
            rawText: 'CV content',
            fileType: 'application/pdf',
         },
         setCandidateCV: mockSetCandidateCV,
      }));

      render(<CVUploadForm onComplete={mockOnComplete} />);

      // Update these to match your actual component text
      expect(screen.getByText(/cv already uploaded/i, { exact: false })).toBeInTheDocument();
      expect(screen.getByText(/resume\.pdf/i)).toBeInTheDocument();
      expect(screen.getByText(/continue/i)).toBeInTheDocument();
   });
});
