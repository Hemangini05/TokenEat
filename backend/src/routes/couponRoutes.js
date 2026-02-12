const router = require('express').Router();
const { createCoupon, validateCoupon, redeemCoupon } = require('../controllers/couponController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.post('/', protect, roleCheck('admin'), createCoupon);
router.post('/validate', protect, validateCoupon);
router.post('/redeem', protect, redeemCoupon);

module.exports = router;
