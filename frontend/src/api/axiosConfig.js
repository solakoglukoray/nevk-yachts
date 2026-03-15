// src/api/axiosConfig.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Bu dosyanın public (müşteri) tarafında token göndermesine gerek yok.
// Eğer admin panelinden kopyaladıysanız, interceptors kısmını silebilirsiniz.
// Sade hali bu şekilde olmalıdır.

export default apiClient;