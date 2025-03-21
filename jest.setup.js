// Import Jest DOM for DOM testing utilities
require('@testing-library/jest-dom');

// Set up global mocks
global.ResizeObserver = jest.fn().mockImplementation(() => ({
   observe: jest.fn(),
   unobserve: jest.fn(),
   disconnect: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
   useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
   }),
   useSearchParams: () => ({
      get: jest.fn(),
   }),
}));

// Mock for window.matchMedia
Object.defineProperty(window, 'matchMedia', {
   writable: true,
   value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
   })),
});
