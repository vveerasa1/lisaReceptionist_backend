const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    consentGiven: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Patient', PatientSchema);
