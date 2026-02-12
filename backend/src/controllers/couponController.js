/**
 * Coupon Controller
 */
const Coupon = require('../models/Coupon');
const Order = require('../models/Order');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

const createCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, message: 'Coupon created successfully', data: coupon });
});

const validateCoupon = asyncHandler(async (req, res) => {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) throw new ApiError('Invalid coupon code', 404);
    if (!coupon.isActive) throw new ApiError('Coupon is inactive', 400);
    if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new ApiError('Coupon expired', 400);
    if (coupon.maxUses <= coupon.usedCount) throw new ApiError('Coupon usage limit reached', 400);

    res.status(200).json({ success: true, message: 'Coupon applied', data: coupon });
});

const redeemCoupon = asyncHandler(async (req, res) => {
    // Check if this is a Green Token "Pay What You Want" / Leftover redemption
    if (req.body.paidAmount !== undefined) {
        const { paidAmount } = req.body;

        // Create an official Order for tracking
        const order = await Order.create({
            userId: req.user.id,
            items: [{
                name: 'Green Token - Leftover Meal',
                price: paidAmount,
                quantity: 1
            }],
            totalAmount: paidAmount,
            status: 'completed', // Immediate pickup usually
            paymentStatus: 'paid',
            isGreenToken: true
        });

        // Return success with receipt details
        return res.status(200).json({
            success: true,
            message: 'Green Token deal redeemed',
            data: {
                receiptId: order.receiptId, // Use generated receipt ID
                userName: req.user.name,
                items: 'Leftover Meal Pack',
                originalPrice: 100, // Dummy original price
                paidAmount,
                createdAt: order.createdAt
            }
        });
    }

    // Otherwise standard coupon code redemption
    return validateCoupon(req, res);
});

module.exports = { createCoupon, validateCoupon, redeemCoupon };
