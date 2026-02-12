const router = require('express').Router();
const { addReview, getReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect, addReview);
router.get('/:menuItemId', getReviews);

module.exports = router;
