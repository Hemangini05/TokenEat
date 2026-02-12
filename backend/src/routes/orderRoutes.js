const router = require('express').Router();
const { createOrder, getMyOrders, getOrder, getOrderReceipt } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/receipt/:receiptId', protect, getOrderReceipt);
router.get('/:id', protect, getOrder);

module.exports = router;
