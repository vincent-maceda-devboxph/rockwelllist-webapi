const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookMovieSchema = new mongoose.Schema({
    user: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    status: String,
    guid: String,
    screening_id: Number,
    transaction_date: Date
});

module.exports = mongoose.model('book-movies', bookMovieSchema);