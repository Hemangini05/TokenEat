const router = require('express').Router();
const { createSuggestion, getSuggestions } = require('../controllers/suggestionController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.post('/', protect, createSuggestion);
router.get('/', protect, roleCheck('admin'), getSuggestions);

module.exports = router;
