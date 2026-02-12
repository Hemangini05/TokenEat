/**
 * MealFlow Backend Server
 * Entry point for the application
 */

require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Connect to MongoDB
connectDB();

const server = app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════╗
║    TokenEats API Server               ║
║    Port:       ${PORT}                    ║
║    Env:        ${NODE_ENV}            ║
║    Status:     Running                ║
║    Database:   localhost              ║
╚═══════════════════════════════════════╝
`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    process.exit(1);
});
