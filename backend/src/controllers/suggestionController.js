/**
 * Suggestion Controller
 */
const Suggestion = require('../models/Suggestion');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

const createSuggestion = asyncHandler(async (req, res) => {
    const suggestion = await Suggestion.create({
        ...req.body,
        userId: req.user.id
    });
    res.status(201).json({ success: true, message: 'Suggestion submitted successfully', data: suggestion });
});

const getSuggestions = asyncHandler(async (req, res) => {
    const suggestions = await Suggestion.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: suggestions });
});

module.exports = { createSuggestion, getSuggestions };
