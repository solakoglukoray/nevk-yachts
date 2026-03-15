// src/App.jsx - NİHAİ VE DOĞRU YERLEŞİM

import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, ScrollRestoration } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TopBar from './components/TopBar';
import Hero from './components/Hero'; // Hero bileşeni burada
import FloatingButtons from './components/FloatingButtons';
import './App.css';

function App() {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    const path = location.pathname;
    switch (path) {
      case '/':
        setPageTitle("Lüks Rotalarda Yeni Keşiflere Açılın");
        break;
      case '/hakkimizda':
        setPageTitle("HAKKIMIZDA");
        break;
      case '/rota':
        setPageTitle("ROTA");
        break;
      case '/foto-galeri':
        setPageTitle("FOTO GALERİ");
        break;
      case '/contact':
        setPageTitle("İLETİŞİM");
        break;
      default:
        if (path.startsWith('/yachts/')) {
          setPageTitle("YAT DETAYLARI");
        } else {
          setPageTitle("NEVK YACHTS");
        }
    }
  }, [location]);

  const isHomePage = location.pathname === '/';

  return (
    <>
      <TopBar />
      <Navbar />
      
      {/* EKSİK OLAN VE TÜM SORUNU ÇÖZECEK OLAN SATIR BURADA */}
      <Hero pageTitle={pageTitle} isHomePage={isHomePage} />
      
      <main>
        <Outlet />
      </main>

      <Footer />
      <ScrollRestoration />
      <FloatingButtons />
    </>
  );
}

export default App;