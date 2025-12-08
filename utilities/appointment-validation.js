const utilities = require(".");
const { body, validationResult } = require("express-validator");
const appointmentModel = require("../models/appointment-model");
const validate = {};

/* ******************************
 * Appointment Booking Rules
 * ***************************** */
validate.appointmentRules = () => {
  return [
    body("appointment_type")
      .trim()
      .notEmpty()
      .withMessage("Please select an appointment type.")
      .isIn(["Test Drive", "Service"])
      .withMessage("Invalid appointment type."),

    body("appointment_date")
      .trim()
      .notEmpty()
      .withMessage("Appointment date is required.")
      .isISO8601()
      .withMessage("Invalid date format.")
      .custom((value) => {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          throw new Error("Appointment date must be in the future.");
        }
        return true;
      }),

    body("appointment_time")
      .trim()
      .notEmpty()
      .withMessage("Appointment time is required.")
      .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Invalid time format (HH:MM)."),

    body("appointment_note")
      .trim()
      .isLength({ max: 500 })
      .withMessage("Note cannot exceed 500 characters."),
  ];
};

/* ******************************
 * Check Appointment Data
 * ***************************** */
validate.checkAppointmentData = async (req, res, next) => {
  const { inv_id, appointment_type, appointment_date, appointment_time, appointment_note } =
    req.body;
  let errors = [];
  errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const invData = await require("../models/inventory-model").getInventoryById(inv_id);

    res.render("appointments/book-appointment", {
      errors,
      title: `Book ${appointment_type} - ${invData.inv_make} ${invData.inv_model}`,
      nav,
      invData,
      appointment_type,
      appointment_date,
      appointment_time,
      appointment_note,
    });
    return;
  }
  next();
};

module.exports = validate;