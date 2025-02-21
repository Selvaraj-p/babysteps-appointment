// routes/doctorRoutes.js

const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// Route to get all doctors
router.get('/', doctorController.getDoctors);

// Route to get available slots for a specific doctor on a specific date
router.get('/:id/slots', doctorController.getDoctorSlots);

module.exports = router;
