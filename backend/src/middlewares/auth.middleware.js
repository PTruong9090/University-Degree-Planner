import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export const requireAuth = (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                status: 'Error',
                message: 'Authentication required'
            })
        }

        if (!ENV.JWT_SECRET) {
            return res.status(500).json({
                status: 'Error',
                message: 'Authentication is not configured correctly'
            })
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET)

        req.user = {
            id: decoded.id,
            username: decoded.username
        }

        next()
    } catch (error) {
        return res.status(401).json({
            status: 'Error',
            message: 'Invalid or expired token'
        })
    }
}
