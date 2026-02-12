/**
 * Complaint Controller
 */
const Complaint = require('../models/Complaint');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

const createComplaint = asyncHandler(async (req, res) => {
    let image = null;
    if (req.file) {
        image = `/uploads/${req.file.filename}`;
    }

    const complaint = await Complaint.create({
        content: req.body.content,
        image,
        userId: req.user ? req.user.id : null
    });
    res.status(201).json({ success: true, message: 'Complaint submitted successfully', data: complaint });
});

const getComplaints = asyncHandler(async (req, res) => {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: complaints });
});

const getPublicComplaints = asyncHandler(async (req, res) => {
    const complaints = await Complaint.find({ status: { $ne: 'archived' } })
        .sort({ createdAt: -1 })
        .limit(50);
    res.status(200).json({ success: true, data: complaints });
});

module.exports = { createComplaint, getComplaints, getPublicComplaints };
