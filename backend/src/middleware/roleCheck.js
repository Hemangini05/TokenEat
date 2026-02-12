/**
 * Role-Based Access Control Middleware
 */

const { ApiError } = require('./errorHandler');

const roleCheck = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError('Not authorized', 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new ApiError(`Role '${req.user.role}' is not authorized to access this route`, 403));
        }
        next();
    };
};

module.exports = { roleCheck };
