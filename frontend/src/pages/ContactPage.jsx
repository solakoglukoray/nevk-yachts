// src/pages/ContactPage.jsx
import React, { useState } from 'react';
import apiClient from '../api/axiosConfig';
import { Link } from 'react-router-dom'; // Link'i import ediyoruz
import './ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gsm: '',
    email: '',
    message: '',
    kvkkConsent: false, // Yeni state
    marketingConsent: false, // Eski state'in adını değiştirdik
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.kvkkConsent) {
      setStatus('Lütfen Kişisel Veriler Bilgilendirme Metni\'ni kabul edin.');
      return;
    }
    setStatus('Gönderiliyor...');
    try {
      const response = await apiClient.post('/contact', formData);
      setStatus(response.data.message);
      setFormData({ name: '', phone: '', gsm: '', email: '', message: '', kvkkConsent: false, marketingConsent: false });
    } catch (error) {
      setStatus(error.response?.data?.error || 'Bir hata oluştu.');
    }
  };

  return (
    <div className="contact-page-wrapper">
      <div className="contact-page-container">
        
        {/* Sol Taraf: Form */}
        <div className="contact-form-section">
          <h2>İletişim Formu</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><input type="text" name="name" placeholder="Ad-Soyad" value={formData.name} onChange={handleChange} required /></div>
            <div className="form-group"><input type="tel" name="phone" placeholder="Telefon" value={formData.phone} onChange={handleChange} /></div>
            <div className="form-group"><input type="tel" name="gsm" placeholder="GSM" value={formData.gsm} onChange={handleChange} /></div>
            <div className="form-group"><input type="email" name="email" placeholder="E-Mail" value={formData.email} onChange={handleChange} required /></div>
            <div className="form-group"><textarea name="message" placeholder="Mesaj" value={formData.message} onChange={handleChange} required></textarea></div>
            <div className="checkbox-container">
              <input type="checkbox" name="kvkkConsent" id="kvkkConsent" checked={formData.kvkkConsent} onChange={handleChange} />
              <label htmlFor="kvkkConsent">
                <Link to="/kvkk" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'underline'}}>Kişisel Veriler Bilgilendirme Metni</Link>'ni kabul ediyorum.
              </label>
            </div>
            <div className="checkbox-container">
              <input type="checkbox" name="marketingConsent" id="marketingConsent" checked={formData.marketingConsent} onChange={handleChange} />
              <label htmlFor="marketingConsent">SMS, e-posta ve telefon yoluyla elektronik ileti gönderilmesine onay veriyorum.</label>
            </div>
            {/* Güvenlik kodu (captcha) kısmı şimdilik eklenmemiştir, bu daha ileri seviye bir özelliktir. */}
            <button type="submit" className="submit-button">Gönder</button>
            {status && <p className="form-status">{status}</p>}
          </form>
        </div>

        {/* Sağ Taraf: Bilgiler ve Harita */}
        <div className="contact-details-section">
          <h2>İletişim Bilgileri</h2>
          <p><strong>Adres:</strong> Cumhuriyet Mah. 502. Sk. No: 5 (Fethiye Plaza) d:7 Muğla / Fethiye</p>
          <p><strong>Telefon:</strong> 0 252 613 7099</p>
          <p><strong>E-Mail:</strong> info@nevkinvest.com</p>
          <div className="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3200.791262038058!2d29.119645812196158!3d36.65547197572768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c0430048f04b25%3A0xdbe05d3801ed7c93!2sNevk%20Invest%20-%20Real%20Estate!5e0!3m2!1str!2str!4v1752138731591!5m2!1str!2str" 
              width="100%" 
              height="350" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Nevk Invest Konumu">
            </iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;