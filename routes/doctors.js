const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Doctor = require('../models/Doctor');

// @route   GET api/doctors
// @desc    Get all doctors
// @access  Public
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find({ isActive: true });
        res.json(doctors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const { check, validationResult } = require('express-validator');

// @route   POST api/doctors
// @desc    Add a doctor
// @access  Private (Admin)
router.post('/', [
    auth,
    [
        check('name', 'Name is required').not().isEmpty(),
        check('specialty', 'Specialty is required').not().isEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newDoctor = new Doctor(req.body);
        const doctor = await newDoctor.save();
        res.json(doctor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
