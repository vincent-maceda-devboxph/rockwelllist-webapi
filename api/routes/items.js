var express = require("express");
const itemsController = require("../controllers/items");

var router = express.Router();

router.get("/", itemsController.getAll);
router.post("/", itemsController.addItems);

module.exports = router;