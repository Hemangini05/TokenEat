/**
 * Auth Controller
 */
const User = require('../models/User');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

const register = asyncHandler(async (req, res) => {
    const { name, email, password, role, studentId } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError('Email already registered', 400);
    }

    // Enforce Role-Based Passwords
    if (role === 'admin' && password !== 'adminxim') {
        throw new ApiError('Invalid password for Admin role', 400);
    }
    if (role === 'mess_incharge' && password !== 'Incharge') {
        throw new ApiError('Invalid password for Mess Incharge role', 400);
    }

    const user = await User.create({ name, email, password, role: role || 'student', studentId });
    const token = user.getSignedJwtToken();

    res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
            user: { _id: user._id, name: user.name, email: user.email, role: user.role, studentId: user.studentId },
            token
        }
    });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError('Please provide email and password', 400);
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new ApiError('Invalid credentials', 401);
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new ApiError('Invalid credentials', 401);
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            user: { _id: user._id, name: user.name, email: user.email, role: user.role, studentId: user.studentId, greenTokens: user.greenTokens },
            token
        }
    });
});

const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    });
});

module.exports = { register, login, getMe };
