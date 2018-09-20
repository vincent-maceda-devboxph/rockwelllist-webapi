const Items = require('../models/tenants');

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
            var item_summary = {
                "pagination": {
                    "next": "5ba206fc3d20ff31503659fc"
                },
                "data": items
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