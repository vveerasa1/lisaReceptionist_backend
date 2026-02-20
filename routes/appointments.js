const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

const { check, validationResult } = require('express-validator');

// @route   POST api/appointments
// @desc    Book an appointment (Public/AI)
// @access  Public
router.post('/', [
    check('patientName', 'Patient name is required').not().isEmpty(),
    check('patientPhone', 'Patient phone is required').not().isEmpty(),
    check('date', 'Date is required').not().isEmpty(),
    check('time', 'Time is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        console.log('Received appointment request:', req.body);
        const { patientName, patientPhone, doctorId, date, time, reason } = req.body;

        // Check if patient exists, else create
        let patient = await Patient.findOne({ phone: patientPhone });
        if (!patient) {
            patient = new Patient({
                name: patientName,
                phone: patientPhone
            });
            await patient.save();
        }

        const appointment = new Appointment({
            patientId: patient._id,
            doctorId,
            date,
            time,
            reason
        });

        await appointment.save();
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/appointments
// @desc    Get all appointments
// @access  Private (Admin)
router.get('/', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('patientId', ['name', 'phone'])
            .populate('doctorId', ['name', 'specialty'])
            .sort({ date: 1, time: 1 });
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
