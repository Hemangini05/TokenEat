const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tokenCode: { type: String, required: true, unique: true },
    mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snacks'], required: true },
    status: { type: String, enum: ['unused', 'used', 'expired'], default: 'unused' },
    counterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Counter' },
    qrCode: { type: String },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date },
    usedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Token', TokenSchema);
