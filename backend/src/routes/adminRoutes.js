const router = require('express').Router();
const { getDashboardStats, getDailyUsage, getWeeklyUsage, getCounterAnalytics } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.get('/dashboard-stats', protect, roleCheck('admin'), getDashboardStats);
router.get('/daily-usage', protect, roleCheck('admin'), getDailyUsage);
router.get('/weekly-usage', protect, roleCheck('admin'), getWeeklyUsage);
router.get('/counter-analytics', protect, roleCheck('admin'), getCounterAnalytics);

module.exports = router;
