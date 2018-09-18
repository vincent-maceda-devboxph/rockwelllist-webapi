var express = require("express");
const itemsController = require("../controllers/items");

var router = express.Router();

router.get("/", itemsController.getAll)
      .post("/", itemsController.addItems);
router.get("/:itemId", itemsController.getById);

module.exports = router;