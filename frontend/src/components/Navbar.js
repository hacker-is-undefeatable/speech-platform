import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../pages/supabaseClient';
import './Navbar.css';

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [credits, setCredits] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    platform: false,
    solutions: false,
    api: false,
    resources: false,
    pricing: false,
  });

  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchCredits = async () => {
      if (isAuthenticated) {
        try {
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          if (sessionError || !sessionData.session) {
            if (isMounted) setCredits(0);
            return;
          }
          const userId = sessionData.session.user.id;
          const { data, error } = await supabase
            .from('user_profiles')
            .select('credits')
            .eq('id', userId)
            .single();

          if (isMounted) {
            if (error) {
              setCredits(0);
            } else {
              setCredits(data.credits || 0);
            }
          }
        } catch (error) {
          if (isMounted) setCredits(0);
        }
      } else if (isMounted) {
        setCredits(0);
      }
    };

    fetchCredits();
    return () => { isMounted = false; };
  }, [isAuthenticated]);

  const handleLogin = () => navigate('/login');
  const handleSignUp = () => navigate('/login?mode=register');
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setCredits(0);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  const handleCreditsClick = () => { if (isAuthenticated) navigate('/app/subscription'); };
  const toggleDropdown = (menu) => setIsDropdownOpen(prev => ({ ...prev, [menu]: !prev[menu] }));

  return (
    <nav className={`navbar ${isAuthenticated ? 'navbar-app' : 'navbar-top'} ${showNavbar ? 'nav-visible' : 'nav-hidden'}`}>
      {isAuthenticated ? (
        /* Top app bar for logged-in users (formerly sidebar) */
        <div className="navbar-app-container">
          <div className="nav-section-left">
            <NavLink to="/" className="logo-link">
              <span className="nav-text-logo">Home</span>
            </NavLink>
          </div>

          <div className="nav-section-center">
            <NavLink to="/app/transcribe" className={({ isActive }) => (isActive ? 'nav-pill active' : 'nav-pill')}>
              <span className="nav-text">Transcribe</span>
            </NavLink>

            <NavLink to="/app/files" className={({ isActive }) => (isActive ? 'nav-pill active' : 'nav-pill')}>
              <span className="nav-text">History</span>
            </NavLink>

            <NavLink to="/app/help" className={({ isActive }) => (isActive ? 'nav-pill active' : 'nav-pill')}>
              <span className="nav-text">Support</span>
            </NavLink>

            <NavLink to="/app/settings" className={({ isActive }) => (isActive ? 'nav-pill active' : 'nav-pill')}>
              <span className="nav-text">Settings</span>
            </NavLink>
          </div>

          <div className="nav-section-right">
            <div className="credits-pill" onClick={handleCreditsClick} role="button" tabIndex={0}>
              <img src="/images/coin.png" alt="Credits" className="coin-sm" />
              <span className="credits-text">{credits}</span>
            </div>
            <button className="logout-pill" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      ) : (
        /* Top navbar for public / unauthenticated users (kept mostly as your existing layout) */
        <div className="navbar-container">
          <div className="navbar-logo">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active logo-text' : 'logo-text')}>
              Home
            </NavLink>
          </div>
          <div className="navbar-content">
            <div className="navbar-links">
              <div
                className="dropdown"
                onMouseEnter={() => toggleDropdown('platform')}
                onMouseLeave={() => toggleDropdown('platform')}
              >
                <button className="dropdown-trigger">
                  Platform
                  <img src="/images/image.png" className="dropdown-icon" alt="" />
                </button>
                {isDropdownOpen.platform && (
                  <div className="dropdown-content">
                    <div className="dropdown-item">Text to Speech</div>
                    <div className="dropdown-item">Speech to Text</div>
                    <div className="dropdown-item">Voice Changer</div>
                    <div className="dropdown-item">Text to Sound Effects</div>
                    <div className="dropdown-item">Voice Cloning</div>
                    <div className="dropdown-item">Voice Isolator</div>
                    <div className="dropdown-item">Voice Design</div>
                    <div className="dropdown-item">Music</div>
                  </div>
                )}
              </div>

              <div
                className="dropdown"
                onMouseEnter={() => toggleDropdown('solutions')}
                onMouseLeave={() => toggleDropdown('solutions')}
              >
                <button className="dropdown-trigger">Solutions <img src="/images/image.png" className="dropdown-icon" alt="" /></button>
                {isDropdownOpen.solutions && (
                  <div className="dropdown-content">
                    <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Empty</NavLink>
                    <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Empty</NavLink>
                  </div>
                )}
              </div>

              <div
                className="dropdown"
                onMouseEnter={() => toggleDropdown('api')}
                onMouseLeave={() => toggleDropdown('api')}
              >
                <button className="dropdown-trigger">API <img src="/images/image.png" className="dropdown-icon" alt="" /></button>
                {isDropdownOpen.api && (
                  <div className="dropdown-content">
                    <NavLink to="/docs" className={({ isActive }) => (isActive ? 'active' : '')}>API Docs (TBD)</NavLink>
                    <NavLink to="/getting-started" className={({ isActive }) => (isActive ? 'active' : '')}>Getting Started (TBD)</NavLink>
                  </div>
                )}
              </div>

              <div
                className="dropdown"
                onMouseEnter={() => toggleDropdown('resources')}
                onMouseLeave={() => toggleDropdown('resources')}
              >
                <button className="dropdown-trigger">Resources <img src="/images/image.png" className="dropdown-icon" alt="" /></button>
                {isDropdownOpen.resources && (
                  <div className="dropdown-content">
                    <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>About Us</NavLink>
                    <NavLink to="/resources/guides" className={({ isActive }) => (isActive ? 'active' : '')}>Guides</NavLink>
                  </div>
                )}
              </div>
              <div
                className="dropdown"
                onMouseEnter={() => toggleDropdown('pricing')}
                onMouseLeave={() => toggleDropdown('pricing')}
              >
                <button className="dropdown-trigger">Pricing <img src="/images/image.png" className="dropdown-icon" alt="" /></button>
                {isDropdownOpen.pricing && (
                  <div className="dropdown-content">
                    <NavLink to="/pricing" className={({ isActive }) => (isActive ? 'active' : '')}>Compare Plans</NavLink>
                    <NavLink to="/getting-started" className={({ isActive }) => (isActive ? 'active' : '')}>Enterprise</NavLink>
                    <NavLink to="/getting-started" className={({ isActive }) => (isActive ? 'active' : '')}>Scale</NavLink>
                  </div>
                )}
              </div>
            </div>

            <div className="navbar-actions">
              <div className="navbar-right-actions">
                <button className="signup-button" onClick={handleSignUp}>Sign Up</button>
                <button className="login-button" onClick={handleLogin}>Login</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
