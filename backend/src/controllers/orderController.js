/**
 * Order Controller
 */
const Order = require('../models/Order');
const Menu = require('../models/Menu');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

const createOrder = asyncHandler(async (req, res) => {
    const { items, deliveryOption, tableNumber } = req.body;

    // Build order items with details from menu
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
        const menuItem = await Menu.findById(item.menuItemId);
        if (menuItem) {
            const orderItem = {
                menuItemId: menuItem._id,
                name: menuItem.name,
                price: menuItem.price,
                quantity: item.quantity
            };
            orderItems.push(orderItem);
            totalAmount += menuItem.price * item.quantity;
        }
    }

    const order = await Order.create({
        userId: req.user.id,
        items: orderItems,
        totalAmount,
        deliveryOption: deliveryOption || 'pickup',
        tableNumber
    });

    res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
});

const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
});

const getOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) throw new ApiError('Order not found', 404);
    res.status(200).json({ success: true, data: order });
});

const getOrderReceipt = asyncHandler(async (req, res) => {
    const receiptId = req.params.receiptId.replace('.pdf', '');
    const order = await Order.findOne({ receiptId }).populate('userId', 'name email');
    if (!order) throw new ApiError('Order not found', 404);
    res.status(200).json({ success: true, data: order });
});

module.exports = { createOrder, getMyOrders, getOrder, getOrderReceipt };
