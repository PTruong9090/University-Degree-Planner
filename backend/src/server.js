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

const app = express();
const defaultAllowedOrigins = [
  "https://planbear.io",
  "https://www.planbear.io",
  "http://localhost:5173",
  "http://localhost:3000",
];
const allowedOrigins = new Set(
  ENV.CORS_ALLOWED_ORIGINS.length > 0
    ? ENV.CORS_ALLOWED_ORIGINS
    : defaultAllowedOrigins
);

app.disable('x-powered-by');
app.set('trust proxy', ENV.TRUST_PROXY);
app.use(cookieParser());
app.use(helmet());
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
app.use(express.json({ limit: '100kb' }));

app.use('/api/courses', courseRouter);
app.use('/api/auth', authRouter);
app.use('/api/contact', contactRouter);
app.use('/api/planners', plannerRouter);

app.get('/health', (req, res) => {
  res.status(200).send('ok');
});

if (ENV.ALLOW_DB_TEST_ROUTE) {
  app.get("/api/db-test", async (req, res) => {
    try {
      await sequelize.query("SELECT 1");
      res.send("DB OK");
    } catch (err) {
      res.status(500).send("DB connection failed");
    }
  });
}

app.use((err, req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err?.message?.startsWith('CORS blocked for origin:')) {
    res.status(403).json({
      status: 'Error',
      message: 'Origin is not allowed by CORS policy',
    });
    return;
  }

  console.error('Unhandled server error:', err);
  res.status(500).json({
    status: 'Error',
    message: 'Internal server error',
  });
});

const PORT = ENV.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    if (ENV.NODE_ENV === "development") {
      console.log("Running in development mode");
    }

    if (ENV.ALLOW_SEQUELIZE_SYNC) {
      await sequelize.sync({ alter: true });
      console.log('Database synced through Sequelize');
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
})();
