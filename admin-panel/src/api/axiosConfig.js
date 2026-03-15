// src/api/axiosConfig.js

import axios from 'axios';

// Axios için yeni bir "instance" (örnek) oluşturuyoruz
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Tüm isteklerin başına bu URL eklenecek
});

// Bu "interceptor" (kesici), her istek gönderilmeden hemen önce araya girer
apiClient.interceptors.request.use(
  (config) => {
    // localStorage'dan token'ı al
    const token = localStorage.getItem('authToken');
    // Eğer token varsa, isteğin Headers bölümüne 'Authorization' başlığını ekle
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;