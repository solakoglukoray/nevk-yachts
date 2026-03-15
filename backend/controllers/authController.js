// controllers/authController.js

const User = require('../models/User.js');
const jwt = require('jsonwebtoken'); // jsonwebtoken'i içeri aktar

// @desc    Yeni bir kullanıcı (admin) kaydet
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Veritabanında yeni kullanıcı oluştur
        const user = await User.create({
            name,
            email,
            password, // Not: User modelimizdeki "pre-save" kancası bu şifreyi otomatik olarak hash'leyecektir.
            role
        });

        res.status(201).json({
            success: true,
            message: 'Kullanıcı başarıyla oluşturuldu.'
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Email ve şifre girilmiş mi kontrol et
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Lütfen email ve şifrenizi girin' });
        }

        // 2. Kullanıcıyı bul ve şifreyi de sorguya dahil et (+password)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Geçersiz kimlik bilgileri' });
        }

        // 3. Şifreleri karşılaştır
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Geçersiz kimlik bilgileri' });
        }

        // 4. Her şey doğruysa, JWT oluştur ve gönder
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });
        
        res.status(200).json({
            success: true,
            token
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};