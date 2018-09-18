const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tenantsSchema = new mongoose.Schema({
    itemType: String,
    renderType: String,
    name: {type: String, text: true},
    image_url: {
        type: String,
        default: null
    },
    writeup: String,
    description: String,
    location: String,
    phone_num: String,
    rockwellist_picks: [{
        name: String,
        imageUrl:{
            type: String,
            default: null
        }
    }],
    similar_items: [{
        type: Schema.Types.ObjectId,
        ref: 'tenants'
    }]
});

tenantsSchema.index({name: 'text'});

module.exports = mongoose.model('Tenants', tenantsSchema);