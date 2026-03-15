// src/components/Footer.jsx - LOGO EKLENMİŞ VERSİYON

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

function Footer() {

  return (
    <div className="footer-container">
      <div className="footer-content">
        
        <div className="footer-contact">
          <h3>{('İletişim')}</h3>
          <div className="contact-item">
            <FaMapMarkerAlt className="contact-icon" />
            <span>Cumhuriyet Mah. 502. Sk. No: 5 (Fethiye Plaza) d:7 Fethiye Muğla</span>
          </div>
          <div className="contact-item">
            <FaPhone className="contact-icon" />
            <span>+90 532 306 48 78</span>
          </div>
          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <span>info@nevkinvest.com</span>
          </div>
        </div>

        <div className="footer-center">
            <h2>{('Hayalinizdeki...')}</h2>
        </div>

        {/* --- DEĞİŞİKLİK BURADA --- */}
        <div className="footer-right">
          {/* Metin yerine resim logosu olan bir link */}
          <Link to='/' className='footer-logo-link'>
            <img src="/logo.png" alt="Nevk Yachts Logo" className="footer-logo-image" />
          </Link>
          <small className='website-rights'>NEVK YACHTS © 2025</small>
        </div>
        {/* --- BİTİŞ --- */}

      </div>
    </div>
  );
}

export default Footer;