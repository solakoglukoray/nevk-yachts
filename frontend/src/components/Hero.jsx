// src/components/Hero.jsx - YENİ AKILLI VERSİYON

import React, { useState, useEffect } from 'react';
import './Hero.css';

// Ana sayfa için kullanılacak slider resimleri
const sliderImages = [
  '/backgrounds/slider-1.jpg',
  '/backgrounds/slider-2.jpg',
  '/backgrounds/slider-3.jpg',
  '/backgrounds/slider-4.jpg',
  '/backgrounds/slider-5.jpg',
  '/backgrounds/slider-6.jpg',
  '/backgrounds/slider-7.jpg',
  '/backgrounds/slider-8.jpg',
  '/backgrounds/slider-9.jpg',
];

// Diğer sayfalar için kullanılacak sabit arkaplan resmi
const staticImage = '/backgrounds/sabit-arkaplan.jpg';

function Hero({ pageTitle, isHomePage = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sadece anasayfadaysa slider'ı çalıştır
  useEffect(() => {
    let intervalId = null;
    if (isHomePage) {
      intervalId = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % sliderImages.length);
      }, 4000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isHomePage]);

  // Hangi resmin gösterileceğini belirle
  const backgroundImage = isHomePage ? sliderImages[currentIndex] : staticImage;

  // Hangi class'ın kullanılacağını belirle (tam ekran mı, küçük mü?)
  const heroClass = isHomePage ? 'hero-container fullscreen' : 'hero-container small';

  return (
    <div className={heroClass} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        {/* Başlık artık dışarıdan geliyor */}
        <h1>{pageTitle}</h1>
      </div>
    </div>
  );
}

export default Hero;