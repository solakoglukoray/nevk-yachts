// nevk-yachts-backend/models/Yacht.js - TEK-DİLLİ STABİL VERSİYON

const mongoose = require('mongoose');

const yachtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Sadece Yat Adı zorunlu
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  yachtId: { type: String, trim: true },
  yachtType: {
    type: String,
    enum: ['MOTOR YAT', 'TRAWLER', 'YELKENLİ TEKNE', 'GULET', 'KATAMARAN']
  },
  buildYear: { type: Number },
  liman: { 
    type: String,
    enum: ['Göcek', 'Fethiye', 'Marmaris', 'Kaş', 'Bodrum']
  },
  specs: {
    length: { type: Number },
    width: { type: Number },
    cabins: { type: Number },
    capacity: { type: Number },
    bathrooms: { type: Number },
    personnel: { type: Number },
  },
  images: [{ type: String }],
  hasAirConditioning: { type: Boolean, default: false },
  hasGenerator: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Yacht = mongoose.model('Yacht', yachtSchema);
module.exports = Yacht;