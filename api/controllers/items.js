const Items = require('../models/tenants');
var mongoose = require('mongoose');

module.exports = {
    addItems: async (req, res, next) => {
        try {
            const newItems = new Items(req.body);
            const items = await newItems.save();
            res.status(201).json(items);
        } catch(err) {
            next(err);
        }
    },
    getAll: async (req, res, next) => {
        try {
            var category = getItemType(req.query.category);
            var limit = parseInt(req.query.limit);
            var name_like = req.query.name_like;
            var start_id = req.query.start_id;
            var items = [];

            if(typeof name_like == "undefined")
            {
                items =  await Items.find(category != "" ? {item_type: category}: {}).populate('similar_items', 'name', Items).sort({"name": 1});
            }
            else{
                items = await Items.find(category != "" ? {item_type: category, name: {$regex: new RegExp(name_like, 'i')}}: {name: {$regex: new RegExp(name_like, 'i')}})
                                   .populate('similar_items', 'name', Items)
                                   .sort({"name": 1});
            }

            var _items = chunkArray(items, limit);
            var item_index = getItemChunkIndex(_items, start_id);
            var next_id = getNextId(_items, item_index);

            var item_summary = {
                "pagination": {
                    "next": next_id
                },
                "data": _items[item_index]
            };

            res.status(200).json(item_summary);
        } catch(err) {
            next(err);
        }
    },
    getById: async (req, res, next) => {
        const { itemId } = req.params;

        try {
            const items = await Items.findById(itemId).populate('similar_items', 'name', Items);
            res.status(200).json(items);
        } catch(err) {
            next(err);
        }
    }
}

function getNextId(items, index){
    if(items.length > index)
    {
        items = items[index+1];
        var next_id = items[0]._id.toString();
        return items[0]._id.toString();;
    }
}

function getItemChunkIndex(items, item_id){
    boolean: isIndex = false;
    Number: index = 0;
    Number: item_index = 0;
    if(item_id == 0)
        return item_index;
    
    for(index = 0; index < items.length; index++){
        items[index].forEach(function (value, i){
            if(value._id.toString() == item_id)
                isIndex = true;
        });
        if(isIndex){
            item_index =  index;
            index = items.length;
        }
    }
    return item_index;
}

function chunkArray(items, limit){
    var index = 0;
    var itemLength = items.length;
    var tempItemArr = [];

    for(index = 0; index < itemLength; index += limit){
        var chunkItemArr = items.slice(index, index + limit);
        tempItemArr.push(chunkItemArr);
    }

    return tempItemArr;
}

function getItemType(cat){
    switch(cat){
        case 'Store':
            return "store-v1";
            break;
        case 'Restaurant':
            return "restaurant-v1";
            break;
        case 'Activity':
            return "activity-v1";
            break;
        default:
            return "";
            break;
    }
};