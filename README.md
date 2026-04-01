# PlanBear

PlanBear is a quarter-based academic planner built for mapping out a UCLA-style degree roadmap.

It lets students browse courses, drag classes into future quarters, manage multiple plans, and export a clean PDF version of their roadmap. The app also supports guest mode, so planning can start right away without creating an account.

## Features

- Quarter-by-quarter academic roadmap
- Drag-and-drop planner with a four-year layout
- Searchable course catalog
- Multiple saved plans per user
- Guest mode with browser `localStorage`
- Account mode backed by PostgreSQL
- Homepage roadmap preview for the current quarter
- Password reset flow
- Contact form with Turnstile protection
- Client-side PDF export
- Responsive frontend for desktop and mobile

## Current Product Shape

- The homepage is focused on the academic roadmap preview
- Planning works in guest mode and logged-in mode
- Authenticated users can save planners to the backend
- Guest users keep planners locally in the browser
- Password reset emails and contact emails work when mailer env vars are configured
- Cloudflare Turnstile is used on signup, login, and contact submission

## Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS 4
- React Router
- `@dnd-kit/core`
- jsPDF
- Headless UI

### Backend

- Node.js
- Express
- Sequelize
- PostgreSQL
- JWT auth with `HttpOnly` cookies
- Nodemailer

## Database Schema

The app uses PostgreSQL and the schema diagram is included here:

- [docs/supabase-schema.svg](./docs/supabase-schema.svg)

### Core tables

- `users`: account records, student year, login identity
- `planners`: saved roadmap plans for each user
- `courses`: catalog course records
- `course_offerings`: term-specific offering data for a course
- `offering_snapshots`: historical snapshots of offering availability
- `user_tracked_offerings`: user-to-offering watch records
- `password_reset_tokens`: reset token storage for password recovery

### Main relationships

- One `user` has many `planners`
- One `course` has many `course_offerings`
- One `course_offering` has many `offering_snapshots`
- `users` and `course_offerings` are connected through `user_tracked_offerings`
- `password_reset_tokens` belong to `users`

### Schema setup options

#### Option 1: Local development with Sequelize sync

This is the easiest way to bootstrap the tables during development.

1. Create your PostgreSQL database.
2. Set your backend env values for `DB_*` or `DATABASE_URL`.
3. Temporarily set:

```bash
ALLOW_SEQUELIZE_SYNC=true
```

4. Start the backend once:

```bash
cd backend
npm run dev
```

5. After the tables are created, set it back to:

```bash
ALLOW_SEQUELIZE_SYNC=false
```

6. Seed the course catalog:

```bash
cd backend
npm run seed:dev
```

#### Option 2: Supabase Postgres

If you want to use Supabase as your hosted Postgres database:

1. Create a Supabase project.
2. Copy the Postgres connection string into `DATABASE_URL`.
3. Use the included schema diagram in [docs/supabase-schema.svg](./docs/supabase-schema.svg) as the table reference.
4. Bootstrap the tables with `ALLOW_SEQUELIZE_SYNC=true` on first run, or create the tables manually to match the backend models in [backend/src/models](./backend/src/models).
5. Run the course import script after the schema exists.

The backend is using Sequelize models as the source of truth, so the database should match those model definitions.

## Project Structure

```text
University Degree Planner/
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- data/
|   |   |-- dnd/
|   |   |-- features/
|   |   |-- hooks/
|   |   |-- pages/
|   |   |-- styles/
|   |   `-- utils/
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controller/
|   |   |-- data/
|   |   |-- middlewares/
|   |   |-- models/
|   |   |-- route/
|   |   |-- scripts/
|   |   `-- utils/
|-- docs/
|   `-- supabase-schema.svg
|-- package.json
`-- README.md
```

## How It Works

### Guest Mode

- Anyone can open the planner immediately
- Plans are saved in browser `localStorage`
- The homepage roadmap preview can fall back to guest planner data

### Account Mode

- Users can sign up, log in, and save multiple plans
- Planner data is tied to the authenticated user
- The homepage roadmap preview uses the signed-in student's year to choose which planner year to preview

## Local Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

```bash
cd backend
npm install
```

### 2. Create frontend env

Use a Vite env file such as `frontend/.env.development`.

```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_TURNSTILE_SITE_KEY=your_turnstile_site_key
```

### 3. Create backend env

The backend loads:

- `backend/.env.development` when `NODE_ENV` is not `production`
- `backend/.env` in production

Example development config:

```bash
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
TRUST_PROXY=true

DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_password
DATABASE_URL=postgres://postgres:your_password@localhost:5432/postgres
DB_SSL=false
DB_SSL_REJECT_UNAUTHORIZED=false

SECRET_KEY=replace_me
JWT_SECRET=replace_me
TURNSTILE_SECRET_KEY=your_turnstile_secret_key

EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
CONTACT_RECEIVER=your_email@example.com

ALLOW_DB_TEST_ROUTE=false
ALLOW_SEQUELIZE_SYNC=false
```

### 4. Seed course data

```bash
cd backend
npm run seed:dev
```

### 5. Start the backend

```bash
cd backend
npm run dev
```

Backend default URL:

```text
http://localhost:3000
```

### 6. Start the frontend

```bash
cd frontend
npm run dev
```

Frontend default URL:

```text
http://localhost:5173
```

## Scripts

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Backend

```bash
npm run dev
npm run start
npm run seed:dev
npm run poll:offerings
```

## Main API Routes

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Planner

- `GET /api/planners`
- `POST /api/planners`
- `GET /api/planners/:id`
- `PUT /api/planners/:id`
- `DELETE /api/planners/:id`

### Other

- `GET /api/courses`
- `POST /api/contact`
- `GET /health`

## Notes

- Planner PDF export is generated on the frontend
- Auth uses cookie-based sessions with JWTs in `HttpOnly` cookies
- Login and signup are rate-limited
- Contact and auth forms use Cloudflare Turnstile
- Password reset links are emailed from the backend and point to the frontend reset page
- In development, Sequelize sync only runs when `ALLOW_SEQUELIZE_SYNC=true`
- The root `package.json` is not the main app entry point; day-to-day work happens inside `frontend/` and `backend/`

## Contributors

- Phuc Truong
- Jordan Nguyen
