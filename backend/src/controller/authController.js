import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'
import { Op } from 'sequelize';
import { verifyTurnstile } from '../utils/verifyTurnstile.js';
import crypto from "crypto";
import PasswordResetToken from '../models/passwordReset.model.js';
import { isMailerConfigured, transporter } from '../config/mailer.js'
import sequelize from '../config/database.js';
import { ENV } from '../config/env.js';


const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    ...(ENV.COOKIE_DOMAIN ? { domain: ENV.COOKIE_DOMAIN } : {}),
};

function generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Sign up controller
export const signup = async (req, res, next) => {
    try {
        const { email, username, password, studentYear, turnstileToken } = req.body;
        const normalizedStudentYear = String(studentYear ?? '').trim().toLowerCase();
        const allowedStudentYears = ['freshman', 'sophomore', 'junior', 'senior'];

        if (!turnstileToken) {
            return res.status(400).json({
                status: 'Error',
                message: 'Turnstile token is required'
            });
        }

        // Validation
        if (!email || !username || !password || !normalizedStudentYear) {
            return res.status(400).json({
                status: 'Error',
                message: 'Please provide email, username, password, and student year'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                status: 'Error',
                message: 'Password must be at least 8 characters long'
            });
        }

        const normalizedEmail = email.trim().toLowerCase()
        const normalizedUsername = username.trim().toLowerCase()

        const isHuman = await verifyTurnstile(turnstileToken, req.ip);
        if (!isHuman.success) {
            return res.status(400).json({
                status: 'Error',
                message: 'Captcha failed',
            })
        }

        if (!allowedStudentYears.includes(normalizedStudentYear)) {
            return res.status(400).json({
                status: 'Error',
                message: 'Student year must be freshman, sophomore, junior, or senior'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                { email: normalizedEmail },
                { username: normalizedUsername }
                ]
            }
            });


        if (existingUser) {
            return res.status(400).json({
                status: 'Error',
                message: 'User with this email or username already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            email: normalizedEmail,
            username: normalizedUsername,
            password: hashedPassword,
            studentYear: normalizedStudentYear
        })

        res.status(201).json({
            status: 'Success',
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
                studentYear: newUser.studentYear
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Server error during registration'
        });
    }
};

// Login controller
export const login = async (req, res, next) => {
    try {
        const { username, password, turnstileToken } = req.body;


        if (!turnstileToken) {
            return res.status(400).json({
                status: 'Error',
                message: 'Turnstile token is required'
            });
        }

        // Validation
        if (!username || !password) {
            return res.status(400).json({
                status: 'Error',
                message: 'Please provide username and password'
            });
        }

        const normalizedUsername = username.trim().toLowerCase();

        const isHuman = await verifyTurnstile(turnstileToken, req.ip);
        if (!isHuman.success) {
            return res.status(400).json({
                status: 'Error',
                message: 'Captcha failed',
            })
        }

        // Find user
        const user = await User.findOne({ where: { username: normalizedUsername } });


        if (!user) {
            return res.status(401).json({
                status: 'Error',
                message: 'Invalid username or password'
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'Error',
                message: 'Invalid username or password'
            });
        }

        // Generate JWT token
        if (!ENV.JWT_SECRET) {
            return res.status(500).json({
                status: 'Error',
                message: 'Authentication is not configured correctly'
            });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            ENV.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.cookie('token', token, COOKIE_OPTIONS);

        res.status(200).json({
            status: 'Success',
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                studentYear: user.studentYear
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Server error during login'
        });
    }
};

export const me = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'email', 'username', 'studentYear', 'createdAt', 'updatedAt']
        });

        if (!user) {
            return res.status(404).json({
                status: 'Error',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'Success',
            user
        });
    } catch (error) {
        console.error('Me error:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Server error while loading user'
        });
    }
};

export const logout = async (req, res) => {
    res.clearCookie('token', {
        ...COOKIE_OPTIONS,
        maxAge: undefined,
    });

    res.status(200).json({
        status: 'Success',
        message: 'Logout successful'
    });
};

export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                status: 'Error',
                message: 'Email is required'
            })
        }

        const normalizedEmail = email.trim().toLowerCase()

        // Verify email
        const user = await User.findOne({ where: { email: normalizedEmail } })

        if (!user) {
            return res.json({
                message: "If that email exists, a reset link has been sent"
            })
        }

        if (!isMailerConfigured) {
            return res.status(503).json({
                status: 'Error',
                message: 'Password reset email is not configured'
            })
        }

        const resetToken = generateResetToken()

        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex')

        const expiresAt = new Date(Date.now() + 1000 * 60 * 15)   // 15 min

        // Revoke old tokens
        await PasswordResetToken.update(
            { revokedAt: new Date() },
            {
                where: {
                    userid: user.id,
                    usedAt: null,
                    revokedAt: null,
                }
            }
        )

        // Create new token entry
        await PasswordResetToken.create({
            userid: user.id,
            tokenHash: hashedToken,
            expiresAt,
            requestIp: req.ip,
            userAgent: req.headers['user-agent']
        })

        const resetURL = `${ENV.FRONTEND_URL.replace(/\/$/, '')}/reset-password?token=${resetToken}`

        await transporter.sendMail({
            from: 'PlanBear <noreply@planbear.io>',
            to: user.email,
            subject: "Reset your password",
            html: `
                <p>You requested a password reset.</p>
                <p>Click the link below:</p>
                <a href="${resetURL}">${resetURL}</a>
                <p>This link expires in 15 minutes.</p>
            `,
            });

        return res.json({
            message: "If that email exists, a reset link has been sent",
        });
    } catch (error) {
        console.error('Password reset request error:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Server error during password reset request'
        })
    }
}


export const resetPassword = async (req, res) => {
    let transaction

    try {

        const { token, password } = req.body

        if (!token || !password) {
            return res.status(400).json({
                message: "Token and password are required"
            })
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long"
            })
        }

        transaction = await sequelize.transaction()


        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex')

        const tokenRequest = await PasswordResetToken.findOne({
            where: {
                tokenHash: hashedToken,
                usedAt: null,
                revokedAt: null,
                expiresAt: {
                    [Op.gt]: new Date(),
                }
            },
            transaction,
            lock: transaction.LOCK.UPDATE
        })

        if (!tokenRequest) {
            await transaction.rollback()
            return res.status(400).json({
                message: "Invalid or expired token"
            })
        }

        // Use token
        const [updatedCount] = await PasswordResetToken.update(
            { usedAt: new Date() },
            {
                where: {
                    id: tokenRequest.id,
                    usedAt: null,
                    revokedAt: null,
                },
                transaction,
            }
        )

        // Extra safety for race conditions
        if (updatedCount !== 1) {
            await transaction.rollback()
            return res.status(500).json({
                message: "Failed to use token"
            })
        }

        await User.update(
            { password: await bcrypt.hash(password, 10) },
            {
                where: {
                    id: tokenRequest.userid,
                },
                transaction,
            }
        )

        await transaction.commit()
        return res.json({
            message: "Password reset successful"
        })
        
    } catch (error) {
        if (transaction) {
            await transaction.rollback()
        }
        console.error('Password reset error:', error);
        res.status(500).json({
            status: "Error",
            message: "Server error during password reset"
        })
    }

}
