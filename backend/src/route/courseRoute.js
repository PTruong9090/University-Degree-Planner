import express from 'express'
import { getCourse } from '../controller/courseController.js'

const router = express.Router()
router.get('/', getCourse)

export default router