const Rating = require('../models/Rating');
const WorkingSpace = require('../models/WorkingSpace');
const User = require('../models/User');

exports.getRatings = async (req, res, next) => {
    // console.log("here");
    let query;
    //populate **********


    if (req.user.role !== 'admin') {
        query = Rating.find({ user: req.user.id }).populate({
            path: 'workingSpace',
            select: 'name province tel'
        }).populate({
            path: "user", // Use "user" instead of "User"
            select: "name",
        });
    } else {
        query = Rating.find().populate(
            {
                path: "workingSpace",
                select: "name province tel",
            }
        ).populate({
            path: "user", // Use "user" instead of "User"
            select: "name",
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

exports.addRating = async (req, res, next) => {
    try {
        req.body.workingSpace = req.params.workingSpaceId;
        const workingSpace = await WorkingSpace.findById(
            req.params.workingSpaceId
        );

        if (!workingSpace) {
            return res.status(404).json({
                success: false,
                message: `No CO-Working Space with id ${req.params.workingSpaceId}`
            });
        }
        req.body.user = req.user.id;
        if (req.user.id !== req.body.user && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: `The user with ID ${req.user.id} add the rating to the another User`
            });
        }


        

        const reservation = await Rating.create(req.body);
        res.status(200).json({
            succes: true,
            data: reservation
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot create Rating'
        });
    }
};

exports.getAvgRating = async (req, res, next) => {
    try {
       
        const aggregateResult = await Rating.aggregate([
            {
                $group: {
                    _id: "$workingSpace",
                    averageRating: { $avg: "$rating" }
                }
            }
        ]);
        
        // aggregateResult will contain an array of objects, each representing a WorkingSpace and its average rating
        console.log(aggregateResult);
        
       
        res.status(200).json({
            succes: true,
            data: aggregateResult
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot get Average Rating'
        });
    }
};