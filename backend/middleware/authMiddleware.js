// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Rotaları korumak için kullanılacak middleware
exports.protect = async (req, res, next) => {
    let token;

    // Token'ın header'da 'Bearer' şemasıyla gönderilip gönderilmediğini kontrol et
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // 'Bearer ' kısmını atıp sadece token'ı al
    }

    // Token yoksa hata gönder
    if (!token) {
        return res.status(401).json({ success: false, error: 'Bu rotaya erişim yetkiniz yok (Token bulunamadı)' });
    }

    try {
        // Token'ı doğrula
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Token içindeki id ile kullanıcıyı bul ve req objesine ekle
        // Bu sayede sonraki tüm fonksiyonlar req.user üzerinden kullanıcı bilgisine erişebilir
        req.user = await User.findById(decoded.id);

        next(); // Her şey yolundaysa bir sonraki adıma geç
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Geçersiz token. Erişim yetkiniz yok.' });
    }
};

// Kullanıcı rollerine göre yetkilendirme
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, error: `'${req.user.role}' rolündeki bir kullanıcı bu işlemi yapmaya yetkili değildir` });
        }
        next();
    };
};