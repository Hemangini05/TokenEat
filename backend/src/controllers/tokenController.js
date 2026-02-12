/**
 * Token Controller
 */
const Token = require('../models/Token');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

const generateToken = asyncHandler(async (req, res) => {
    const { mealType } = req.body;
    const tokenCode = `TK-${uuidv4().split('-')[0].toUpperCase()}`;

    const now = new Date();
    const validUntil = new Date(now);
    validUntil.setHours(23, 59, 59, 999);

    const qrCode = await QRCode.toDataURL(tokenCode);

    const token = await Token.create({
        userId: req.user.id,
        tokenCode,
        mealType,
        qrCode,
        validFrom: now,
        validUntil
    });

    res.status(201).json({
        success: true,
        message: 'Token generated successfully',
        data: token
    });
});

const validateToken = asyncHandler(async (req, res) => {
    const token = await Token.findOne({ tokenCode: req.params.tokenCode }).populate('userId', 'name email studentId');
    if (!token) throw new ApiError('Token not found', 404);

    const isValid = token.status === 'unused' && new Date() <= token.validUntil;

    res.status(200).json({
        success: true,
        data: { token, isValid, message: isValid ? 'Token is valid' : 'Token is invalid or expired' }
    });
});

const updateTokenStatus = asyncHandler(async (req, res) => {
    const { status, counterId } = req.body;
    const token = await Token.findOne({ tokenCode: req.params.tokenCode });
    if (!token) throw new ApiError('Token not found', 404);

    token.status = status;
    if (status === 'used') {
        token.usedAt = new Date();
        token.counterId = counterId;
    }
    await token.save();

    res.status(200).json({ success: true, message: 'Token status updated', data: token });
});

const getMyTokens = asyncHandler(async (req, res) => {
    const tokens = await Token.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tokens });
});

const getTokenHistory = asyncHandler(async (req, res) => {
    const tokens = await Token.find({ userId: req.user.id, status: 'used' }).sort({ usedAt: -1 });
    res.status(200).json({ success: true, data: tokens });
});

module.exports = { generateToken, validateToken, updateTokenStatus, getMyTokens, getTokenHistory };
