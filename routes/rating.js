const express = require('express');
const {addRating,getRatings,getAvgRating} = require('../controllers/rating');

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect,getRatings)
    .post(protect, authorize('admin', 'user'), addRating);

router.route('/avgRating')
    .get(protect,getAvgRating)

module.exports = router;

// const express = require('express');
// const { getReservations, getReservation, addReservation, updateReservation, deleteReservation } = require('../controllers/reservation');

// const router = express.Router({ mergeParams: true });

// const { protect, authorize } = require('../middleware/auth');

// router.route('/')
//     .get(protect, getReservations)
//     .post(protect, authorize('admin', 'user'), addReservation);
// router.route('/:id')
//     .get(protect, getReservation)
//     .put(protect, authorize('admin', 'user'), updateReservation)
//     .delete(protect, authorize('admin', 'user'), deleteReservation);
// module.exports = router;