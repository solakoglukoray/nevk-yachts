// routes/yachtRoutes.js

const express = require('express');
const router = express.Router();
const { 
    createYacht, 
    getAllYachts, 
    getYachtById,
    updateYacht,
    deleteYacht
} = require('../controllers/yachtController.js');

const { protect, authorize } = require('../middleware/authMiddleware.js');
const upload = require('../utils/imageUploader.js'); // Yeni resim yükleme yardımcımızı import ediyoruz

// --- ROTALAR ---

// Yat ekleme rotası artık 'images' alanında 5 adete kadar resim kabul edebilir
router.route('/')
  .post(protect, authorize('admin'), upload.array('images', 5), createYacht)
  .get(getAllYachts);

router.route('/:id')
  .get(getYachtById)
  // Yat güncelleme rotası da resim kabul edebilir
  .put(protect, authorize('admin'), upload.array('images', 5), updateYacht)
  .delete(protect, authorize('admin'), deleteYacht);

module.exports = router;