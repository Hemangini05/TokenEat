/**
 * JWT Authentication Middleware
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ApiError, asyncHandler } = require('./errorHandler');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw new ApiError('Not authorized to access this route', 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            throw new ApiError('User not found', 401);
        }
        next();
    } catch (err) {
        throw new ApiError('Not authorized to access this route', 401);
    }
});

module.exports = { protect };
