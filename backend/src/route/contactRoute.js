import { sendEmail } from "../controller/contactController.js";
import { contactRateLimiter } from '../middlewares/security.middleware.js';
import express from 'express';

const router = express.Router();

router.route('/').post(contactRateLimiter, sendEmail)

export default router;