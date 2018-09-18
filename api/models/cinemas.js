const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cinemasSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    itemType: String,
    renderType: String,
    name: String,
    imageUrl:{
        type: String,
        default: null
    },
    writeup:{
        type: String,
        default: null
    },
    description:{
        type: String,
        default: null
    },
    trailerUrl: String,
    genre:{
        type: String,
        default: null
    },
    mtrcbRating: {
        type: String,
        default: null
    },
    availability: [{
        theaterName: String,
        openingDate: Date
    }],
    bookingUrl: String
});

module.exports = mongoose.model('Cinemas', cinemasSchema);