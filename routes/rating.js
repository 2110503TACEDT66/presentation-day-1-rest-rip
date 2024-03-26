const express = require('express');
const {getRating, getRatings, updateRating, deleteRating,addRating, getAvgRatings, getAvgRating } 
= require('../controllers/rating.js');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router.route('/avg')
    .get(getAvgRatings);
router.route('/avg/:id')
    .get(getAvgRating);
    
router.route('/:id')
    .get(getRating)
    .put(protect, authorize('admin', 'user'), updateRating)
    .delete(protect, authorize('admin', 'user'), deleteRating);

router.route('/')
    .get(getRatings)
    .post(protect, authorize('admin', 'user'), addRating);


    
module.exports = router;