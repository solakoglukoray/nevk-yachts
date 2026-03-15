// src/pages/DashboardPage.jsx - SON GÖRSEL DÜZENLEMELER

import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { Link } from 'react-router-dom';

function DashboardPage() {
  const [yachts, setYachts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchYachts = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/yachts');
        setYachts(response.data.data);
      } catch (err) {
        setError('Yat verileri yüklenemedi.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchYachts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu yatı silmek istediğinizden emin misiniz?')) {
      try {
        await apiClient.delete(`/yachts/${id}`);
        setYachts(yachts.filter(yacht => yacht._id !== id));
        alert('Yat başarıyla silindi.');
      } catch (err) {
        alert('Yat silinirken bir hata oluştu.');
        console.error(err);
      }
    }
  };

  if (loading) return <h1>Yükleniyor...</h1>;
  if (error) return <h1>Hata: {error}</h1>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        {/* --- YENİ: Logo ve Başlık Bir Arada --- */}
        <div style={styles.headerTitleGroup}>
          <img src="/logo.png" alt="Nevk Yachts Logo" style={styles.headerLogo} />
          <h1>Yönetim Panosu</h1>
        </div>
        <div>
          {/* Butonlara yeni stiller atandı */}
          <Link to="/yacht/new">
            <button style={{...styles.baseButton, ...styles.addButton}}>Yeni Yat Ekle</button>
          </Link>
          <button onClick={handleLogout} style={{...styles.baseButton, ...styles.logoutButton}}>Çıkış Yap</button>
        </div>
      </header>
      
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Görsel</th>
            <th style={styles.th}>İsim</th>
            <th style={styles.th}>Tip</th>
            <th style={styles.th}>Yıl</th>
            <th style={styles.th}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {yachts.map(yacht => (
            <tr key={yacht._id}>
              <td style={styles.td}>
                <img 
                  src={yacht.images && yacht.images.length > 0 ? yacht.images[0] : 'https://via.placeholder.com/100x60?text=Yok'}
                  alt={yacht.name.tr || yacht.name}
                  style={styles.thumbnail}
                />
              </td>
              <td style={styles.td}>{yacht.name.tr || yacht.name}</td>
              <td style={styles.td}>{yacht.yachtType}</td>
              <td style={styles.td}>{yacht.buildYear}</td>
              <td style={styles.td}>
                <Link to={`/yacht/edit/${yacht._id}`}>
                  <button style={{...styles.baseButton, ...styles.editButton}}>Düzenle</button>
                </Link>
                <button onClick={() => handleDelete(yacht._id)} style={{...styles.baseButton, ...styles.deleteButton}}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- YENİ: GÜNCELLENMİŞ STİL OBJESİ ---
const styles = {
  container: { padding: '2rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  // Yeni: Başlık ve logoyu yan yana getiren stil
  headerTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  // Yeni: Başlığın yanındaki logo için stil
  headerLogo: {
    height: '50px'
  },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' },
  th: { backgroundColor: '#f8f9fa', padding: '16px', borderBottom: '2px solid #dee2e6', textAlign: 'left', color: '#495057' },
  td: { padding: '16px', borderBottom: '1px solid #dee2e6', color: '#212529', verticalAlign: 'middle' },
  // Butonlar için temel stil
  baseButton: { 
    padding: '10px 15px', 
    border: 'none', 
    borderRadius: '5px', 
    color: 'white', 
    cursor: 'pointer', 
    marginRight: '10px',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'opacity 0.2s'
  },
  baseButton_hover: { // Bu kullanılmıyor ama fikir verir
    opacity: 0.9
  },
  // Butonlar için yeni renkler
  addButton: { backgroundColor: '#28a745' }, // Yeşil
  editButton: { backgroundColor: '#007bff' }, // Mavi
  deleteButton: { backgroundColor: '#dc3545' }, // Kırmızı
  logoutButton: { backgroundColor: '#6c757d' }, // Gri
  thumbnail: { width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px' }
};

export default DashboardPage;