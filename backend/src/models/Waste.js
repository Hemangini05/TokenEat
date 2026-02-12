const mongoose = require('mongoose');

const WasteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['food-waste', 'donation', 'compost'], required: true },
    amount: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
    description: { type: String },
    date: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Waste', WasteSchema);
