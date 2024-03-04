const Reservation = require('../models/Reservation');
const WorkingSpace = require('../models/WorkingSpace');
exports.getReservations = async (req, res, next) => {
    // console.log("here");
    let query;
    //populate **********


    if (req.user.role !== 'admin') {
        query = Reservation.find({ user: req.user.id }).populate({
            path: 'workingSpace',
            select: 'name province tel'
        });
    } else {
        if (req.params.workingSpaceId) {
            console.log(req.params.workingSpaceId);

            // const str = req.params.hospitalId;

            query = Reservation.find({ workingSpace: req.params.workingSpaceId }).populate({
                path: "workingSpace",
                select: "name province tel",
            });

        } else query = Reservation.find().populate({
            path: "workingSpace",
            select: "name province tel",
        });
    }

    try {
        const reservations = await query;
        res.status(200).json({
            success: true,
            count: reservations.length,
            data: reservations
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message:
                "Cannot find Reservation"
        });
    }
};

exports.getReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate({
            path: 'workingSpace',
            select: 'name description tel'
        });

        if (!reservation) {
            return res.status(404).json({ success: false, message: `No reservation with the id of ${req.params.id}` });
        }

        res.status(200).json({
            success: true,
            data: reservation
        });

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: "Cannot find Reservation" });
    }
}

exports.addReservation = async (req, res, next) => {
    try {
        req.body.workingSpace = req.params.workingSpaceId;
        const workingSpace = await WorkingSpace.findById(
            req.params.workingSpaceId
        );

        if (!workingSpace) {
            return res.status(404).json({
                success: false,
                message: `No workingSpace with id ${req.params.workingSpaceId}`
            });
        }

        if (req.user.id !== req.body.user && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: `The user with ID ${req.user.id} add the reservation to the another User`
            });
        }

        req.body.user = req.user.id;
        const existedAppointments = await Reservation.find({ user: req.user.id });

        if (existedAppointments.length >= 3 && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: `The user with ID ${req.user.id} has already made 3 reservations`
            });
        }

        const reservation = await Reservation.create(req.body);
        res.status(200).json({
            succes: true,
            data: reservation
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot create Reservation'
        });
    }
};

exports.updateReservation = async (req, res, next) => {
    try {
        let appointment = await Reservation.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ success: false, message: `No reservation with the id of ${req.params.id}` });
        }

        if (appointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this reservation`
            });
        }

        appointment = await Reservation.findByIdAndUpdate(req.params.id,
            req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            success: true,
            data: appointment
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot update reservation" });
    }
};


exports.deleteReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ success: false, message: `No reservation with the id of ${req.params.id}` });
        }

        if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this reservation`
            });
        }

        await reservation.deleteOne();
        res.status(200).json({
            succes: true,
            data: {}
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot delete the Reservation" });
    }
};