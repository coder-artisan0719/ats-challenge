# ATS Challenge - Setup Guide

This guide provides instructions for setting up, testing, and running the ATS Challenge application in a development environment.

## Prerequisites

-  Node.js (v18 or later, proffered v22)
-  npm or yarn
-  OpenAI API key

## Setup Instructions

1. **Clone the repository**

```bash
git clone <repository-url>
cd ats-challenge
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Environment setup**
   Create a .env.local file in the root directory with the following content:

```bash
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

## Running the Application

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:3000 .

## Testing

### Running Tests

To run all tests:

```bash
npm test
# or
yarn test
```

## Project Structure

-  /app - Next.js app router pages and API routes
-  /components - React components
-  /lib - Utility functions and API wrappers
-  /store - State management
-  /types - TypeScript type definitions
-  /docs - Documentation files

## Deployment

The application is configured for deployment on Vercel. Connect your GitHub repository to Vercel and ensure the NEXT_PUBLIC_OPENAI_API_KEY environment variable is set in the Vercel project settings.
