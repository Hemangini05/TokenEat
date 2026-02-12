/**
 * Express Application Configuration
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const counterRoutes = require('./routes/counterRoutes');
const adminRoutes = require('./routes/adminRoutes');
const menuRoutes = require('./routes/menuRoutes');
const queueRoutes = require('./routes/queueRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// CORS configuration - allow all origins in development
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security headers (helmet disabled for dev)
// const helmet = require('helmet');
// app.use(helmet());

// Rate limiting (disabled temporarily)
// const rateLimit = require('express-rate-limit');
// const limiter = rateLimit({
//     windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
//     max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
//     message: { success: false, message: 'Too many requests, please try again later' }
// });
// app.use('/api/', limiter);

// Serve static files (assets, uploads) matches new structure
app.use('/assets', express.static(path.join(__dirname, '..', '..', 'assets')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'TokenEats API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/counters', counterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/waste', require('./routes/wasteRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/suggestions', require('./routes/suggestionRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));

// For non-API routes, serve index.html (SPA fallback)
app.use((req, res) => {
    if (req.originalUrl.startsWith('/api/')) {
        return res.status(404).json({
            success: false,
            message: `Route ${req.originalUrl} not found`
        });
    }
    res.sendFile(path.join(__dirname, '..', '..', 'index.html'));
});

// Global error handler
app.use(errorHandler);

module.exports = app;
