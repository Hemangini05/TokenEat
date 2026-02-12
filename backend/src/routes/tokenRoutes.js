const router = require('express').Router();
const { generateToken, validateToken, updateTokenStatus, getMyTokens, getTokenHistory } = require('../controllers/tokenController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.post('/generate', protect, generateToken);
router.get('/validate/:tokenCode', protect, roleCheck('staff', 'admin'), validateToken);
router.patch('/update-status/:tokenCode', protect, roleCheck('staff', 'admin'), updateTokenStatus);
router.get('/my-tokens', protect, getMyTokens);
router.get('/history', protect, getTokenHistory);

module.exports = router;
