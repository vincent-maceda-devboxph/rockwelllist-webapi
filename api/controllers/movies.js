const Movies = require('../models/cinemas');

module.exports = {
    addItems: async (req, res, next) => {
        try {
            const newMovies = new Movies(req.body);
            const movies = await newMovies.save();
            res.status(201).json(movies);
        } catch(err) {
            next(err);
        }
    },
    getAll: async (req, res, next) => {
        try {
            const movies =  await Movies.find({}).populate('availability');

            res.status(200).json(movies);
        } catch(err) {
            next(err);
        }
    },
    getById: async (req, res, next) => {
        const { movieId } = req.params;

        try {
            const movies = await Movies.findById(movieId);
            res.status(200).json(movies);
        } catch(err) {
            next(err);
        }
    }
}