const movies = require('../models/cinemas');

module.exports = {
    
}

module.exports.testRoute = (req, res, next) => {
    res.status(200).json({
        message: 'Movies test api works!'
    });
  };