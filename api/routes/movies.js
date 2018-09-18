var express = require("express");
const moviesController = require("../controllers/movies");

var router = express.Router();

router.get("/", moviesController.testRoute);

module.exports = router;