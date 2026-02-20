require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected for seeding');

        // Check/Create Admin
        const adminExists = await User.findOne({ username: 'admin' });
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt); // Default password, change immediately

            const admin = new User({
                username: 'admin',
                password: hashedPassword,
                role: 'admin'
            });
            await admin.save();
            console.log('Admin user created (username: admin, password: password123)');
        } else {
            console.log('Admin user already exists');
        }

        // Check/Create Sample Doctors
        const doctorsCount = await Doctor.countDocuments();
        if (doctorsCount === 0) {
            const doctors = [
                {
                    name: 'Dr. Sarah Smith',
                    specialty: 'Cardiology',
                    availability: [
                        { day: 'Monday', startTime: '09:00', endTime: '17:00' },
                        { day: 'Wednesday', startTime: '09:00', endTime: '17:00' }
                    ]
                },
                {
                    name: 'Dr. John Doe',
                    specialty: 'Dermatology',
                    availability: [
                        { day: 'Tuesday', startTime: '10:00', endTime: '18:00' },
                        { day: 'Thursday', startTime: '10:00', endTime: '18:00' }
                    ]
                }
            ];
            await Doctor.insertMany(doctors);
            console.log('Sample doctors created');
        } else {
            console.log('Doctors already exist');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDatabase();
