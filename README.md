# PlanBear

PlanBear is a UCLA-style degree planning app for building quarter-based academic roadmaps, organizing multiple plans, and keeping course schedules in one place.

The app supports both guest and authenticated usage:

- Guest mode stores plans in browser `localStorage`
- Account mode stores plans in PostgreSQL through the backend

## What It Does

- Browse and search a large course catalog
- Build a four-year quarter-based plan with drag and drop
- Create, rename, switch, and delete multiple planners
- Use the planner without creating an account
- Sign up with a student year: `freshman`, `sophomore`, `junior`, or `senior`
- Show an Academic Roadmap preview on the homepage for the current quarter
- Use the signed-in student's year to choose the roadmap section
- Fall back to `Year 1` on the homepage when the user is not signed in
- Export plans to PDF
- Work on desktop and mobile

## How The Planner Works

### Guest mode

- Anyone can open the planner immediately
- Plans are saved in browser `localStorage`
- If backend auth is unavailable, the planner falls back to guest mode

### Account mode

- Users can sign up and log in
- Planner records are tied to the authenticated user
- Saved plans are loaded from the backend
- The homepage roadmap card uses the student's saved year to decide which planner year to preview

## Academic Roadmap Card

The homepage includes an Academic Roadmap preview that:

- detects the current quarter from the current date
- selects the matching planner year based on the signed-in student's year
- defaults to `year1` if the user is not signed in
- shows the first 3 courses in that quarter
- shows a placeholder if there are no planned courses
- falls back to guest planner data when the user is working locally

## Stack

### Frontend

- React 18
- Vite
- Tailwind CSS 4
- React Router
- `@dnd-kit/core`
- jsPDF

### Backend

- Node.js
- Express
- Sequelize
- PostgreSQL
- JWT authentication with `HttpOnly` cookies

## Security Notes

The backend currently includes a few basic hardening measures:

- JWT session cookie stored as `HttpOnly`
- `helmet` for common HTTP security headers
- auth route rate limiting on login and signup
- cookie-based authenticated planner routes
- password hashing with `bcryptjs`

Current limitations:

- development uses Sequelize model sync in non-production mode
- database SSL is enabled, but certificate verification should still be reviewed for production deployment
- there is no full CSRF protection layer yet

## API Surface

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

## Project Structure

```text
University Degree Planner/
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- features/
|   |   |-- hooks/
|   |   |-- pages/
|   |   `-- utils/
|
|-- backend/
|   |-- migrations/
|   |-- src/
|   |   |-- config/
|   |   |-- controller/
|   |   |-- middlewares/
|   |   |-- models/
|   |   |-- route/
|   |   `-- scripts/
|
`-- README.md
```

## Local Development

### 1. Install dependencies

Install root dependencies if needed:

```bash
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

### 2. Configure environment variables

Frontend environment files:

- `frontend/.env.development`
- `frontend/.env.production`

Typical frontend variable:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

Backend environment files:

- `backend/.env`
- `backend/.env.development`

Typical backend development variables:

```bash
NODE_ENV=development
PORT=3000
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DATABASE_URL=postgres://username:password@localhost:5432/postgres
SECRET_KEY=your_secret
JWT_SECRET=your_jwt_secret
```

### 3. Start the backend

```bash
cd backend
npm run dev
```

Backend default URL:

```text
http://localhost:3000
```

### 4. Start the frontend

```bash
cd frontend
npm run dev
```

Frontend default URL:

```text
http://localhost:5173
```

## Common Scripts

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

### Backend

```bash
npm run dev
npm run start
npm run seed:dev
```

## Notes

- The frontend caches course data to reduce repeated catalog fetches
- Public course browsing does not require login
- Planner routes require authentication
- PDF export is generated client-side
- In non-production mode, the backend currently runs `sequelize.sync({ alter: true })`

## Contributors

- Phuc Truong
- Jordan Nguyen
