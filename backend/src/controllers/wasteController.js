/**
 * Waste Controller
 */
const Waste = require('../models/Waste');
const Order = require('../models/Order'); // Required for Green Token stats
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

const logWaste = asyncHandler(async (req, res) => {
    const waste = await Waste.create({
        ...req.body,
        userId: req.user.id
    });
    res.status(201).json({ success: true, message: 'Waste logged successfully', data: waste });
});

const getWasteHistory = asyncHandler(async (req, res) => {
    const waste = await Waste.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: waste });
});

const getWasteAnalytics = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysWaste = await Waste.aggregate([
        { $match: { createdAt: { $gte: today } } },
        { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);

    const weeklyWaste = await Waste.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(new Date().setDate(new Date().getDate() - 7))
                }
            }
        },
        { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);

    // Calculate Green Token Savings (50g per token)
    const greenTokenCount = await Order.countDocuments({ isGreenToken: true });
    const savedMassKg = greenTokenCount * 0.05; // 50g = 0.05kg

    res.status(200).json({
        success: true,
        data: {
            today: todaysWaste,
            weekly: weeklyWaste,
            savedMassKg,
            totalWaste: todaysWaste.length > 0 ? todaysWaste[0].total : 0 // Fallback
        }
    });
});

module.exports = { logWaste, getWasteHistory, getWasteAnalytics };
