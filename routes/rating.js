const express = require('express');
const {getRating, getRatings, updateRating, deleteRating,addRating, getAvgRatings, getAvgRating } = require('../controllers/rating');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router.route('/avg')
    .get(protect, getAvgRatings);
router.route('/avg/:id')
    .get(protect, getAvgRating);
    
router.route('/:id')
    .get(protect, getRating)
    .put(protect, authorize('admin', 'user'), updateRating)
    .delete(protect, authorize('admin', 'user'), deleteRating);

router.route('/')
    .get(protect, getRatings)
    .post(protect, authorize('admin', 'user'), addRating);


    
module.exports = router;