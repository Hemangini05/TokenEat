/**
 * Queue Controller
 */
const Queue = require('../models/Queue');
const Counter = require('../models/Counter');
const QRCode = require('qrcode');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

const joinQueue = asyncHandler(async (req, res) => {
    const { counterId, orderId } = req.body;

    const counter = await Counter.findById(counterId);
    if (!counter) throw new ApiError('Counter not found', 404);
    if (!counter.isOpen) throw new ApiError('Counter is closed', 400);

    // Check if already in queue
    const existing = await Queue.findOne({ userId: req.user.id, status: 'waiting' });
    if (existing) throw new ApiError('You are already in a queue', 400);

    // Get current queue position
    const queueCount = await Queue.countDocuments({ counterId, status: 'waiting' });
    const position = queueCount + 1;
    const estimatedWaitTime = position * 3; // ~3 min per person

    const qrCode = await QRCode.toDataURL(`Q-${counterId}-POS-${position}`);

    const queue = await Queue.create({
        userId: req.user.id,
        counterId,
        orderId,
        position,
        estimatedWaitTime,
        qrCode
    });

    // Update counter load
    counter.currentLoad = queueCount + 1;
    counter.estimatedWaitTime = estimatedWaitTime;
    await counter.save();

    const populatedQueue = await Queue.findById(queue._id).populate('counterId', 'name type icon');

    res.status(201).json({
        success: true,
        message: 'Joined queue successfully',
        data: {
            queue: populatedQueue,
            position,
            counter: { id: counter._id, name: counter.name },
            estimatedWaitTime,
            qrCode
        }
    });
});

const getQueueStatus = asyncHandler(async (req, res) => {
    const queue = await Queue.findOne({ userId: req.user.id, status: 'waiting' })
        .populate('counterId', 'name type icon')
        .populate('orderId');

    if (!queue) {
        return res.status(200).json({ success: true, data: { inQueue: false } });
    }

    res.status(200).json({
        success: true,
        data: {
            inQueue: true,
            position: queue.position,
            counter: { id: queue.counterId._id, name: queue.counterId.name },
            estimatedWaitTime: queue.estimatedWaitTime,
            qrCode: queue.qrCode,
            order: queue.orderId
        }
    });
});

const leaveQueue = asyncHandler(async (req, res) => {
    const queue = await Queue.findOne({ userId: req.user.id, status: 'waiting' });
    if (!queue) throw new ApiError('You are not in any queue', 400);

    queue.status = 'cancelled';
    await queue.save();

    // Update counter load
    const counter = await Counter.findById(queue.counterId);
    if (counter) {
        counter.currentLoad = Math.max(0, counter.currentLoad - 1);
        await counter.save();
    }

    res.status(200).json({ success: true, message: 'Left queue successfully' });
});

module.exports = { joinQueue, getQueueStatus, leaveQueue };
