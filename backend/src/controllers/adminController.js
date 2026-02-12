/**
 * Admin Controller
 */
const User = require('../models/User');
const Token = require('../models/Token');
const Order = require('../models/Order');
const Counter = require('../models/Counter');
const { asyncHandler } = require('../middleware/errorHandler');

const getDashboardStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const todayOrders = await Order.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    const totalTokens = await Token.countDocuments();
    const activeCounters = await Counter.countDocuments({ isOpen: true });

    const recentOrders = await Order.find()
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(10);

    res.status(200).json({
        success: true,
        data: {
            totalUsers,
            totalOrders,
            todayOrders,
            totalTokens,
            activeCounters,
            recentOrders
        }
    });
});

const getDailyUsage = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tokens = await Token.find({ createdAt: { $gte: today } });

    const usage = { breakfast: 0, lunch: 0, dinner: 0, snacks: 0 };
    tokens.forEach(t => { if (usage[t.mealType] !== undefined) usage[t.mealType]++; });

    res.status(200).json({ success: true, data: usage });
});

const getWeeklyUsage = asyncHandler(async (req, res) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const tokens = await Token.find({ createdAt: { $gte: weekAgo } });

    res.status(200).json({ success: true, data: { total: tokens.length, tokens } });
});

const getCounterAnalytics = asyncHandler(async (req, res) => {
    const counters = await Counter.find();
    res.status(200).json({ success: true, data: counters });
});

module.exports = { getDashboardStats, getDailyUsage, getWeeklyUsage, getCounterAnalytics };
