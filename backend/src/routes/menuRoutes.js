const router = require('express').Router();
const { getMenu, addMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability } = require('../controllers/menuController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.get('/', getMenu);
router.post('/', protect, roleCheck('admin', 'staff', 'mess_incharge'), addMenuItem);
router.put('/:id', protect, roleCheck('admin', 'staff', 'mess_incharge'), updateMenuItem);
router.delete('/:id', protect, roleCheck('admin', 'staff', 'mess_incharge'), deleteMenuItem);
router.patch('/:id/toggle', protect, roleCheck('admin', 'staff', 'mess_incharge'), toggleAvailability);

module.exports = router;
