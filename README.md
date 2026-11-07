# JobPrep AI

A full-stack MERN and Generative AI application that analyzes candidate resumes against job descriptions to produce customized interview preparation strategies, detailed skill gap breakdowns, role-specific technical/behavioral interview simulations, and tailored ATS-friendly PDF resumes.

Built with **React 19**, **Node.js/Express**, **MongoDB**, **Google AI Studio (Gemini 3.5 Flash)**, and **Puppeteer**.

---

## Overview

JobPrep AI was designed to solve a core preparation hurdle: generic interview prep rarely reflects the exact requirements of a specific role or the candidate's actual background.

This is my first complete MERN stack project and my first end-to-end production build working in Generative AI using Google AI Studio API keys. The application accepts a candidate's uploaded PDF resume (or written self-description) alongside a target job description. The backend pipeline extracts raw text, structures contextual prompts, and enforces deterministic output generation using Gemini 3.5 Flash through strict Zod JSON schemas. 

The resulting report provides a percentage match score, categorized skill gaps (with severity weighting), collapsible technical and behavioral question cards with interviewer intent and model answers, a 5-day daily milestone roadmap, and a downloadable ATS-tailored resume rendered as a formatted PDF via headless Chrome.

---

## Key Features

**AI-Driven Profile & JD Analysis**
- Text extraction from uploaded PDF resumes using memory buffers and `pdf-parse`
- Dynamic role match scoring comparing candidate background to job requirements
- Structured skill gap identification with severity ratings (`high`, `medium`, `low`)

**Technical & Behavioral Interview Prep**
- Deep technical questions generated based on actual projects and tools mentioned in the candidate's profile
- Behavioral questions targeting team collaboration, system debugging, and feedback handling
- Collapsible question cards detailing the interviewer's hidden intention and an ideal model answer

**5-Day Preparation Roadmap**
- Daily focus areas (e.g. core fundamentals, backend architecture, data modeling, optimization, mock reviews)
- Granular, actionable daily tasks to prepare systematically before the interview

**ATS-Optimized PDF Resume Generator**
- Generates a customized, ATS-friendly HTML resume tailored for the specific target job
- Puppeteer pipeline converts the HTML directly to a downloadable A4 PDF using system Chrome automation

**Security & Session Management**
- User registration and login with `bcryptjs` password hashing (salt rounds: 10)
- Stateless authentication with JSON Web Tokens (JWT) stored in HTTP-only cookies
- Server-side token blacklisting on logout to prevent replay attacks
- Protected client-side routing and automatic session verification on load

---

## Architecture & Technical Decisions

### 1. 4-Layer Frontend Architecture (React 19)
The client follows a decoupled 4-layer architecture to keep components clean, testable, and maintainable:

```
┌──────────────────────────────────────────────┐
│  UI Layer (Components & Pages)              │
│  Home.jsx, Interview.jsx, QuestionCard      │
└──────────────────────┬───────────────────────┘
                       │ consumes
┌──────────────────────▼───────────────────────┐
│  State Layer (React Context API)             │
│  InterviewContext, AuthContext               │
└──────────────────────┬───────────────────────┘
                       │ coordinates
┌──────────────────────▼───────────────────────┐
│  Hook Layer (Custom React Hooks)             │
│  useInterview.js, useAuth.js                 │
└──────────────────────┬───────────────────────┘
                       │ executes
┌──────────────────────▼───────────────────────┐
│  API Layer (Axios Services)                  │
│  interview.api.js, auth.api.js               │
└──────────────────────────────────────────────┘
```

- **UI Layer**: Pure presentational views and modular sub-components. Zero direct Axios calls.
- **State Layer**: React Context providers managing global application state (`user`, `report`, `reports`, `loading`, `downloadingResume`).
- **Hook Layer**: Custom hooks that encapsulate asynchronous workflows, error catching, and state dispatching.
- **API Layer**: Centralized Axios instances configured with dynamic base URLs and `withCredentials: true` for secure cookie transmission.

