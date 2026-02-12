const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Please provide item name'], trim: true },
    category: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snacks'], required: true },
    description: { type: String, trim: true },
    price: { type: Number, default: 0 },
    isVeg: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    calories: { type: Number },
    date: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Menu', MenuSchema);
