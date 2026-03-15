// src/pages/YachtFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import YachtForm from '../components/YachtForm';

function YachtFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      apiClient.get(`/yachts/${id}`)
        .then(response => {
          setInitialData(response.data.data);
        })
        .catch(error => {
          console.error("Yat verisi çekilemedi", error);
          setError('Yat verileri getirilemedi.');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleSubmit = async (formData) => {
    try {
      if (isEditing) {
        // Düzenleme modunda PUT isteği
        await apiClient.put(`/yachts/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Yat başarıyla güncellendi!');
      } else {
        // Ekleme modunda POST isteği
        await apiClient.post('/yachts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Yat başarıyla eklendi!');
      }
      navigate('/dashboard');
    } catch (error) {
      console.error("İşlem başarısız:", error.response?.data || error.message);
      alert('İşlem sırasında bir hata oluştu.');
    }
  };

  if (loading) return <h2>Yat Bilgileri Yükleniyor...</h2>;
  if (error) return <h2>Hata: {error}</h2>

  return (
    <div style={{maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem'}}>
      <h1>{isEditing ? 'Yatı Düzenle' : 'Yeni Yat Ekle'}</h1>
      <YachtForm onSubmit={handleSubmit} initialData={initialData} isEditing={isEditing} />
    </div>
  );
}

export default YachtFormPage;