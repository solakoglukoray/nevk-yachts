// src/components/Filter.jsx - YENİ VE "APTAL" VERSİYON

import React from 'react';

// Artık kendi state'i yok. Her şeyi props'tan alıyor.
function Filter({ filters, onInputChange, onSubmit }) {
  
  // Form gönderildiğinde direkt olarak prop'tan gelen onSubmit fonksiyonunu çağırır.
  const handleSubmit = (e) => {
    e.preventDefault(); // Formun sayfayı yenilemesini engelle
    onSubmit();
  };

  return (
    // 'Filtrele' butonunun form içinde olması daha doğru bir kullanım
    <form onSubmit={handleSubmit} className="filter-container">
      <select
        name="yachtType"
        value={filters.yachtType}
        onChange={onInputChange} // Değişiklikleri direkt yukarı bildirir
        className="filter-input"
      >
        <option value="">Tüm Tipler</option>
        <option value="Gulet">Gulet</option>
        <option value="Motoryat">Motoryat</option>
        <option value="Katamaran">Katamaran</option>
        <option value="Yelkenli">Yelkenli</option>
      </select>

      <select name="liman" value={filters.liman} onChange={onInputChange} className="filter-input">
        <option value="">Tüm Limanlar</option>
        <option value="Göcek">Göcek</option>
        <option value="Fethiye">Fethiye</option>
        <option value="Marmaris">Marmaris</option>
        <option value="Kaş">Kaş</option>
        <option value="Bodrum">Bodrum</option>
      </select>
      
      <input
        type="number"
        name="minCabins"
        placeholder="Min. Kabin Sayısı"
        value={filters.minCabins}
        onChange={onInputChange} // Değişiklikleri direkt yukarı bildirir
        className="filter-input"
      />
      <button type="submit" className="filter-button">
        Filtrele
      </button>
    </form>
  );
}

export default Filter;