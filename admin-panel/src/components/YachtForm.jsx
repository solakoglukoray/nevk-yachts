import React, { useState, useEffect } from 'react';
import './YachtForm.css';

function YachtForm({ onSubmit, initialData = {}, isEditing = false }) {
  const [formData, setFormData] = useState({
    name: '',
    yachtId: '',
    yachtType: 'GULET',
    buildYear: '',
    liman: 'Göcek',
    description: '',
    length: '',
    width: '',
    cabins: '',
    capacity: '',
    bathrooms: '',
    personnel: '',
    hasAirConditioning: false,
    hasGenerator: false,
  });
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        name: initialData.name || '',
        yachtId: initialData.yachtId || '',
        yachtType: initialData.yachtType || 'GULET',
        buildYear: initialData.buildYear || '',
        liman: initialData.liman || 'Göcek',
        description: initialData.description || '',
        length: initialData.specs?.length || '',
        width: initialData.specs?.width || '',
        cabins: initialData.specs?.cabins || '',
        capacity: initialData.specs?.capacity || '',
        bathrooms: initialData.specs?.bathrooms || '',
        personnel: initialData.specs?.personnel || '',
        hasAirConditioning: initialData.hasAirConditioning || false,
        hasGenerator: initialData.hasGenerator || false,
      });
    }
  }, [initialData, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleFileChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    
    const specKeys = ['length', 'width', 'cabins', 'capacity', 'bathrooms', 'personnel'];
    const specs = {};

    Object.keys(formData).forEach(key => {
      if (specKeys.includes(key)) {
        specs[key] = formData[key];
      } else {
        submissionData.append(key, formData[key]);
      }
    });

    submissionData.append('specs', JSON.stringify(specs));

    imageFiles.forEach(file => {
      submissionData.append('images', file);
    });

    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-grid">
        <div className="form-group"><label>Yat Adı</label><input name="name" value={formData.name} onChange={handleChange} required /></div>
        <div className="form-group"><label>Yat ID</label><input name="yachtId" value={formData.yachtId} onChange={handleChange} /></div>
        <div className="form-group"><label>İnşa Yılı</label><input name="buildYear" type="number" value={formData.buildYear} onChange={handleChange} /></div>
        
        <div className="form-group">
          <label>Yat Tipi</label>
          <select name="yachtType" value={formData.yachtType} onChange={handleChange}>
            <option value="MOTOR YAT">MOTOR YAT</option>
            <option value="TRAWLER">TRAWLER</option>
            <option value="YELKENLİ TEKNE">YELKENLİ TEKNE</option>
            <option value="GULET">GULET</option>
            <option value="KATAMARAN">KATAMARAN</option>
          </select>
        </div>
        <div className="form-group">
          <label>Liman</label>
          <select name="liman" value={formData.liman} onChange={handleChange}>
            <option value="Göcek">Göcek</option>
            <option value="Fethiye">Fethiye</option>
            <option value="Marmaris">Marmaris</option>
            <option value="Kaş">Kaş</option>
            <option value="Bodrum">Bodrum</option>
          </select>
        </div>
        <div className="form-group"><label>Uzunluk (m)</label><input name="length" type="number" value={formData.length} onChange={handleChange} /></div>
        <div className="form-group"><label>Genişlik (m)</label><input name="width" type="number" value={formData.width} onChange={handleChange} /></div>
        <div className="form-group"><label>Kabin Sayısı</label><input name="cabins" type="number" value={formData.cabins} onChange={handleChange} /></div>
        <div className="form-group"><label>Kapasite (kişi)</label><input name="capacity" type="number" value={formData.capacity} onChange={handleChange} /></div>
        <div className="form-group"><label>Banyo Sayısı</label><input name="bathrooms" type="number" value={formData.bathrooms} onChange={handleChange} /></div>
        <div className="form-group"><label>Personel Sayısı</label><input name="personnel" type="number" value={formData.personnel} onChange={handleChange} /></div>
        
        <div className="form-group full-width">
          <label>Açıklama</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>
        
        <div className="checkbox-group">
          <input name="hasAirConditioning" type="checkbox" checked={formData.hasAirConditioning} onChange={handleChange} />
          <label>Klima</label>
        </div>
        <div className="checkbox-group">
          <input name="hasGenerator" type="checkbox" checked={formData.hasGenerator} onChange={handleChange} />
          <label>Jeneratör</label>
        </div>

         <div className="form-group full-width">
          <label>Resimler (Mevcutları değiştirmek için yenilerini seçin)</label>
          <input name="images" type="file" onChange={handleFileChange} multiple accept="image/*" />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-btn">{isEditing ? 'Değişiklikleri Kaydet' : 'Yatı Kaydet'}</button>
        </div>
      </div>
    </form>
  );
}

export default YachtForm;