### 2. Why Zod Instead of Express-Validator?
In standard REST APIs, `express-validator` is sufficient to check incoming request strings. However, in an AI-powered pipeline, the primary failure point is **LLM hallucination and schema mismatch**.

We chose **Zod** because it solves both sides of the contract:
1. **Model Enforcement**: Using `zod-to-json-schema`, our Zod schemas are converted into JSON Schema (Draft-07) and passed directly to Gemini via `responseSchema`. This forces Google's Gemini model to output strictly typed JSON that 100% mirrors our schema.
2. **Database Parity**: Because the Gemini output is strictly conforming JSON, it maps directly into our Mongoose `InterviewReport` schema without missing required fields (such as `title`, `matchScore`, `technicalQuestions`, etc.), eliminating validation crashes.

### 3. Headless Chrome PDF Pipeline
Rather than relying on client-side canvas screenshots (which produce poor text quality and break page flow), the backend uses **Puppeteer**:
1. Gemini generates ATS-structured HTML with inline styles tailored to the target JD.
2. The server loads the HTML into a headless Chrome page via `setContent()`.
3. Puppeteer exports an A4 PDF with exact margins (`20mm` top/bottom, `15mm` sides).
4. The generated binary buffer is streamed back to the client as an `application/pdf` attachment.

### 4. UI/UX Design
The interface was crafted using inspirations from Google Stitch and modern developer dashboards, featuring a dark high-contrast palette (`#0d1117`), collapsible accordions, responsive counters, and a 3-column split view for simultaneous navigation, Q&A reviewing, and metric tracking.

---

## Tech Stack

### Backend Dependencies

| Package | Purpose in Project |
|---|---|
| `@google/genai` | Official Google GenAI SDK interfacing with Gemini 3.5 Flash for high-speed analysis and structured JSON generation. |
| `express` | Core web framework handling REST routing, middleware pipelines, and HTTP responses. |
| `mongoose` | Object Data Modeling (ODM) library for MongoDB schema creation, validation, and querying. |
| `zod` | TypeScript-first schema declaration library used to define strict structures for AI outputs. |
| `zod-to-json-schema` | Converts Zod schemas into JSON Schema (Draft-07) to enforce deterministic Gemini `responseSchema`. |
| `puppeteer` | Headless Chrome automation tool used to render AI-crafted HTML resumes into A4 PDF files. |
| `pdf-parse` | In-memory binary parser extracting plain text from user-uploaded PDF resumes. |
| `multer` | Memory-storage multipart form-data middleware for handling file uploads. |
| `jsonwebtoken` | Issues and verifies signed JWT tokens for authentication. |
| `bcryptjs` | Hashes user passwords with secure salt rounds before persistence. |
| `cookie-parser` | Parses signed cookies from incoming request headers for session validation. |
| `cors` | Configures Cross-Origin Resource Sharing with credentials for client communication. |
| `dotenv` | Loads configuration variables from `.env` into `process.env`. |
| `nodemon` | Development utility that automatically restarts the Node server upon code changes. |

### Frontend Dependencies

| Package | Purpose in Project |
|---|---|
| `react` & `react-dom` (v19) | Declarative UI library utilizing the latest concurrent rendering features. |
| `react-router` | Client-side routing library managing protected routes, dynamic parameters, and fallbacks. |
| `axios` | Promise-based HTTP client managing API communication with interceptors and cookie support. |
| `sass` | Preprocessor enabling modular design tokens, nested selectors, and scoped theme stylesheets. |
| `vite` | Next-generation ESM bundler and fast HMR development server. |
| `oxlint` | High-performance linter used for static code verification and clean code practices. |

---

## Project Structure

