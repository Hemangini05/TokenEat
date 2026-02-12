const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: [true, 'Please provide complaint content'], trim: true },
    image: { type: String },
    isAnonymous: { type: Boolean, default: true },
    status: { type: String, enum: ['active', 'resolved', 'archived'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
