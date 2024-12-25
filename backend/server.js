require('dotenv').config({path: `${process.cwd()}/.env`})

const express = require('express')
const cors = require('cors')
const authRouter = require('./route/authRoute')
const courseRouter = require('./route/courseRoute')

const app = express()

// Middleware
app.use(express.json())
app.use(cors())

// Router setup
app.use('/api/v1/auth', authRouter)
app.use('/api', courseRouter);

const PORT = process.env.APP_PORT || 3000

app.listen(PORT, () => console.log(`Server has started on port: ${PORT}`))

