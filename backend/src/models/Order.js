const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number, default: 1 }
    }],
    totalAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'], default: 'pending' },
    deliveryOption: { type: String, enum: ['pickup', 'table-delivery'], default: 'pickup' },
    tableNumber: { type: String },
    isGreenToken: { type: Boolean, default: false },
    receiptId: { type: String, unique: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

// Generate receipt ID before saving
OrderSchema.pre('save', function (next) {
    if (!this.receiptId) {
        this.receiptId = 'TE-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Order', OrderSchema);
