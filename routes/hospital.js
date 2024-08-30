const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const {isAuthenticated} = require("../middleware.js");
const {saveRedirectUrl} = require("../middleware.js");

const hospitalController = require("../controller/hospital.js");

router.route("/map")
     .get(wrapAsync(hospitalController.getMap))
      

module.exports = router;