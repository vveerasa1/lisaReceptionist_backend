const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const testBackend = async () => {
    try {
        console.log('--- Testing Authentication ---');
        // 1. Login with Admin
        try {
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                username: 'admin',
                password: 'password123'
            });
            console.log('✅ Admin Login Successful. Token received.');
            var token = loginRes.data.token;
        } catch (error) {
            console.error('❌ Admin Login Failed:', error.response ? error.response.data : error.message);
            return;
        }

        // 2. Login with Invalid Credentials
        try {
            await axios.post(`${API_URL}/auth/login`, {
                username: 'admin',
                password: 'wrongpassword'
            });
            console.error('❌ Invalid Login Test Failed (Should have failed but succeeded)');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('✅ Invalid Login Test Passed (Failed as expected)');
            } else {
                console.error('❌ Invalid Login Test Failed with unexpected error:', error.message);
            }
        }

        console.log('\n--- Testing Validation (Appointments) ---');
        // 3. Create Invalid Appointment
        try {
            await axios.post(`${API_URL}/appointments`, {
                patientName: 'Test Patient'
                // Missing fields
            });
            console.error('❌ Invalid Appointment Test Failed (Should have failed but succeeded)');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('✅ Invalid Appointment Test Passed (Failed as expected)');
            } else {
                console.error('❌ Invalid Appointment Test Failed with unexpected error:', error.message);
            }
        }

        // 4. Create Valid Appointment
        try {
            // Get a doctor ID first
            const doctorsRes = await axios.get(`${API_URL}/doctors`);
            if (doctorsRes.data.length === 0) {
                console.log('⚠️ No doctors found to book appointment with.');
            } else {
                const doctorId = doctorsRes.data[0]._id;
                const appointmentRes = await axios.post(`${API_URL}/appointments`, {
                    patientName: 'Verification Patient',
                    patientPhone: '1234567890',
                    doctorId: doctorId,
                    date: '2024-12-25',
                    time: '10:00',
                    reason: 'Checkup'
                });
                console.log('✅ Valid Appointment Creation Successful:', appointmentRes.data._id);
            }
        } catch (error) {
            console.error('❌ Valid Appointment Test Failed:', error.response ? error.response.data : error.message);
        }

    } catch (err) {
        console.error('Unexpected Error:', err);
    }
};

testBackend();
