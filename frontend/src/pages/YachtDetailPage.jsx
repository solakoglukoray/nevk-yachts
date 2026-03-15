// src/pages/YachtDetailPage.jsx - DİNAMİK HARİTA İLE NİHAİ VERSİYON

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

import SpecsGrid from '../components/SpecsGrid';
import './YachtDetailPage.css';

// --- YENİ HARİTA LİNKİ EŞLEŞMESİ ---
// Size verdiğiniz linkleri burada bir obje içinde saklıyoruz
const mapSources = {
  'Göcek': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3196.7761016062523!2d28.94207600000001!3d36.751945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c065f9efa7ba87%3A0xf849f1a6def19e67!2sG%C3%B6cek%20Marina!5e0!3m2!1str!2str!4v1752223159465!5m2!1str!2str',
  'Fethiye': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2164.7709005180413!2d29.10259952956327!3d36.623393207070265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c0416320ffffff%3A0xd85938c4768efcc8!2sMarina%20Yat%20Liman%C4%B1!5e0!3m2!1str!2str!4v1752223298253!5m2!1str!2str',
  'Marmaris': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3192.727783140872!2d28.281736000000002!3d36.848994999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14bfbdbff1961523%3A0x4a11be677ee47455!2zTWFybWFyaXMgTGltYW4gxLDFn2xldG1lY2lsacSfaSBBLsWeLg!5e0!3m2!1str!2str!4v1752223342094!5m2!1str!2str',
  'Kaş': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3219.689432741317!2d29.637461012182545!3d36.19843420127352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c1da573546baed%3A0x4dd496c950b7e537!2sKa%C5%9F%20Belediyesi%20Yat%20Liman%C4%B1!5e0!3m2!1str!2str!4v1752223389999!5m2!1str!2str',
  'Bodrum': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6369.986846731185!2d27.41926411220787!3d37.03380315437928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14be6c40d49406b5%3A0x8ad61969d31f843!2sBodrum%20Yat%20Liman%C4%B1!5e0!3m2!1str!2str!4v1752223442200!5m2!1str!2str',
};
// --- BİTİŞ ---

function YachtDetailPage() {
  const [yacht, setYacht] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  // Veri çekme kısmı aynı kalıyor
  useEffect(() => {
    const fetchYachtDetails = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/yachts/${id}`);
        setYacht(response.data.data);
      } catch (err) {
        setError('Yat detayları yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };
    fetchYachtDetails();
  }, [id]);

  if (loading) return null;
  if (error) return <div className="page-container"><h1>Hata: {error}</h1></div>;
  if (!yacht) return <div className="page-container"><h1>Yat bulunamadı.</h1></div>;

  const galleryImages = yacht.images.map(url => ({
    original: url,
    thumbnail: url,
  }));

  // --- YENİ DİNAMİK URL SEÇİMİ ---
  // Yatın limanına göre doğru harita linkini seçiyoruz.
  // Eğer yatın limanı listede yoksa veya belirtilmemişse, varsayılan olarak Fethiye haritasını gösteriyoruz.
  const mapEmbedUrl = mapSources[yacht.liman] || mapSources['Fethiye'];
  // --- BİTİŞ ---

  return (
    <div className="detail-page-content-wrapper">
      
      <div className="gallery-container">
        {galleryImages.length > 0 ? (
          <ImageGallery items={galleryImages} showPlayButton={false} thumbnailPosition="bottom" />
        ) : (<p>Bu yat için yüklü resim bulunmamaktadır.</p>)}
      </div>

      <div className="description-section">
        <h2>Açıklama</h2>
        <p>{yacht.description}</p>
      </div>

      <SpecsGrid yacht={yacht} />

      {/* Harita bölümü artık dinamik URL'i kullanıyor */}
      <div className="map-section">
        <h2>Harita Konum</h2>
        <div className="map-container">
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Harita - ${yacht.liman}`}
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default YachtDetailPage;