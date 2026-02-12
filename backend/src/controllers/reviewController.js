/**
 * Review Controller
 */
const Review = require('../models/Review');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

const addReview = asyncHandler(async (req, res) => {
    try {
        const review = await Review.create({
            ...req.body,
            userId: req.user.id
        });
        res.status(201).json({ success: true, message: 'Review added successfully', data: review });
    } catch (error) {
        if (error.code === 11000) {
            throw new ApiError('You have already reviewed this item', 400);
        }
        throw error;
    }
});

const getReviews = asyncHandler(async (req, res) => {
    const { menuItemId } = req.params;
    const adjustQuery = menuItemId ? { menuItemId } : {};

    const reviews = await Review.find(adjustQuery)
        .populate('userId', 'name')
        .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reviews });
});

module.exports = { addReview, getReviews };
