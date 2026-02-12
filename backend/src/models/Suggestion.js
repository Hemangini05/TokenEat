const mongoose = require('mongoose');

const SuggestionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    message: { type: String, required: [true, 'Please provide a message'], trim: true },
    status: { type: String, enum: ['pending', 'reviewed', 'implemented'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Suggestion', SuggestionSchema);
