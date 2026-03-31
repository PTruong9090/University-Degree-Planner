// Route handlers for signup/login live in the auth controller.
import { requestPasswordReset, resetPassword } from '../controller/authController.js';
import { signup, login, logout, me } from '../controller/authController.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { authRateLimiter } from '../middlewares/security.middleware.js';
// Express router groups auth endpoints under a single router instance.
import express from 'express';

const router = express.Router();

// Accept POST /api/auth/signup for account creation.
router.route('/signup').post(authRateLimiter, signup);
// Accept POST /api/auth/login for user authentication.
router.route('/login').post(authRateLimiter, login)
router.route('/me').get(requireAuth, me)
router.route('/logout').post(requireAuth, logout)
router.route('/forgot-password').post(authRateLimiter, requestPasswordReset)
router.route('/reset-password').post(authRateLimiter, resetPassword)

export default router;
