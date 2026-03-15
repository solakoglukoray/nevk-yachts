// src/components/YachtCard.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // Link bileşenini import et

function YachtCard({ yacht }) {
  const imageUrl = yacht.images && yacht.images.length > 0 
    ? yacht.images[0] 
    : 'https://via.placeholder.com/300x200?text=Resim+Yok';

  // Tüm kartı bir Link bileşeni ile sarmalıyoruz
  return (
    <Link to={`/yachts/${yacht._id}`} className="yacht-card-link">
      <div className="yacht-card">
        <img src={imageUrl} alt={yacht.name} className="yacht-image" />
        <div className="yacht-info">
          <h3>{yacht.name}</h3>
          <p>{yacht.yachtType} - {yacht.buildYear}</p>
          <p>Kapasite: {yacht.specs.capacity} Kişi - Kabin: {yacht.specs.cabins}</p>
        </div>
      </div>
    </Link>
  );
}

export default YachtCard;