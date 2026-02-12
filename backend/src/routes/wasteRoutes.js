const router = require('express').Router();
const { logWaste, getWasteHistory, getWasteAnalytics } = require('../controllers/wasteController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.post('/', protect, roleCheck('staff', 'admin'), logWaste);
router.get('/history', protect, roleCheck('admin'), getWasteHistory);
router.get('/analytics', protect, roleCheck('admin'), getWasteAnalytics);

// Check green token status (dummy endpoint for now)
router.get('/green-token', (req, res) => {
    // Active if forced via query or after 9 PM
    const isActive = req.query.force === 'true' || new Date().getHours() >= 21;
    res.status(200).json({ success: true, active: isActive });
});

module.exports = router;
