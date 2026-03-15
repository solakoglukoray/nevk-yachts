// routes/contactRoutes.js
const express = require('express');
const { sendContactEmail } = require('../controllers/contactController');
const router = express.Router();

router.route('/').post(sendContactEmail);

module.exports = router;