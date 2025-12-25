import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import courseRouter from './route/courseRoute.js';
import { sequelize } from './models/index.js';

const app = express()

// Middleware
app.use(express.json())
app.use(cors())

// Router setup
app.use('/api/courses', courseRouter);

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

    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');

    app.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
})();
