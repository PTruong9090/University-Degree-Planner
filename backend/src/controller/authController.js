import bcrypt from 'bcryptjs'; // encrypts passwords so if database hypothetically gets breached it would be encrypted W security
import jwt from 'jsonwebtoken'; // saves a token so we dont need to go through the database for every call ICL i dont understand this code much... 

//Database i dont know how to access the database but ill add later
const users = []

//Sign up controller
export const signup = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;

        // Validation
        if (!email || !username || !password) {
            return res.status(400).json({
                status: 'Error',
                message: 'Please provide email, username, and password'
            });
        }

        // Check if user already exists
        const existingUser = users.find(
            user => user.email === email || user.username === username
        );

        if (existingUser) {
            return res.status(400).json({
                status: 'Error',
                message: 'User with this email or username already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            id: users.length + 1,
            email,
            username,
            password: hashedPassword,
            createdAt: new Date()
        };

        users.push(newUser);

        res.status(201).json({
            status: 'Success',
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username
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
        const user = users.find(u => u.username === username);

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
            process.env.JWT_SECRET || 'your-secret-key-change-this', // Use a strong secret key in production as a env varaible 
            { expiresIn: '24h' }
        );

        res.status(200).json({
            status: 'Success',
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username
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

