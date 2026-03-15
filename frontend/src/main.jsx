// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';


import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import YachtDetailPage from './pages/YachtDetailPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import HakkimizdaPage from './pages/HakkimizdaPage.jsx';
import RotaPage from './pages/RotaPage.jsx';
import FotoGaleriPage from './pages/FotoGaleriPage.jsx';
import KvkkPage from './pages/KvkkPage';
import YachtsListPage from './pages/YachtsListPage.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "yachts", element: <YachtsListPage /> },
      { path: "yachts/:id", element: <YachtDetailPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "hakkimizda", element: <HakkimizdaPage /> },
      { path: "rota", element: <RotaPage /> },
      { path: "foto-galeri", element: <FotoGaleriPage /> },
      { path: "kvkk", element: <KvkkPage /> }, // YENİ ROTA
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);