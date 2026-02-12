const router = require('express').Router();
const { createComplaint, getComplaints, getPublicComplaints } = require('../controllers/complaintController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

const upload = require('../middleware/upload');

router.post('/', protect, upload.single('image'), createComplaint); // Require auth (frontend enforces it)
router.get('/', protect, roleCheck('admin'), getComplaints);
router.get('/public', getPublicComplaints);

module.exports = router;
