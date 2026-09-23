# Task Tracker API — Backend Documentation

This document provides a complete, end-to-end overview of the **Task Tracker Backend**, built using **NestJS**, **MongoDB (Mongoose)**, and **Passport.js** for cookie-based session authentication.

---

## 📂 Project Folder Structure & Architecture

Below is the complete directory structure of the `backend` folder, with an explanation of every file's purpose:

```text
backend/
├── src/
│   ├── auth/                      # 🔐 Authentication Module
│   │   ├── auth.controller.ts     # Handles HTTP requests for /auth/register, /login, /status, /logout
│   │   ├── auth.module.ts         # Registers Auth components, Passport, and Session Serializer
│   │   ├── auth.service.ts        # Business logic for creating users via UsersService
│   │   ├── local.strategy.ts      # Passport strategy validating username/password against MongoDB
│   │   ├── authenticated.guard.ts # Route guard checking if request.isAuthenticated() is true
│   │   └── session.serializer.ts  # Serializes user ID into session & deserializes on subsequent requests
│   │
│   ├── users/                     # 👤 User Management Module
│   │   ├── schemas/
│   │   │   └── user.schema.ts     # Mongoose User Schema (username, hashed password, compare method)
│   │   ├── users.module.ts        # Registers User schema & exports UsersService
│   │   └── users.service.ts     # Database queries for finding or creating users
│   │
│   ├── tasks/                     # ✅ Task Management Module
│   │   ├── schemas/
│   │   │   └── task.schema.ts     # Mongoose Task Schema (title, description, completed, userId reference)
│   │   ├── tasks.controller.ts    # CRUD controller for /tasks (Protected by AuthenticatedGuard)
│   │   ├── tasks.module.ts        # Registers Task schema and services
│   │   └── tasks.service.ts       # Database queries for creating, reading, updating, and deleting tasks
│   │
│   ├── app.module.ts              # Root module configuring ConfigModule, Mongoose, and sub-modules
│   └── main.ts                    # Entry point setting up Express sessions, CORS, Passport, and server port
│
├── .env                           # Environment configuration variables (Port, DB URI, Session Secret)
├── package.json                   # Project metadata, dependencies, and npm scripts
├── tsconfig.json                  # TypeScript compiler settings
└── README.md                      # Comprehensive project documentation
```

# Prerequisites & Setup Guide

### 1. Prerequisites

- Node.js (v18 or higher) installed on your machine.
- MongoDB running locally (default: mongodb://localhost:27017) or a MongoDB Atlas connection string.

### 2. Environment Variables Configuration

Create a `.env` file in the root of the backend folder with the following variables:
PORT=3000
MONGODB_URI=mongodb://localhost:27017/task-tracker-poc
SESSION_SECRET=super-secret-key-change-in-production

### 3. Installation & Running

Open your terminal inside the backend directory and execute:

- Install dependencies: npm install
- Start the server in development mode: npm run start:dev
  The server will run at http://localhost:3000.

---

# API Endpoints & How They Work

### 🔐 Authentication Routes (/auth)

1. POST /auth/register
   - Description: Creates a new user account. Passwords are securely hashed using bcrypt before saving to MongoDB.
   - Request Body Example: { "username": "john_doe", "password": "securepassword123" }

2. POST /auth/login
   - Description: Authenticates credentials using Passport Local Strategy. Upon successful validation, it establishes a server-side session and returns a secure session cookie (connect.sid) to the client.
   - Request Body Example: { "username": "john_doe", "password": "securepassword123" }

3. GET /auth/status
   - Description: Verifies if the current session cookie is active and valid. Returns the authenticated user profile if logged in.
   - Headers/Auth: Requires active session cookie.

4. POST /auth/logout
   - Description: Destroys the server session and clears the client cookie, logging the user out.
   - Headers/Auth: Requires active session cookie.

---

### ✅ Task Routes (/tasks)

Note: All task routes require an active login session cookie and are protected by the AuthenticatedGuard.

1. GET /tasks
   - Description: Retrieves all tasks belonging strictly to the currently logged-in user.

2. POST /tasks
   - Description: Creates a new task bound to the logged-in user's ID.
   - Request Body Example: { "title": "Learn React", "description": "Build frontend POC UI" }

3. PUT /tasks/:id
   - Description: Updates an existing task by its MongoDB \_id (can update title, description, or toggle completed status).
   - Request Body Example: { "completed": true }

4. DELETE /tasks/:id
   - Description: Permanently deletes a specific task by its MongoDB \_id.
