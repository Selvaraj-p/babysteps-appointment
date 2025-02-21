// controllers/appointmentController.js

const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');
const moment = require('moment');

// Get all appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('doctorId', 'name');
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
};

// Get an appointment by ID
exports.getAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findById(id).populate('doctorId', 'name');
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointment', error });
  }
};

// Create a new appointment
exports.createAppointment = async (req, res) => {
  const { doctorId, date, duration, appointmentType, patientName, notes } = req.body;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointments = await Appointment.find({ doctorId, date: { $gte: moment(date).startOf('day'), $lte: moment(date).endOf('day') } });

    const slotAvailable = isSlotAvailable(date, duration, appointments);

    if (!slotAvailable) {
      return res.status(400).json({ message: 'Time slot is not available' });
    }

    const newAppointment = new Appointment({ doctorId, date, duration, appointmentType, patientName, notes });
    await newAppointment.save();

    res.status(201).json(newAppointment);

    // Optionally: Notify clients of the new appointment (for real-time updates)
    // io.emit('new-appointment', newAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment', error });
  }
};

// Update an appointment
exports.updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { date, duration, appointmentType, patientName, notes } = req.body;

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const doctorId = appointment.doctorId;
    const appointments = await Appointment.find({ doctorId, _id: { $ne: id }, date: { $gte: moment(date).startOf('day'), $lte: moment(date).endOf('day') } });

    const slotAvailable = isSlotAvailable(date, duration, appointments);

    if (!slotAvailable) {
      return res.status(400).json({ message: 'Time slot is not available' });
    }

    appointment.date = date;
    appointment.duration = duration;
    appointment.appointmentType = appointmentType;
    appointment.patientName = patientName;
    appointment.notes = notes;

    await appointment.save();

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment', error });
  }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await appointment.remove();

    res.status(200).json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appointment', error });
  }
};

// Utility function to check slot availability
const isSlotAvailable = (date, duration, appointments) => {
  return !appointments.some(appointment => {
    const appointmentStart = moment(appointment.date);
    const appointmentEnd = moment(appointment.date).add(appointment.duration, 'minutes');
    const newAppointmentStart = moment(date);
    const newAppointmentEnd = moment(date).add(duration, 'minutes');

    return newAppointmentStart.isBetween(appointmentStart, appointmentEnd) || newAppointmentEnd.isBetween(appointmentStart, appointmentEnd) || (appointmentStart.isBetween(newAppointmentStart, newAppointmentEnd) && appointmentEnd.isBetween(newAppointmentStart, newAppointmentEnd));
  });
};
