// src/components/TopBar.jsx - Sadeleştirilmiş Hali
import React from 'react';
import './TopBar.css';
import { useLocation } from 'react-router-dom';

function TopBar() {
  const location = useLocation();
  const topBarClass = location.pathname === '/' ? 'top-bar transparent' : 'top-bar solid';

  return (
    <div className={topBarClass}>
      <div className="top-bar-container">
        {/* Sol taraf boş */}
        <div></div>

        {/* Sağ tarafta sadece dil seçenekleri kaldı */}
        <div className="language-selector">
          <button className="lang-button active">TR</button>
          <button className="lang-button">EN</button>
          <button className="lang-button">AR</button>
          <button className="lang-button">DE</button>
          <button className="lang-button">RU</button>
        </div>
      </div>
    </div>
  );
}
export default TopBar;