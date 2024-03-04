const Rating = require('../models/rating');

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
    const { rating } = req.body;
    try {
        const newRating = new Rating({ rating });
        const savedRating = await newRating.save();
        res.json(savedRating);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    getRatings,
    getRating,
    updateRating,
    deleteRating,
    addRating
};
