const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        index: true
    },
    sender: {
        type: String,
        enum: ['user', 'ai', 'system'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', MessageSchema);
