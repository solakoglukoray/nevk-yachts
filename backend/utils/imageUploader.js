// utils/imageUploader.js

const multer = require('multer');
const cloudinary = require('../config/cloudinary'); // Az önce oluşturduğumuz config dosyasını import ediyoruz
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Multer'a resimleri nerede ve nasıl saklayacağını söylüyoruz
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'nevk-yachts', // Resimlerin Cloudinary'de saklanacağı klasörün adı
    allowed_formats: ['jpeg', 'png', 'jpg'],
    // İsteğe bağlı: Yüklenen resimlere otomatik olarak uygulanacak dönüşümler
    // Örneğin, genişliği 1200 pikseli geçmesin ve kalitesi otomatik ayarlansın
    transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }]
  },
});

// Multer'ı yapılandır
const upload = multer({ storage: storage });

module.exports = upload;