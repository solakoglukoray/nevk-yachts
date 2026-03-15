// src/pages/YachtsListPage.jsx - DOĞRU VE TEMİZ VERSİYON

import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import YachtCard from '../components/YachtCard';
import Filter from '../components/Filter';
import './YachtsListPage.css'; // Sayfaya özel stil dosyasını import ediyoruz

function YachtsListPage() {
  const [yachts, setYachts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ yachtType: '', minCabins: '' });
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    const fetchYachts = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeFilters.yachtType) {
        params.append('yachtType', activeFilters.yachtType);
      }
      if (activeFilters.minCabins) {
        params.append('specs[cabins][gte]', activeFilters.minCabins);
      }
      
      try {
        const response = await apiClient.get(`/yachts?${params.toString()}`);
        setYachts(response.data.data);
      } catch (err) {
        setError('Yatlar yüklenirken bir sorun oluştu.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchYachts();
  }, [activeFilters]);

  const handleFilterInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const handleFilterSubmit = () => {
    setActiveFilters(filters);
  };

  return (
    // Bu sayfanın tüm içeriği bu sarmalayıcı içinde
    <div className="yachts-list-page-wrapper">
      
      {/* Sayfa başlığını buraya ekliyoruz */}
      <h1 className="page-title">Tüm Yatlar</h1>
      
      <div className="list-content">
        <Filter 
          filters={filters}
          onInputChange={handleFilterInputChange}
          onSubmit={handleFilterSubmit}
        />
        {loading ? (
          <h2 style={{ textAlign: 'center', marginTop: '4rem' }}>Yatlar Yükleniyor...</h2>
        ) : error ? (
          <h2 style={{ textAlign: 'center', marginTop: '4rem', color: 'red' }}>Hata: {error}</h2>
        ) : (
          <div className="yacht-list-container">
            {yachts.length > 0 ? (
              yachts.map(yacht => <YachtCard key={yacht._id} yacht={yacht} />)
            ) : (
              <p>Bu kriterlere uygun tekne bulunamadı.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default YachtsListPage;