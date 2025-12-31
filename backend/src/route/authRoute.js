// Route handlers for signup/login live in the auth controller.
import { signup, login } from '../controller/authController.js';
// Express router groups auth endpoints under a single router instance.
import express from 'express';

const router = express.Router();

// Accept POST /api/auth/signup for account creation.
router.route('/signup').post(signup);
// Accept POST /api/auth/login for user authentication.
router.route('/login').post(login)

export default router;
