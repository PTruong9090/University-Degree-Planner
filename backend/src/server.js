import express from 'express';
import cors from 'cors';
import courseRouter from './route/courseRoute.js';

const app = express()

// Middleware
app.use(express.json())
app.use(cors())

// Router setup
app.use('/api/courses', courseRouter);

const PORT = process.env.APP_PORT || 3000

app.get('/health', (req, res) => {
  res.status(200).send('ok');
});


app.listen(PORT, () => console.log(`Server has started on port: ${PORT}`))

