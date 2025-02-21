// utils/timeUtils.js

const moment = require('moment');

// Function to calculate available time slots
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

// Function to check slot availability
const isSlotAvailable = (date, duration, appointments) => {
  return !appointments.some(appointment => {
    const appointmentStart = moment(appointment.date);
    const appointmentEnd = moment(appointment.date).add(appointment.duration, 'minutes');
    const newAppointmentStart = moment(date);
    const newAppointmentEnd = moment(date).add(duration, 'minutes');

    return newAppointmentStart.isBetween(appointmentStart, appointmentEnd) || newAppointmentEnd.isBetween(appointmentStart, appointmentEnd) || (appointmentStart.isBetween(newAppointmentStart, newAppointmentEnd) && appointmentEnd.isBetween(newAppointmentStart, newAppointmentEnd));
  });
};

module.exports = {
  calculateAvailableSlots,
  isSlotAvailable
};
