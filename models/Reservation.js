const mongoose = require('mongoose');

const reservationScheamas = new mongoose.Schema({
    apptDate: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    workingSpace: {
        type: mongoose.Schema.ObjectId,
        ref: 'WorkingSpace',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reservation', reservationScheamas);