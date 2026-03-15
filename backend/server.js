// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const contactRoutes = require('./routes/contactRoutes');
// Rota dosyasını içeri aktar
const yachtRoutes = require('./routes/yachtRoutes.js');
const authRoutes = require('./routes/authRoutes.js'); // YENİ EKLENEN SATIR

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Temel bir test route'u
app.get('/', (req, res) => {
  res.send('Nevk Yachts Backend API Çalışıyor!');
});

// /api/yachts ile başlayan tüm istekleri yachtRoutes'a yönlendir
app.use('/api/yachts', yachtRoutes);
app.use('/api/auth', authRoutes); // YENİ EKLENEN SATIR
app.use('/api/contact', contactRoutes);

// Veritabanı Bağlantısı ve Sunucuyu Başlatma
mongoose.connect(process.env.MONGO_URI)
  // ... (geri kalanı aynı)
  .then(() => {
    console.log('✅ MongoDB veritabanına başarıyla bağlanıldı.');
    app.listen(PORT, () => {
      console.log(`🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
    });
  })
  .catch((err) => {
    console.error('❌ Veritabanı bağlantı hatası:', err.message);
  });