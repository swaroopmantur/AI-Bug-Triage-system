# AI Software Bug Triage & Duplicate Detection System

An AI-powered bug management application that helps developers analyze software bug reports, classify issues, and prioritize fixes using the Gemini API.

## Live Demo
**Try the application:** https://ai-bug-triage-system.vercel.app

## Features

- **AI Bug Analysis:** Analyze bug titles and descriptions using Google Gemini.
- **Bug Classification:** Categorize bugs, such as UI, Backend, and Other.
- **Priority & Severity:** Generate recommendations to help developers assess bugs.
- **Duplicate Detection:** Identify potential duplicate bug reports.
- **Bug Management:** Create, view, edit, and delete bug reports.
- **Search & Filters:** Search and filter bugs by category, priority, severity, and status.
- **Dashboard:** Manage bug reports through a web interface.

## Technology Stack

- **Frontend:** React.js, Vite, HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose
- **AI:** Google Gemini API
- **Tools:** Git, GitHub, VS Code

## Project Structure

```text
ai-bug-triage-system/
├── backend/
│   ├── routes/
│   ├── Bug.js
│   ├── geminiService.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB Atlas account
- Google Gemini API key

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd ai-bug-triage-system
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your repository's HTTPS URL.

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Replace the placeholder values with your own credentials. Never commit your `.env` file or expose your API key.

### 3. Start the backend

```bash
node server.js
```

### 4. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/bugs` | Retrieve bug reports |
| POST | `/bugs` | Create a bug report |
| POST | `/bugs/analyze` | Analyze a bug using Gemini |

Additional endpoints may be available depending on the current implementation.

## Future Enhancements

- Improved duplicate detection
- Automated test recommendations
- Bug analytics and reporting
- Deployment to a cloud hosting platform

## Author

Developed as a software engineering project to explore AI-assisted bug triage, bug management, and duplicate detection.
