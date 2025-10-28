import User from '../../models/user_model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { asyncHandler } from '../../utils/errorHandler.js';
import { successResponse, errorResponse, notFoundResponse } from '../../utils/apiResponse.js';
import { validateRequired, validateEmail } from '../../utils/validation.js';
import { config } from '../../configs/config.js';

const signIn = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    try {
        validateRequired(email, 'Email');
        validateEmail(email);
        validateRequired(password, 'Password');
    } catch (err) {
        return errorResponse(res, 'Email and password are required', 400);
    }
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return errorResponse(res, 'Invalid credentials', 401);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return errorResponse(res, 'Invalid credentials', 401);
    }
    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        config.jwtSecret,
        { expiresIn: config.jwtExpire }
    );
    user.password = undefined;
    user.confirm_password = undefined;

    res.cookie('token', token, {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        maxAge: config.jwtCookieExpire * 24 * 60 * 60 * 1000
    });
    return successResponse(res, {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isAdmin: user.role === 'admin'
        },
        token
    }, 'Sign in successful');
});

export default signIn;