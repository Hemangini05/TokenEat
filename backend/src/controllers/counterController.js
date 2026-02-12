/**
 * Counter Controller
 */
const Counter = require('../models/Counter');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

const getCounterAvailability = asyncHandler(async (req, res) => {
    let counters = await Counter.find().lean();

    // Custom sort: Vegetarian first
    const typeOrder = ['Vegetarian', 'Non-Vegetarian', 'Snacks & Beverages', 'Special Menu'];

    counters.sort((a, b) => {
        const indexA = typeOrder.indexOf(a.type);
        const indexB = typeOrder.indexOf(b.type);

        // If both in known list, sort by index
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;

        // If only one in list, put it first
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;

        // Fallback to name
        return a.name.localeCompare(b.name);
    });

    res.status(200).json({ success: true, data: { counters } });
});

const getCounter = asyncHandler(async (req, res) => {
    const counter = await Counter.findById(req.params.id);
    if (!counter) throw new ApiError('Counter not found', 404);
    res.status(200).json({ success: true, data: counter });
});

const updateCounter = asyncHandler(async (req, res) => {
    let counter = await Counter.findById(req.params.id);
    if (!counter) throw new ApiError('Counter not found', 404);
    counter = await Counter.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Counter updated', data: counter });
});

const createCounter = asyncHandler(async (req, res) => {
    const counter = await Counter.create(req.body);
    res.status(201).json({ success: true, message: 'Counter created', data: counter });
});

module.exports = { getCounterAvailability, getCounter, updateCounter, createCounter };
