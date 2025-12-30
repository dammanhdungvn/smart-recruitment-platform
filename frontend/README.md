# Smart Recruitment Platform - Frontend

Frontend application built with React 18, TypeScript, Vite, and Material-UI.

## Technology Stack

- **Framework**: React 18+
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Notifications**: react-hot-toast

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on http://localhost:5000

## Installation

```bash
# Install dependencies
npm install
```

## Configuration

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build
```

Application: http://localhost:5173

## Features

### Candidate
- Job search with filters (pagination: 60/page)
- Apply for jobs
- Resume upload (PDF, max 10MB)
- View applications

### Recruiter
- Create/manage job postings
- View applications
- Update application status

## Default Test Accounts

```
Candidate: candidate@example.com / password123
Recruiter: recruiter@example.com / password123
Admin: admin@example.com / password123
```

## License

MIT
