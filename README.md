# PlanBear

PlanBear is a web-based university degree planner for building and managing multi-year academic plans.

It supports two planning modes:

- Guest mode: plans are saved in browser `localStorage`
- Account mode: plans are saved through the backend and tied to a user account

The current app is focused on UCLA-style quarter planning, course browsing, drag-and-drop scheduling, and PDF export.

## Features

- Browse and search course data
- Build a 4-year plan with drag-and-drop scheduling
- Create and manage multiple plans
- Use the planner without logging in
- Save guest plans locally in the browser
- Save authenticated plans through the backend
- Export a plan to PDF
- Responsive UI for desktop and mobile

## Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- `@dnd-kit/core`
- jsPDF

### Backend

- Node.js
- Express
- Sequelize
- PostgreSQL
- JWT auth with HTTP-only cookies

## Project Structure

```text
University Degree Planner/
|-- frontend/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- features/
|   |   |-- hooks/
|   |   |-- pages/
|   |   `-- utils/
|
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controller/
|   |   |-- db/
|   |   |-- middlewares/
|   |   |-- models/
|   |   |-- route/
|   |   `-- scripts/
|   `-- migrations/
|
`-- README.md
```

## Local Development

### 1. Install dependencies

From the repo root:

```bash
npm install
```

Then install app dependencies in each package:

```bash
cd frontend
npm install

cd ../backend
npm install
```

### 2. Configure environment variables

Frontend:

- `frontend/.env.development`
- `frontend/.env.production`

Typical frontend variable:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

Backend:

- `backend/.env.development`
- `backend/.env`

Typical backend development variables:

```bash
NODE_ENV=development
PORT=3000
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=your_secret
```

Important:

- Use `npm run dev` in the backend for local development

### 3. Start the backend

```bash
cd backend
npm run dev
```

Backend runs on:

```text
http://localhost:3000
```

### 4. Start the frontend

```bash
cd frontend
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Authentication and Planner Behavior

### Guest users

- Can open the planner immediately
- Can create and edit multiple plans
- Plans are saved to browser `localStorage`

### Logged-in users

- Can sign up and log in
- Planner data is loaded from the backend
- Plans are stored per user through the planner API

If planner auth fails, the frontend falls back to guest mode instead of blocking access.

## Current API Surface

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### Planners

- `GET /api/planners`
- `POST /api/planners`
- `GET /api/planners/:id`
- `PUT /api/planners/:id`
- `DELETE /api/planners/:id`

### Courses

- `GET /api/courses`

## Notes

- The frontend uses cookie-based auth for authenticated planner requests
- Public course browsing does not require login
- PDF export is generated client-side
- The backend currently syncs models automatically in non-production mode

## Contributors

- Phuc Truong
- Jordan Nguyen
