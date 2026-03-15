// src/components/SpecsGrid.jsx - YENİ ÖZELLİKLER EKLENDİ

import React from 'react';
import './SpecsGrid.css';

function SpecsGrid({ yacht }) {
  return (
    <div className="specs-container">
      <h2>Özellikler</h2>
      <div className="specs-grid">
        
        {/* Mevcut Alanlar */}
        <div className="spec-item">
          <span className="spec-label">Kişi Kapasitesi:</span>
          <span className="spec-value">{yacht.specs.capacity || 'N/A'}</span>
        </div>
        <div className="spec-item">
          <span className="spec-label">Kabin Sayısı:</span>
          <span className="spec-value">{yacht.specs.cabins || 'N/A'}</span>
        </div>
        <div className="spec-item">
          <span className="spec-label">Banyo Sayısı:</span>
          <span className="spec-value">{yacht.specs.bathrooms || 'N/A'}</span>
        </div>
        <div className="spec-item">
          <span className="spec-label">İnşa Yılı:</span>
          <span className="spec-value">{yacht.buildYear || 'N/A'}</span>
        </div>
        <div className="spec-item">
          <span className="spec-label">Tekne Tipi:</span>
          <span className="spec-value">{yacht.yachtType || 'N/A'}</span>
        </div>
        <div className="spec-item">
          <span className="spec-label">Uzunluk:</span>
          <span className="spec-value">{yacht.specs.length ? `${yacht.specs.length}m` : 'N/A'}</span>
        </div>

        {/* --- YENİ EKLENEN ÖZELLİKLER --- */}

        {/* Genişlik (sadece varsa gösterilir) */}
        {yacht.specs.width && (
          <div className="spec-item">
            <span className="spec-label">Genişlik:</span>
            <span className="spec-value">{yacht.specs.width}m</span>
          </div>
        )}

        {/* Personel (sadece varsa gösterilir) */}
        {yacht.specs.personnel && (
          <div className="spec-item">
            <span className="spec-label">Personel:</span>
            <span className="spec-value">{yacht.specs.personnel}</span>
          </div>
        )}

        {/* Liman (sadece varsa gösterilir) */}
        {yacht.liman && (
          <div className="spec-item">
            <span className="spec-label">Liman:</span>
            <span className="spec-value">{yacht.liman}</span>
          </div>
        )}

        {/* Yat ID (sadece varsa gösterilir) */}
        {yacht.yachtId && (
          <div className="spec-item">
            <span className="spec-label">Yat ID:</span>
            <span className="spec-value">{yacht.yachtId}</span>
          </div>
        )}

        {/* Klima (her zaman gösterilir, Var/Yok olarak) */}
        <div className="spec-item">
          <span className="spec-label">Klima:</span>
          <span className="spec-value">{yacht.hasAirConditioning ? 'Var' : 'Yok'}</span>
        </div>

        {/* Jeneratör (her zaman gösterilir, Var/Yok olarak) */}
        <div className="spec-item">
          <span className="spec-label">Jeneratör:</span>
          <span className="spec-value">{yacht.hasGenerator ? 'Var' : 'Yok'}</span>
        </div>

      </div>
    </div>
  );
}

export default SpecsGrid;