require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Debug Logging Middleware
app.use((req, res, next) => {
    console.log(`[DEBUG] Incoming request: ${req.method} ${req.originalUrl}`);
    console.log('[DEBUG] Headers:', JSON.stringify(req.headers));
    console.log('[DEBUG] Body:', JSON.stringify(req.body));
    next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/chat', require('./routes/chat')); // If needed for ElevenLabs webhook

app.get('/', (req, res) => {
    res.send('Lisa AI Backend is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
