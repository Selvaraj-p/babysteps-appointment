// controllers/doctorController.js

const Doctor = require('../models/doctor');
const Appointment = require('../models/appointment');
const moment = require('moment');

// Get all doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error });
  }
};

// Get available slots for a doctor on a specific date
exports.getDoctorSlots = async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;

  try {
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointments = await Appointment.find({ doctorId: id, date: { $gte: moment(date).startOf('day'), $lte: moment(date).endOf('day') } });

    const availableSlots = calculateAvailableSlots(doctor.workingHours, appointments, date);

    res.status(200).json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available slots', error });
  }
};

// Utility function to calculate available slots
const calculateAvailableSlots = (workingHours, appointments, date) => {
  const slots = [];
  const start = moment(date).set({ hour: workingHours.start.split(':')[0], minute: workingHours.start.split(':')[1] });
  const end = moment(date).set({ hour: workingHours.end.split(':')[0], minute: workingHours.end.split(':')[1] });

  for (let time = start; time.isBefore(end); time.add(30, 'minutes')) {
    if (!appointments.some(appointment => time.isBetween(moment(appointment.date), moment(appointment.date).add(appointment.duration, 'minutes')))) {
      slots.push(time.format('HH:mm'));
    }
  }

  return slots;
};
