// src/App.jsx - DAHA BASİT VE DOĞRU VERSİYON

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import YachtFormPage from './pages/YachtFormPage';

// PrivateRoute fonksiyonu aynı kalıyor
function PrivateRoute({ children }) {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    // Layout olmadan, rotaları doğrudan Routes içine yazıyoruz
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/yacht/new"
        element={
          <PrivateRoute>
            <YachtFormPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/yacht/edit/:id"
        element={
          <PrivateRoute>
            <YachtFormPage />
          </PrivateRoute>
        }
      />
      {/* Varsayılan olarak /dashboard'a yönlendir */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;