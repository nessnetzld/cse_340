const express = require("express");
const router = new express.Router();
const appointmentController = require("../controllers/appointmentController");
const utilities = require("../utilities");
const appointmentValidate = require("../utilities/appointment-validation");

// Route to book appointment (GET) - User logged in
router.get(
  "/book/:inv_id",
  utilities.checkLogin,
  utilities.handleErrors(appointmentController.buildBookAppointment)
);

// Route to book appointment (POST) - User logged in
router.post(
  "/book/:inv_id",
  utilities.checkLogin,
  appointmentValidate.appointmentRules(),
  appointmentValidate.checkAppointmentData,
  utilities.handleErrors(appointmentController.bookAppointment)
);

// Route to view my appointments - User logged in
router.get(
  "/my-appointments",
  utilities.checkLogin,
  utilities.handleErrors(appointmentController.viewMyAppointments)
);

// Route to cancel appointment - User logged in
router.get(
  "/cancel/:appointment_id",
  utilities.checkLogin,
  utilities.handleErrors(appointmentController.cancelAppointment)
);

// Route to view all appointments (Admin/Employee only)
router.get(
  "/admin",
  utilities.checkAdminEmployee,
  utilities.handleErrors(appointmentController.viewAllAppointments)
);

// Route to update appointment status (Admin/Employee only)
router.post(
  "/update-status",
  utilities.checkAdminEmployee,
  utilities.handleErrors(appointmentController.updateStatus)
);

module.exports = router;