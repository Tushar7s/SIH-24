const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const {isAuthenticated} = require("../middleware.js");
const {saveRedirectUrl} = require("../middleware.js");

const hospitalController = require("../controller/hospital.js");
const hospital = require("../models/hospital.js");

router.route("/")
     .get(wrapAsync(hospitalController.getHomePage))

router.route("/new")
     .get(wrapAsync(hospitalController.getForm))
     .post(isAuthenticated, wrapAsync(hospitalController.getPostForm));

router.route("/medicine")
      .get(wrapAsync(hospitalController.getMedicine))
      .post(isAuthenticated, wrapAsync(hospitalController.postMedicine));

router.route("/hospital")
     .get(wrapAsync(hospitalController.getHospitalPage));

router.route("/portal")
     .get(wrapAsync(hospitalController.getData))

router.route("/specialist")
    .get(wrapAsync(hospitalController.getSpecialist));

router.delete("/hospital/:hospitalId/patient/:patientId/delete", isAuthenticated, wrapAsync(hospitalController.deletePatient));

module.exports = router;