const express = require('express');
const { getReservations, getReservation, addReservation, updateReservation, deleteReservation } = require('../controllers/reservation');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router.route('/').get(protect, getReservations);
router.route("/:workingSpaceId").post(protect, authorize('admin', 'user'), addReservation);
router.route('/:id')
    .get(protect, getReservation)
    .put(protect, authorize('admin', 'user'), updateReservation)
    .delete(protect, authorize('admin', 'user'), deleteReservation);
module.exports = router;