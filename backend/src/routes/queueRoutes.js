const router = require('express').Router();
const { joinQueue, getQueueStatus, leaveQueue } = require('../controllers/queueController');
const { protect } = require('../middleware/auth');

router.post('/join', protect, joinQueue);
router.get('/status', protect, getQueueStatus);
router.post('/leave', protect, leaveQueue);

module.exports = router;
