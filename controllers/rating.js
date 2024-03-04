const Rating = require('../models/Rating');
const WorkingSpace = require('../models/WorkingSpace');

// Get all ratings
const getRatings = async (req, res) => {
    try {
        const ratings = await Rating.find();
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get rating by ID
const getRating = async (req, res) => {
    const { id } = req.params;
    try {
        const rating = await Rating.findById(id);
        if (!rating) {
            return res.status(404).json({ error: 'Rating not found' });
        }
        res.json(rating);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update rating
const updateRating = async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
    try {
        const updatedRating = await Rating.findByIdAndUpdate(id, { rating }, { new: true });
        if (!updatedRating) {
            return res.status(404).json({ error: 'Rating not found' });
        }
        res.json(updatedRating);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete rating
const deleteRating = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRating = await Rating.findByIdAndDelete(id);
        if (!deletedRating) {
            return res.status(404).json({ error: 'Rating not found' });
        }
        res.json({ message: 'Rating deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Add rating
const addRating = async (req, res) => {
    // const { rating } = req.body;
    // try {
    //     const newRating = new Rating({ rating });
    //     const savedRating = await newRating.save();
    //     res.json(savedRating);
    // } catch (error) {
    //     res.status(500).json({ error: 'Internal server error' });
    // }

    try {
        req.body.workingSpace = req.params.workingSpaceId;
        const workingSpace = await WorkingSpace.findById(
            req.params.workingSpaceId
        );

        if (!workingSpace) {
            return res.status(404).json({
                success: false,
                message: `No workingSpace with the id of ${req.params.workingSpaceId}`
            });
        }

        const existedRating = await Rating.find({
            user: req.user.id,
            workingSpaceId: req.params.workingSpaceId
        });

        if (existedRating.length > 0) {
            return res.status(400).json({
                success: false,
                message: `The user with ID ${req.user.id} has already rated this working space`
            })
        }

        req.body.user = req.user.id;
        const rating = await Rating.create(req.body);
        res.status(200).json({
            success: true,
            data: rating
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Cannot create Rating'
        })
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

module.exports = {
    getRatings,
    getRating,
    updateRating,
    deleteRating,
    addRating,
    getAvgRating
};