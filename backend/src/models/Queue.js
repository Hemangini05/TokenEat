const mongoose = require('mongoose');

const QueueSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    counterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Counter', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    position: { type: Number, required: true },
    status: { type: String, enum: ['waiting', 'serving', 'completed', 'cancelled'], default: 'waiting' },
    estimatedWaitTime: { type: Number, default: 0 },
    qrCode: { type: String },
    joinedAt: { type: Date, default: Date.now },
    servedAt: { type: Date }
});

module.exports = mongoose.model('Queue', QueueSchema);
