import { sendEmail } from "../controller/contactController.js";
import express from 'express';

const router = express.Router();

router.route('/').post(sendEmail)

export default router;