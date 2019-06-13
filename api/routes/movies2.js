var express = require("express");
const moviesController = require("../controllers/movies2");
var checkAppVersion = require('../middleware/check-app-version');
var checkAuth = require('../middleware/check-auth');
var checkApi = require('../middleware/check-api');

var router = express.Router();
var middleware = [checkAuth, checkApi.checkAPIKey, checkAppVersion.checkVersion];

router.get("/", moviesController.getAllv2);
router.post("/:screening_id", moviesController.bookMovie);

module.exports = router;