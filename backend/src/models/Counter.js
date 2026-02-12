const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true },
    isOpen: { type: Boolean, default: true },
    currentLoad: { type: Number, default: 0 },
    maxCapacity: { type: Number, default: 50 },
    estimatedWaitTime: { type: Number, default: 0 },
    icon: { type: String, default: '🍽️' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Counter', CounterSchema);
