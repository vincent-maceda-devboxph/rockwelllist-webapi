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
            let category = req.query.category;
            let limit = parseInt(req.query.limit);
            let name_like = req.query.name_like;
            let start_id = req.query.start_id;
            
            //For Search
            // const items = await Items.find({
            //     "$text": {
            //         "$search": 'name_like' 
            //     }
            // }).populate('similar_items', 'name', Items).limit(limit).sort({"name": 1});

            const items =  await Items.find({}).populate('similar_items', 'name', Items).sort({"name": 1});

            res.status(200).json(items);
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

module.exports.testRoute = (req, res, next) => {
    res.status(200).json({
        message: 'Items test api works!'
    });
  };