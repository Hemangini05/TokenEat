const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    menuItemId: { type: String, required: true }, // Using String IDs as per menu data
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now }
});

// Ensure one review per user per item
ReviewSchema.index({ userId: 1, menuItemId: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
