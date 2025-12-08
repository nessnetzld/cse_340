const pool = require("../database/");

/* ***************************
 *  Create Appointment
 * ************************** */
async function createAppointment(
  account_id,
  inv_id,
  appointment_date,
  appointment_time,
  appointment_type,
  appointment_note
) {
  try {
    const sql =
      "INSERT INTO appointments (account_id, inv_id, appointment_date, appointment_time, appointment_type, appointment_note, appointment_status) VALUES ($1, $2, $3, $4, $5, $6, 'Pending') RETURNING *";
    const data = await pool.query(sql, [
      account_id,
      inv_id,
      appointment_date,
      appointment_time,
      appointment_type,
      appointment_note,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("createAppointment error: " + error);
    throw error;
  }
}

/* ***************************
 *  Get Appointments By User
 * ************************** */
async function getAppointmentsByUser(account_id) {
  try {
    const sql =
      "SELECT a.*, i.inv_make, i.inv_model, i.inv_year FROM appointments a JOIN inventory i ON a.inv_id = i.inv_id WHERE a.account_id = $1 ORDER BY a.appointment_date DESC, a.appointment_time DESC";
    const data = await pool.query(sql, [account_id]);
    return data.rows;
  } catch (error) {
    console.error("getAppointmentsByUser error: " + error);
  }
}

/* ***************************
 *  Get All Appointments (Admin/Employee)
 * ************************** */
async function getAllAppointments() {
  try {
    const sql =
      "SELECT a.*, i.inv_make, i.inv_model, i.inv_year, ac.account_firstname, ac.account_lastname, ac.account_email FROM appointments a JOIN inventory i ON a.inv_id = i.inv_id JOIN account ac ON a.account_id = ac.account_id ORDER BY a.appointment_date ASC, a.appointment_time ASC";
    const data = await pool.query(sql);
    return data.rows;
  } catch (error) {
    console.error("getAllAppointments error: " + error);
  }
}

/* ***************************
 *  Update Appointment Status
 * ************************** */
async function updateAppointmentStatus(appointment_id, appointment_status) {
  try {
    const sql =
      "UPDATE appointments SET appointment_status = $1 WHERE appointment_id = $2 RETURNING *";
    const data = await pool.query(sql, [appointment_status, appointment_id]);
    return data.rows[0];
  } catch (error) {
    console.error("updateAppointmentStatus error: " + error);
  }
}

/* ***************************
 *  Get Appointment By ID
 * ************************** */
async function getAppointmentById(appointment_id) {
  try {
    const sql =
      "SELECT a.*, i.inv_make, i.inv_model, i.inv_year FROM appointments a JOIN inventory i ON a.inv_id = i.inv_id WHERE a.appointment_id = $1";
    const data = await pool.query(sql, [appointment_id]);
    return data.rows[0];
  } catch (error) {
    console.error("getAppointmentById error: " + error);
  }
}

/* ***************************
 *  Cancel Appointment
 * ************************** */
async function cancelAppointment(appointment_id) {
  try {
    const sql =
      "UPDATE appointments SET appointment_status = 'Cancelled' WHERE appointment_id = $1 RETURNING *";
    const data = await pool.query(sql, [appointment_id]);
    return data.rows[0];
  } catch (error) {
    console.error("cancelAppointment error: " + error);
  }
}

module.exports = {
  createAppointment,
  getAppointmentsByUser,
  getAllAppointments,
  updateAppointmentStatus,
  getAppointmentById,
  cancelAppointment,
};
