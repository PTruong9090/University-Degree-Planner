import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                status: 'Error',
                message: 'Authentication required'
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.SECRET_KEY)

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