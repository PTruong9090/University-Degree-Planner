import { sendEmail } from "../controller/contactController.js";
import { authRateLimiter } from '../middlewares/security.middleware.js';
import express from 'express';

const router = express.Router();

router.route('/').post(sendEmail)

export default router;