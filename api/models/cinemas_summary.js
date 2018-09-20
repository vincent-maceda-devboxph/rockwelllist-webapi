var mongoose = require("mongoose");

var cinemas_summarySchema = new mongoose.Schema({
	item_id: String,
    item_type: String,
    name:String,
    writeup:String,
    image_url: String,
    booking_url: String
});

module.exports = mongoose.model("cinema_summary", cinemas_summarySchema);