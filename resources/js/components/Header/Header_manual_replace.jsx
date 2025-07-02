import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink } from '@inertiajs/inertia-react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, selectSearchQuery } from '../../logiqueredux/gamesSlice';
import './Header.css';
import logo from '../../images/logo.png';
import menuIcon from '../../images/menu.png';

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const searchQuery = useSelector(selectSearchQuery);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');

  useEffect(() => {
    setLocalSearchQuery(searchQuery || '');
  }, [searchQuery]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      dispatch(setSearchQuery(localSearchQuery.trim()));
      Inertia.visit(`/?search=${encodeURIComponent(localSearchQuery.trim())}`);
      setSidebarOpen(false);
    }
  };

  const handleHomeClick = () => {
    dispatch(setSearchQuery(''));
    setSidebarOpen(false);
    Inertia.visit('/');
  };

  return (
    <header className="header">
      <div className="logo-container">
        <div className="menu-icon" onClick={toggleSidebar}>
          <img src={menuIcon} alt="Menu" className="menu-icon-image" />
        </div>
        <div className="logo-link" onClick={handleHomeClick} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="PlayScore Logo" className="logo" />
          <h1 className="site-name">PLAYSCORE</h1>
        </div>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Rechercher un jeu..."
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Rechercher
        </button>
      </form>

      {/* Menu mobile */}
      <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src={logo} alt="PlayScore Logo" className="sidebar-logo" />
          <button className="close-sidebar" onClick={toggleSidebar}>
            ×
          </button>
        </div>
        <ul className="sidebar-menu">
          <li>
            <InertiaLink href="/" onClick={handleHomeClick}>
              Accueil
            </InertiaLink>
          </li>
          <li>
            <InertiaLink href="/profile" onClick={() => setSidebarOpen(false)}>
              Profil
            </InertiaLink>
          </li>
        </ul>
      </nav>

      {/* Navigation desktop */}
      <nav className="desktop-nav">
        <ul>
          <li>
            <InertiaLink href="/" onClick={handleHomeClick}>
              Accueil
            </InertiaLink>
          </li>
          <li>
            <InertiaLink href="/profile">Profil</InertiaLink>
          </li>
        </ul>
      </nav>

      {/* Overlay pour le menu mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </header>
  );
};

export default Header;
