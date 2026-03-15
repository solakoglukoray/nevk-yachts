// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Lütfen bir isim giriniz']
    },
    email: {
        type: String,
        required: [true, 'Lütfen bir email giriniz'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Lütfen geçerli bir email adresi giriniz'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Lütfen bir şifre giriniz'],
        minlength: 6,
        select: false // find() sorgularında şifrenin otomatik olarak gelmesini engeller
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Kullanıcı kaydedilmeden önce şifreyi hash'le (şifrele)
userSchema.pre('save', async function(next) {
    // Eğer şifre alanı değiştirilmediyse (örn: email güncelleniyorsa) bir sonraki adıma geç
    if (!this.isModified('password')) {
        next();
    }

    // Şifreyi daha güvenli hale getir
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);