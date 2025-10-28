import jwt from 'jsonwebtoken';
import { config } from '../configs/config.js';

const JWT_SECRET = config.jwtSecret;

function isAuth(req, res, next) {
    let token = null;
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required. Please login.'
        });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (config.nodeEnv === 'development') {
            console.error('JWT verification error:', err.message);
        }
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token. Please Signin again.'
        });
    }
}

function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: 'Access denied: Admins only'
    });
}

export { isAuth, isAdmin };
