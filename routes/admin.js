const express = require("express");
const router = express.Router();
const admin = require("../models/admin.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {isAuthenticated} = require("../middleware.js");
const {saveRedirectUrl} = require("../middleware.js");
const adminController = require("../controller/admin.js");

router.route("/signup")
      .get(wrapAsync(adminController.getSignUpForm))
      .post(wrapAsync(adminController.registerAdmin))

router.route("/login")
      .get(wrapAsync(adminController.getLoginForm))
      .post(saveRedirectUrl, passport.authenticate("local", 
        {failureRedirect: "/login", 
        }), adminController.loginUser);

router.route("/logout")
      .get(wrapAsync(adminController.logoutUser));
    module.exports = router;