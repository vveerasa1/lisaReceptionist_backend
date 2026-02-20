const express = require('express');
const router = express.Router();
const elevenLabsService = require('../services/elevenLabsService');

// @route   POST api/chat/token
// @desc    Get a signed URL or token for the frontend to connect to ElevenLabs
// @access  Public
router.get('/token', async (req, res) => {
    try {
        // const tokenData = await elevenLabsService.getSignedUrl();
        // res.json(tokenData);
        res.json({ msg: "Token endpoint placeholder" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
