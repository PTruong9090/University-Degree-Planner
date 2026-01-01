# 🐻 PlanBear

**PlanBear** is a modern, web-based **university degree planner** that helps students explore courses, build multi-year academic plans, and optionally save them across devices.

Users can start planning **without creating an account**, then sign up later to persist and sync their plans.

---

## ✨ Features

### ✅ Available Now
- 📚 Browse and search university courses  
- 🧩 Build a flexible 4-year academic plan  
- 💾 Save plans locally using `localStorage`  
- 📄 Export plans to PDF  
- 📱 Responsive, mobile-friendly UI  
- 🔐 Secure authentication (JWT + HTTP-only cookies)

### 🚧 Planned
- ☁️ Cloud-saved plans for logged-in users  
- 🔄 Cross-device plan syncing  
- 👤 User profiles & dashboards  
- 📌 Multiple saved plans per user  
- 🧠 Prerequisite validation & smart warnings  

---

## 🧱 Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Headless UI

### Backend
- Node.js
- Express
- Sequelize ORM
- PostgreSQL
- JWT Authentication
- bcrypt

### Infrastructure
- AWS (RDS, Elastic Beanstalk)
- PostgreSQL
- HTTPS
- Environment-based configuration

---

## 🔐 Authentication Model

PlanBear uses a **progressive authentication model**.

### Guests can:
- Browse courses
- Build and edit plans
- Save plans locally in the browser

### Logged-in users can:
- Save plans to the database
- Access plans across devices
- Manage account data

### Security details:
- JWTs stored in **HTTP-only cookies**
- Middleware-based route protection
- Public routes remain accessible to guests
- Protected routes require authentication

---

## 📁 Project Structure

```text
planbear/
├── frontend/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── pages/
│   └── utils/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── config/
│   └── server.js
│
└── README.md
```

---

## 🚀 Getting Started (Local Development)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/planbear.git
cd planbear
```

### 2️⃣ Frontend setup
```bash
cd frontend
npm install
npm run dev
```

Runs on:
`http:localhost:5173`

### 3️⃣ Backend setup
```bash
cd backend
npm install
npm run dev
```

Runs on:
`http:localhost:3000`

### ⚙️ Environment Variables
Create a `.env` file in the backend directory:

```bash
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/planbear
JWT_SECRET=your-super-secret-key
NODE_ENV=development
```

### 📡 API Overview
```bash
GET    /api/courses
POST   /api/auth/signup
POST   /api/auth/login
```

## 👥 Contributors

- **Phuc Truong** — Creator & Lead Developer  
- **Jordan Nguyen** — Project Partner & Core Developer
