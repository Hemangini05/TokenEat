const router = require('express').Router();
const { getCounterAvailability, getCounter, updateCounter, createCounter } = require('../controllers/counterController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.get('/availability', getCounterAvailability);
router.get('/:id', getCounter);
router.patch('/:id', protect, roleCheck('admin'), updateCounter);
router.post('/', protect, roleCheck('admin'), createCounter);

module.exports = router;