```
jobprep_genai/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js           # MongoDB connection handler
│   │   ├── controllers/
│   │   │   ├── auth.controller.js     # User registration, login, logout, getMe
│   │   │   └── interview.controller.js# Report generation, fetching, PDF download
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js     # JWT token and blacklist verification
│   │   │   └── file.middleware.js     # Multer memory storage configuration
│   │   ├── models/
│   │   │   ├── user.model.js          # User schema
│   │   │   ├── blacklist.model.js     # Token blacklist schema with TTL
│   │   │   └── interviewReport.model.js# Schema matching Zod structured output
│   │   ├── routes/
│   │   │   ├── auth.route.js          # /api/auth routes
│   │   │   └── interview.routes.js    # /api/interview routes
│   │   ├── services/
│   │   │   └── ai.service.js          # Gemini 3.5 Flash prompts & Puppeteer PDF engine
│   │   └── app.js                     # Express app setup, CORS & cookie configuration
│   ├── .env.example
│   ├── server.js                      # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── components/        # Protected route wrapper
│   │   │   │   ├── hooks/             # useAuth hook
│   │   │   │   ├── pages/             # Login & Register views
│   │   │   │   ├── services/          # auth.api.js
│   │   │   │   └── auth.context.jsx   # Global Auth Provider
│   │   │   └── interview/
│   │   │       ├── hooks/             # useInterview hook
│   │   │       ├── pages/             # Home dashboard & Interview plan views
│   │   │       ├── services/          # interview.api.js
│   │   │       ├── style/             # Scoped SCSS stylesheets
│   │   │       └── interview.context.jsx # Global Interview Provider
│   │   ├── style/
│   │   │   ├── button.scss            # Reusable button styles
│   │   │   └── style.scss             # Global CSS resets and typography
│   │   ├── app.routes.jsx             # React Router configuration & 404 fallback
│   │   └── main.jsx                   # React root entry
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## API Endpoints

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Registers a new user and sets JWT cookie |
| `POST` | `/api/auth/login` | Public | Validates credentials and sets JWT cookie |
| `GET` | `/api/auth/get-me` | Private | Fetches authenticated user details |
| `GET` | `/api/auth/logout` | Private | Clears auth cookie and blacklists active token |

### Interview Routes (`/api/interview`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/interview/` | Private | Uploads resume / self-description + JD, generates & saves report |
| `GET` | `/api/interview/` | Private | Retrieves recent interview reports for logged-in user |
| `GET` | `/api/interview/report/:interviewId` | Private | Retrieves detailed report by interview ID |
| `POST` | `/api/interview/resume/pdf/:interviewReportId` | Private | Compiles and streams ATS-optimized resume as PDF |

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Google AI Studio API Key ([aistudio.google.com](https://aistudio.google.com/))
- Google Chrome installed on host machine (used by Puppeteer)

---

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/jobprep_genai.git
cd jobprep_genai
```

---

### 2. Configure Backend

1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   PORT=3000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/jobprep?retryWrites=true&w=majority
   JWT_SECRET=your_secret_jwt_key
   GEMINI_API_KEY=your_google_ai_studio_api_key
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```
4. Start backend server:
   ```bash
   npm run dev
   ```
   *Backend runs on `http://localhost:3000`.*

---

### 3. Configure Frontend

1. In a separate terminal, navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
4. Start Vite dev server:
   ```bash
   npm run dev
   ```
   *Frontend opens at `http://localhost:5173`.*

---

## Deployment Guide

### Backend on [Render](https://render.com)
1. Push repository to GitHub.
2. Create a new **Web Service** on Render and select this repository.
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Set Environment Variables:
   - `PORT`: `3000`
   - `MONGO_URI`: Your MongoDB Atlas connection URI
   - `JWT_SECRET`: Random secure string
   - `GEMINI_API_KEY`: Your Google AI Studio API Key
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `https://<your-app>.vercel.app`

### Frontend on [Vercel](https://vercel.com)
1. Import repository into Vercel.
2. Settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
3. Environment Variables:
   - `VITE_API_URL`: `https://<your-render-backend>.onrender.com`
4. Click **Deploy**.

---

## License

Distributed under the ISC License. See `LICENSE` for details.
