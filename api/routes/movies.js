var express = require("express");
const moviesController = require("../controllers/movies");

var router = express.Router();

router.get("/", moviesController.getAll)
      .post("/", moviesController.addItems);
router.get("/:movieId", moviesController.getById);

module.exports = router;