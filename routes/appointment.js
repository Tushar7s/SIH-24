const express = require('express');
const router = express.Router();
const { getNextAvailableSlot } = require('../controller/appointment.js');
const wrapAsync = require('../utils/wrapAsync.js');
const appointmentController = require("../controller/appointment.js");
router.route("/next-available-slot")
       .get(wrapAsync(appointmentController.getSlot))

router.route("/book-appointment")
      .post(wrapAsync(appointmentController.bookAppointment))

      module.exports = router;