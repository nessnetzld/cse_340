const appointmentModel = require("../models/appointment-model");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const appointmentCont = {};

/* ***************************
 *  Build Book Appointment View
 * ************************** */
appointmentCont.buildBookAppointment = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    const appointment_type = req.query.type || "Test Drive";
    let nav = await utilities.getNav();
    const invData = await invModel.getInventoryById(inv_id);

    if (!invData) {
      req.flash("notice", "Vehicle not found.");
      return res.redirect("/inv/");
    }

    res.render("appointments/book-appointment", {
      title: `Book ${appointment_type} - ${invData.inv_make} ${invData.inv_model}`,
      nav,
      errors: null,
      invData,
      appointment_type,
      appointment_date: "",
      appointment_time: "",
      appointment_note: "",
    });
  } catch (err) {
    next(err);
  }
};

/* ***************************
 *  Process Book Appointment
 * ************************** */
appointmentCont.bookAppointment = async function (req, res, next) {
  try {
    const {
      inv_id,
      appointment_type,
      appointment_date,
      appointment_time,
      appointment_note,
    } = req.body;

    const account_id = res.locals.accountData.account_id;

    const result = await appointmentModel.createAppointment(
      account_id,
      parseInt(inv_id),
      appointment_date,
      appointment_time,
      appointment_type,
      appointment_note
    );

    if (result) {
      req.flash(
        "notice",
        `Your ${appointment_type} appointment has been booked successfully!`
      );
      res.redirect("/appointments/my-appointments");
    } else {
      req.flash("notice", "Sorry, the appointment booking failed.");
      res.redirect(`/appointments/book/${inv_id}?type=${appointment_type}`);
    }
  } catch (error) {
    if (error.message.includes("UNIQUE")) {
      req.flash(
        "notice",
        "You already have an appointment for this vehicle at this date and time."
      );
      const { inv_id, appointment_type } = req.body;
      res.redirect(`/appointments/book/${inv_id}?type=${appointment_type}`);
    } else {
      next(error);
    }
  }
};

/* ***************************
 *  View My Appointments
 * ************************** */
appointmentCont.viewMyAppointments = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const account_id = res.locals.accountData.account_id;
    const appointments = await appointmentModel.getAppointmentsByUser(
      account_id
    );

    res.render("appointments/my-appointments", {
      title: "My Appointments",
      nav,
      appointments,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
};

/* ***************************
 *  View All Appointments (Admin/Employee)
 * ************************** */
appointmentCont.viewAllAppointments = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const appointments = await appointmentModel.getAllAppointments();

    res.render("appointments/admin-appointments", {
      title: "All Appointments",
      nav,
      appointments,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
};

/* ***************************
 *  Cancel Appointment
 * ************************** */
appointmentCont.cancelAppointment = async function (req, res, next) {
  try {
    const appointment_id = parseInt(req.params.appointment_id);

    const result = await appointmentModel.cancelAppointment(appointment_id);

    if (result) {
      req.flash("notice", "Appointment has been cancelled.");
      res.redirect("/appointments/my-appointments");
    } else {
      req.flash("notice", "Sorry, the cancellation failed.");
      res.redirect("/appointments/my-appointments");
    }
  } catch (err) {
    next(err);
  }
};

/* ***************************
 *  Update Appointment Status (Admin/Employee)
 * ************************** */
appointmentCont.updateStatus = async function (req, res, next) {
  try {
    const { appointment_id, appointment_status } = req.body;

    const result = await appointmentModel.updateAppointmentStatus(
      parseInt(appointment_id),
      appointment_status
    );

    if (result) {
      req.flash("notice", "Appointment status updated successfully.");
    } else {
      req.flash("notice", "Sorry, the status update failed.");
    }

    res.redirect("/appointments/admin");
  } catch (err) {
    next(err);
  }
};

module.exports = appointmentCont;
