// routes/authRoutes.js

const express = require('express');
const { register, login } = require('../controllers/authController.js'); // login'i içeri aktar

const router = express.Router();

router.post('/register', register);
router.post('/login', login); // YENİ ROTA

module.exports = router;