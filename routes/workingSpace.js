const express = require('express');
const { getWorkingSpaces, getWorkingSpace, createWorkingSpace, updateWorkingSpace, deleteWorkingSpace } = require('../controllers/workingSpace');


const reservationRouter = require('./reservation');
const ratingRouter = require('./rating');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router.use('/:workingSpaceId/reservation/', reservationRouter);

router.route('/')
    .get(getWorkingSpaces)
    .post(protect, authorize('admin'), createWorkingSpace);
router.route('/:id')
    .get(getWorkingSpace)
    .put(protect, authorize('admin'), updateWorkingSpace)
    .delete(protect, authorize('admin'), deleteWorkingSpace);

module.exports = router;
