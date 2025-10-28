import User from "../../models/user_model.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import { successResponse, notFoundResponse, errorResponse, validationErrorResponse } from "../../utils/apiResponse.js";
import { validateObjectId, validateRequired, validateEmail } from "../../utils/validation.js";

const updateUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const { name, email, password, confirm_password, role } = req.body;
    const updateData = {};
    const errors = [];
    try {
        validateObjectId(userId, 'User ID');
        if (name && name.trim()) updateData.name = name.trim();
        if (email && email.trim()) {
            validateEmail(email.trim());
            updateData.email = email.trim();
        }
        if (role) updateData.role = role;
        if (password) {
            validateRequired(confirm_password, 'Confirm Password');
            if (password !== confirm_password) {
                throw new Error('Passwords do not match');
            }
            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }
            updateData.password = password;
            updateData.confirm_password = confirm_password;
        } else if (confirm_password) {
            throw new Error('Password is required when confirm password is provided');
        }

    } catch (err) {
        errors.push({ message: err.message });
    }
    if (errors.length > 0) {
        return validationErrorResponse(res, errors);
    }
    if (Object.keys(updateData).length === 0) {
        return errorResponse(res, 'No update data provided', 400);
    }
    if (updateData.email) {
        const existingUser = await User.findOne({
            email: updateData.email,
            _id: { $ne: userId }
        });
        if (existingUser) {
            return errorResponse(res, 'Email is already registered by another user', 409);
        }
    }
    try {
        const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
        if (!user) {
            return notFoundResponse(res, 'User');
        }
        user.password = undefined;
        user.confirm_password = undefined;
        return successResponse(res, {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isAdmin: user.role === 'admin'
            }
        }, 'Profile updated successfully');
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message
            }));
            return validationErrorResponse(res, validationErrors);
        }
        if (error.code === 11000) {
            return errorResponse(res, 'Email is already registered by another user', 409);
        }
        return errorResponse(res, 'Failed to update profile', 500);
    }
});

export default updateUser;