import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import courseRouter from './route/courseRoute.js';
import authRouter from './route/authRoute.js'; //added the auth router 
import { sequelize } from './models/index.js';

const app = express()

const allowedOrigins =
  ENV.NODE_ENV === "production"
    ? ["https://planbear.io"]
    : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

// Middleware
app.use(express.json())

// Router setup
app.use('/api/courses', courseRouter);
app.use('/api/auth', authRouter);


const PORT = ENV.PORT || 3000

app.get('/health', (req, res) => {
  res.status(200).send('ok');
});

app.get("/api/db-test", async (req, res) => {
  try {
    await sequelize.query("SELECT 1");
    res.send("DB OK");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    if (ENV.NODE_ENV === "development") {
      console.log("Running in development mode");
    }

    if (ENV.NODE_ENV !== "production") {
        await sequelize.sync({ alter: true });
        console.log('✅ Database synced');
    }

    app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
})();
