import React, { useState, useEffect, useRef } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink } from '@inertiajs/inertia-react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, selectSearchQuery } from '../../logiqueredux/gamesSlice';
import { t, setLocale, getAvailableLocales, getLocale } from '../../lang/translationHelper';
import DirectLogoutButton from '../DirectLogoutButton';
import NotificationCenter from '../NotificationCenter';
import './Header.css';
import logo from '../../images/logo.jpg';

/**
 * Header component with navigation, search, and language selection
 * @param {Object} props - Component props
 * @param {Object} props.auth - Authentication information including user and locale
 * @returns {JSX.Element} Header component
 */
const Header = ({ auth, currentUrl }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [developerDropdownOpen, setDeveloperDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const searchQuery = useSelector(selectSearchQuery);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');
  const headerRef = useRef(null);
  const adminDropdownRef = useRef(null);
  const developerDropdownRef = useRef(null);

  // Get available languages from translation helper
  const availableLanguages = getAvailableLocales();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setLocalSearchQuery(searchQuery || '');
  }, [searchQuery]);

  // Use state to track the current locale
  const [currentLocale, setCurrentLocale] = useState(getLocale());

  // Listen for locale changes
  useEffect(() => {
    const handleLocaleChange = (e) => {
      console.log('Locale changed event detected:', e.detail.locale);
      setCurrentLocale(e.detail.locale);
    };

    // Add event listener
    document.addEventListener('localeChanged', handleLocaleChange);

    // Cleanup
    return () => {
      document.removeEventListener('localeChanged', handleLocaleChange);
    };
  }, []);

  // Handle clicks outside of dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close admin dropdown if clicked outside
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
        setAdminDropdownOpen(false);
      }

      // Close developer dropdown if clicked outside
      if (developerDropdownRef.current && !developerDropdownRef.current.contains(event.target)) {
        setDeveloperDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Update locale from auth props when they change
  useEffect(() => {
    if (auth?.locale && auth.locale !== currentLocale) {
      console.log('Setting locale from auth props:', auth.locale);
      setLocale(auth.locale);
    }
  }, [auth?.locale]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      try {
        console.log('Search query:', localSearchQuery.trim());

        // First dispatch the Redux action to update the store
        dispatch(setSearchQuery(localSearchQuery.trim()));

        // Then navigate to the search results page with the search parameter
        // This will trigger the Redux action in the Jeux/Index.jsx component
        Inertia.visit(
          `/jeux`,
          {
            data: {
              search: localSearchQuery.trim()
            },
            onError: (errors) => {
              console.error('Search navigation error:', errors);
            },
            preserveState: true,
            preserveScroll: false,
            replace: true
          }
        );

        // Close the sidebar if it's open
        setSidebarOpen(false);
      } catch (error) {
        console.error('Error during search:', error);
      }
    }
  };

  const handleHomeClick = () => {
    dispatch(setSearchQuery(''));
    setSidebarOpen(false);
    Inertia.visit('/');
  };

  // Logout is now handled by the DirectLogoutButton component

  // Check if a link is active
  const isActive = (path) => {
    return currentUrl && currentUrl.startsWith(path);
  };

  return (
    <header ref={headerRef} className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="logo-container">
        <button
          className="menu-icon"
          onClick={toggleSidebar}
          aria-label="Toggle navigation menu"
          type="button"
        >
          <svg
            className="menu-icon-svg"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 12H21M3 6H21M3 18H21"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="logo-link" onClick={handleHomeClick} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="PlayScore Logo" className="logo" />
          <h1 className="site-name">PLAYSCORE</h1>
        </div>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder={t('header.search_placeholder')}
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          {t('header.search_button')}
        </button>
      </form>

      {/* Menu mobile */}
      <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src={logo} alt="PlayScore Logo" className="sidebar-logo" />





          
          <button
            className="close-sidebar"
            onClick={toggleSidebar}
            aria-label="Close navigation menu"
            type="button"
          >
            <svg
              className="close-icon-svg"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <ul className="sidebar-menu">
          <li>
            <InertiaLink href="/" onClick={() => setSidebarOpen(false)}>
              {t('header.home')}
            </InertiaLink>
          </li>
          <li>
            <a href="/jeux" onClick={() => setSidebarOpen(false)}>
              {t('header.games')}
            </a>
          </li>
          <li>
            <a href="/jeux/indie" onClick={() => setSidebarOpen(false)}>
              {t('header.indie_games') || 'Indie Games'}
            </a>
          </li>
          <li>
            <a href="/categories" onClick={() => setSidebarOpen(false)}>
              {t('header.categories')}
            </a>
          </li>
          <li>
            <a href="/platforms" onClick={() => setSidebarOpen(false)}>
              {t('header.platforms')}
            </a>
          </li>
          <li>
            <InertiaLink href="/about" onClick={() => setSidebarOpen(false)}>
              {t('header.about')}
            </InertiaLink>
          </li>
          <li>
            <InertiaLink href="/contact" onClick={() => setSidebarOpen(false)}>
              {t('header.contact')}
            </InertiaLink>
          </li>

          {/* Role-specific navigation for mobile */}
          {auth.user && (
            <>
              {/* Admin-specific navigation */}
              {auth.user.role === 'admin' && (
                <>
                  <li className="role-section">
                    <span className="role-section-title">{t('admin.navigation.title')}</span>
                  </li>
                  <li>
                    <InertiaLink href={route('admin.dashboard')} onClick={() => setSidebarOpen(false)}>
                      {t('admin.dashboard.title')}
                    </InertiaLink>
                  </li>
                  <li>
                    <InertiaLink href={route('admin.game-approvals.index')} onClick={() => setSidebarOpen(false)}>
                      {t('admin.game_approval.title')}
                    </InertiaLink>
                  </li>
                  <li>
                    <InertiaLink href={route('admin.users.index')} onClick={() => setSidebarOpen(false)}>
                      {t('admin.user_management.title')}
                    </InertiaLink>
                  </li>
                  <li>
                    <InertiaLink href={route('admin.comment-moderation.index')} onClick={() => setSidebarOpen(false)}>
                      {t('admin.comment_moderation.title')}
                    </InertiaLink>
                  </li>
                </>
              )}

              {/* Developer-specific navigation */}
              {(auth.user.role === 'developer' || auth.user.is_developer) && (
                <>
                  <li className="role-section">
                    <span className="role-section-title">{t('developer.navigation.title')}</span>
                  </li>
                  <li>
                    <InertiaLink href={route('developer.dashboard')} onClick={() => setSidebarOpen(false)}>
                      {t('developer.dashboard.title')}
                    </InertiaLink>
                  </li>
                  <li>
                    <InertiaLink href={route('game-submissions.index')} onClick={() => setSidebarOpen(false)}>
                      {t('developer.dashboard.my_games')}
                    </InertiaLink>
                  </li>
                  <li>
                    <InertiaLink href={route('game-submissions.create')} onClick={() => setSidebarOpen(false)}>
                      {t('developer.dashboard.submit_new')}
                    </InertiaLink>
                  </li>
                </>
              )}

              {/* User account section */}
              <li className="role-section">
                <span className="role-section-title">{t('header.account')}</span>
              </li>
              <li>
                <div className="sidebar-notification-center">
                  <NotificationCenter user={auth.user} />
                </div>
              </li>
              <li>
                <InertiaLink href="/profile" onClick={() => setSidebarOpen(false)}>
                  {t('header.profile')}
                </InertiaLink>
              </li>
              <li>
                <DirectLogoutButton onLogout={() => setSidebarOpen(false)}>
                  {t('header.logout')}
                </DirectLogoutButton>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Navigation desktop */}
      <nav className="desktop-nav">
        <ul>
          <li>
            <InertiaLink
              href="/"
              onClick={handleHomeClick}
              className={isActive('/') && !isActive('/jeux') && !isActive('/categories') && !isActive('/platforms') ? 'active' : ''}
            >
              {t('header.home')}
            </InertiaLink>
          </li>
          <li>
            <a
              href="/jeux"
              onClick={() => setSidebarOpen(false)}
              className={isActive('/jeux') && !isActive('/jeux/indie') ? 'active' : ''}
            >
              {t('header.games')}
            </a>
          </li>
          <li>
            <a
              href="/jeux/indie"
              onClick={() => setSidebarOpen(false)}
              className={isActive('/jeux/indie') ? 'active' : ''}
            >
              {t('header.indie_games') || 'Indie Games'}
            </a>
          </li>
          <li>
            <a
              href="/categories"
              onClick={() => setSidebarOpen(false)}
              className={isActive('/categories') ? 'active' : ''}
            >
              {t('header.categories')}
            </a>
          </li>
          <li>
            <a
              href="/platforms"
              onClick={() => setSidebarOpen(false)}
              className={isActive('/platforms') ? 'active' : ''}
            >
              {t('header.platforms')}
            </a>
          </li>
          <li>
            <InertiaLink
              href="/about"
              onClick={() => setSidebarOpen(false)}
              className={isActive('/about') ? 'active' : ''}
            >
              {t('header.about')}
            </InertiaLink>
          </li>
          <li>
            <InertiaLink
              href="/contact"
              onClick={() => setSidebarOpen(false)}
              className={isActive('/contact') ? 'active' : ''}
            >
              {t('header.contact')}
            </InertiaLink>
          </li>
          <li>
            {/* Language Switcher */}
            <select
              value={currentLocale}
              onChange={(e) => {
                const newLocale = e.target.value;
                console.log('Language switcher changed to:', newLocale);

                // Update frontend locale
                setLocale(newLocale);

                // Update backend locale
                try {
                  if (typeof route === 'function') {
                    const switchRoute = route('language.switch');
                    if (switchRoute) {
                      console.log('Sending locale update to backend:', newLocale);
                      Inertia.post(switchRoute, { language: newLocale });
                    }
                  }
                } catch (error) {
                  console.error('Error updating locale on server:', error);
                  // Even if server update fails, keep the frontend translation working
                }
              }}
              className="language-switcher"
            >
              {availableLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.code.toUpperCase()}</option>
              ))}
            </select>
          </li>
          {!auth.user ? (
            <>
              <li>
                <InertiaLink href="/login" className="auth-button">
                  {t('header.login')}
                </InertiaLink>
              </li>
              <li>
                <InertiaLink href="/register" className="auth-button signup-button">
                  {t('header.signup')}
                </InertiaLink>
              </li>
            </>
          ) : (
            <>
              {/* Admin-specific navigation with dropdown */}
              {auth.user.role === 'admin' && (
                <li className={`role-dropdown admin-dropdown ${adminDropdownOpen ? 'active' : ''}`} ref={adminDropdownRef}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setAdminDropdownOpen(!adminDropdownOpen);
                      setDeveloperDropdownOpen(false); // Close other dropdown if open
                    }}
                    className="role-button admin-button"
                  >
                    {t('admin.navigation.title')} {adminDropdownOpen ? '▲' : '▼'}
                  </button>
                  <div className={`role-dropdown-content ${adminDropdownOpen ? 'show' : ''}`}>
                    <InertiaLink
                      href={route('admin.dashboard')}
                      onClick={() => setAdminDropdownOpen(false)}
                    >
                      {t('admin.dashboard.title')}
                    </InertiaLink>
                    <InertiaLink
                      href={route('admin.game-approvals.index')}
                      onClick={() => setAdminDropdownOpen(false)}
                    >
                      {t('admin.game_approval.title')}
                    </InertiaLink>
                    <InertiaLink
                      href={route('admin.users.index')}
                      onClick={() => setAdminDropdownOpen(false)}
                    >
                      {t('admin.user_management.title')}
                    </InertiaLink>
                    <InertiaLink
                      href={route('admin.comment-moderation.index')}
                      onClick={() => setAdminDropdownOpen(false)}
                    >
                      {t('admin.comment_moderation.title')}
                    </InertiaLink>
                  </div>
                </li>
              )}

              {/* Developer-specific navigation with dropdown */}
              {(auth.user.role === 'developer' || auth.user.is_developer) && (
                <li className={`role-dropdown developer-dropdown ${developerDropdownOpen ? 'active' : ''}`} ref={developerDropdownRef}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setDeveloperDropdownOpen(!developerDropdownOpen);
                      setAdminDropdownOpen(false); // Close other dropdown if open
                    }}
                    className="role-button developer-button"
                  >
                    {t('developer.navigation.title')} {developerDropdownOpen ? '▲' : '▼'}
                  </button>
                  <div className={`role-dropdown-content ${developerDropdownOpen ? 'show' : ''}`}>
                    <InertiaLink
                      href={route('developer.dashboard')}
                      onClick={() => setDeveloperDropdownOpen(false)}
                    >
                      {t('developer.dashboard.title')}
                    </InertiaLink>
                    <InertiaLink
                      href={route('game-submissions.index')}
                      onClick={() => setDeveloperDropdownOpen(false)}
                    >
                      {t('developer.dashboard.my_games')}
                    </InertiaLink>
                    <InertiaLink
                      href={route('game-submissions.create')}
                      onClick={() => setDeveloperDropdownOpen(false)}
                    >
                      {t('developer.dashboard.submit_new')}
                    </InertiaLink>
                  </div>
                </li>
              )}

              {/* Notification Center */}
              {auth.user && (
                <li>
                  <NotificationCenter user={auth.user} />
                </li>
              )}

              {/* Common navigation for all authenticated users */}
              <li>
                <InertiaLink href="/profile">{t('header.profile')}</InertiaLink>
              </li>
              <li>
                <DirectLogoutButton>
                  {t('header.logout')}
                </DirectLogoutButton>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Overlay for mobile menu */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </header>
  );
};

export default Header;
