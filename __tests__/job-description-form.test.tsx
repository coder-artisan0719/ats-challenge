import React from 'react';
import { render, screen } from '@testing-library/react';
import { JobDescriptionForm } from '@/components/job-description-form';

// Mock functions
const mockSetJobDescription = jest.fn();
const mockOnComplete = jest.fn();

// Mock the interview store
jest.mock('@/store/interview-store', () => ({
   useInterviewStore: () => ({
      jobDescription: null,
      setJobDescription: mockSetJobDescription,
   }),
}));

describe('JobDescriptionForm', () => {
   beforeEach(() => {
      jest.clearAllMocks();
      // Update the mock implementation for each test
      jest.spyOn(require('@/store/interview-store'), 'useInterviewStore').mockImplementation(() => ({
         jobDescription: null,
         setJobDescription: mockSetJobDescription,
      }));
   });

   it('renders the form with all fields', () => {
      render(<JobDescriptionForm onComplete={mockOnComplete} />);

      // Check for required fields
      expect(screen.getByLabelText(/job title/i)).toBeInTheDocument();
      expect(screen.getByText(/job description/i, { selector: 'label' })).toBeInTheDocument();

      // Check for optional fields
      expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/job type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/salary range/i)).toBeInTheDocument();
      expect(screen.getByText(/requirements/i, { selector: 'label' })).toBeInTheDocument();
      expect(screen.getByText(/responsibilities/i, { selector: 'label' })).toBeInTheDocument();
   });

   it('pre-fills form with existing job description data', () => {
      // Mock existing job description
      jest.spyOn(require('@/store/interview-store'), 'useInterviewStore').mockImplementation(() => ({
         jobDescription: {
            title: 'Existing Job Title',
            company: 'Existing Company',
            description: 'Existing job description with sufficient length to pass validation.',
         },
         setJobDescription: mockSetJobDescription,
      }));

      render(<JobDescriptionForm onComplete={mockOnComplete} />);

      // Check if fields are pre-filled
      expect((screen.getByLabelText(/job title/i) as HTMLInputElement).value).toBe('Existing Job Title');
      expect((screen.getByLabelText(/company/i) as HTMLInputElement).value).toBe('Existing Company');

      // For textareas
      const descriptionField = screen
         .getByText(/job description/i, { selector: 'label' })
         .closest('div')
         ?.querySelector('textarea');
      expect(descriptionField?.value).toBe('Existing job description with sufficient length to pass validation.');
   });
});
