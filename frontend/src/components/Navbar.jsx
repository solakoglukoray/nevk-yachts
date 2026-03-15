// src/components/Navbar.jsx
import React, { useState } from 'react'; // useState'i import ediyoruz
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Menü ikonlarını import ediyoruz
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const navbarClass = location.pathname === '/' ? 'navbar transparent' : 'navbar solid';

  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  return (
    <nav className={navbarClass}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <img src="/logo.png" alt="Nevk Yachts Logo" className="logo-image" />
        </Link>
        <div className="menu-icon" onClick={handleClick}>
          {click ? <FaTimes /> : <FaBars />}
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeMobileMenu}>ANASAYFA</Link>
          </li>
          <li className="nav-item"><Link to="/hakkimizda" className="nav-links">HAKKIMIZDA</Link></li>
          <li className="nav-item"><Link to="/rota" className="nav-links">ROTA</Link></li>
          <li className="nav-item"><Link to="/foto-galeri" className="nav-links">FOTO GALERİ</Link></li>
          <li className="nav-item"><Link to="/yachts" className="nav-links">YATLAR</Link></li>
          <li className="nav-item"><Link to="/contact" className="nav-links">İLETİŞİM</Link></li>
        </ul>
      </div>
    </nav>
  );
}
export default Navbar;