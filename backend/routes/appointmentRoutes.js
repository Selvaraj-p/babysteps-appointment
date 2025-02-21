// routes/appointmentRoutes.js

const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Route to get all appointments
router.get('/', appointmentController.getAppointments);

// Route to get an appointment by ID
router.get('/:id', appointmentController.getAppointment);

// Route to create a new appointment
router.post('/', appointmentController.createAppointment);

// Route to update an appointment by ID
router.put('/:id', appointmentController.updateAppointment);

// Route to delete an appointment by ID
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
