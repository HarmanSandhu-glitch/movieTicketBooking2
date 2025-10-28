import User from "../../models/user_model.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import { successResponse, errorResponse, validationErrorResponse } from "../../utils/apiResponse.js";
import { validateRequired, validateEmail } from "../../utils/validation.js";

const signUp = asyncHandler(async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    try {
        validateRequired(name, 'Name');
        validateRequired(email, 'Email');
        validateEmail(email);
        validateRequired(password, 'Password');
        validateRequired(confirm_password, 'Confirm Password');
        if (password.length < 6) {
            errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
        }
        if (password !== confirm_password) {
            errors.push({ field: 'confirm_password', message: 'Passwords do not match' });
        }
    } catch (err) {
        errors.push({ message: err.message });
    }
    if (errors.length > 0) {
        return validationErrorResponse(res, errors);
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return errorResponse(res, 'Email is already registered', 409);
    }
    const newUser = new User({ name, email, password, confirm_password });
    await newUser.save();
    return successResponse(res, {
        user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
    }, 'User registered successfully', 201);
});

export default signUp;