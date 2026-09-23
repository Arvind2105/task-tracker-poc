# Task Tracker Frontend

This is the frontend client for the Task Tracker POC. It's built with React, TypeScript, and Vite, using Axios to communicate with the NestJS backend and manage session authentication.

## Tech Stack

- React (with TypeScript)
- Vite (for fast development and building)
- Axios (for API requests with cookie credentials enabled)

---

## Getting Started Locally

1. Install Dependencies:
   Make sure you are inside the frontend directory in your terminal, then run:
   npm install

2. Run the Development Server:
   Start the local Vite dev server:
   npm run dev

   The app will open up at http://localhost:5173.
   _(Note: Make sure your NestJS backend is running on http://localhost:3000 and MongoDB is up so the frontend can successfully talk to the API)._

---

## Project Structure

src/
├── components/ # UI components and their respective stylesheets
│ ├── Auth.tsx # Login and Registration form (with toggle)
│ ├── Auth.css
│ ├── TaskForm.tsx # Input box and button to create new tasks
│ ├── TaskForm.css
│ ├── TaskList.tsx # Displays tasks with inline update and delete actions
│ └── TaskList.css
├── services/
│ └── api.ts # Centralized Axios instance pointing to localhost:3000 with credentials
├── App.tsx # Main layout and authentication state controller
├── main.tsx
└── index.css

---

## How It Works

- **Authentication**: Handles user sign-up and login. Upon logging in, the backend sets a secure session cookie (`connect.sid`) in the browser.
- **Axios Configuration**: `src/services/api.ts` is configured with `withCredentials: true`, which ensures the browser automatically sends along the session cookie on every request to protect routes like fetching or creating tasks.
- **Task Management**: Once authenticated, users can type out and submit new tasks, edit existing task titles and descriptions inline, or delete tasks permanently.
