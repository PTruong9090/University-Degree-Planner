import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ENV } from './config/env.js';
import courseRouter from './route/courseRoute.js';
import authRouter from './route/authRoute.js';
import contactRouter from './route/contactRoute.js';
import plannerRouter from './route/plannerRoute.js';
import { sequelize } from './models/index.js';

const app = express()
app.use(cookieParser());
app.use(helmet());

const allowedOrigins = new Set([
  "https://planbear.io",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://api.planbear.io",
]);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json({ limit: '100kb' }))

// Router setup
app.use('/api/courses', courseRouter);
app.use('/api/auth', authRouter);
app.use('/api/contact', contactRouter)
app.use('/api/planners', plannerRouter)


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
