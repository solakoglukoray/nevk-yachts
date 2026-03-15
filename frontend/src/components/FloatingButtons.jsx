// src/components/FloatingButtons.jsx - FARKLI NUMARALAR İLE GÜNCELLENDİ

import React from 'react';
import './FloatingButtons.css';
import { FaPhone, FaWhatsapp, FaMapMarkerAlt, FaInstagram } from 'react-icons/fa';

function FloatingButtons() {
  // --- DEĞİŞİKLİK BURADA ---
  // 1. Sol altta gösterilecek ve tıklandığında aranacak numara
  const displayPhoneNumber = '+902526137099'; 
  
  // 2. WhatsApp için kullanılacak numara
  const whatsappNumber = '+905323064878'; // <-- KENDİ WHATSAPP NUMARANIZI BURAYA YAZIN
  // --- BİTİŞ ---

  const instagramLink = 'https://instagram.com/nevkyachts';
  const mapLink = "https://maps.app.goo.gl/hnZArjFwR3joswuEA";

  const whatsappText = "Merhaba, Nevk Yachts Yat Kiralama'ya hoş geldiniz. Size nasıl yardımcı olabiliriz?";
  const encodedWhatsappText = encodeURIComponent(whatsappText);

  // WhatsApp linki artık 'whatsappNumber' değişkenini kullanıyor
  const whatsappLink = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodedWhatsappText}`;

  return (
    <>
      {/* Sol Alt Telefon Butonu 'displayPhoneNumber' değişkenini kullanıyor */}
      <a href={`tel:${displayPhoneNumber}`} className="floating-btn floating-left">
        <FaPhone /> <span>{displayPhoneNumber}</span>
      </a>

      {/* Sağ Alt Butonlar Grubu */}
      <div className="floating-right">
        <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="floating-btn instagram">
          <FaInstagram />
        </a>
        <a href={mapLink} target="_blank" rel="noopener noreferrer" className="floating-btn map">
          <FaMapMarkerAlt />
        </a>
        {/* WhatsApp butonu yeni oluşturulan 'whatsappLink'i kullanıyor */}
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="floating-btn whatsapp">
          <FaWhatsapp />
        </a>
      </div>
    </>
  );
}

export default FloatingButtons;