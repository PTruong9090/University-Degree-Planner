import bcrypt from 'bcryptjs'; // encrypts passwords so if database hypothetically gets breached it would be encrypted W security
import jwt from 'jsonwebtoken'; // saves a token so we dont need to go through the database for every call ICL i dont understand this code much... 
import User from '../models/user.model.js'
import { Op } from 'sequelize';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
};

// Sign up controller
export const signup = async (req, res, next) => {
    try {
        const { email, username, password, studentYear } = req.body;
        const normalizedStudentYear = String(studentYear ?? '').trim().toLowerCase();
        const allowedStudentYears = ['freshman', 'sophomore', 'junior', 'senior'];

        // Validation
        if (!email || !username || !password || !normalizedStudentYear) {
            return res.status(400).json({
                status: 'Error',
                message: 'Please provide email, username, password, and student year'
            });
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
                { email },
                { username }
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
            email,
            username,
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

//Login controller
export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({
                status: 'Error',
                message: 'Please provide username and password'
            });
        }

        // Find user
        const user = await User.findOne({ where: { username } });


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
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || process.env.SECRET_KEY, 
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

