import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../pages/supabaseClient';
import './Navbar.css';

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    let isMounted = true;

    // Fetch credits only if authenticated and on initial mount
    const fetchCredits = async () => {
      if (isAuthenticated) {
        try {
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          if (sessionError || !sessionData.session) {
            console.error('Error fetching session:', sessionError?.message);
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
              console.error('Error fetching credits:', error.message);
              setCredits(0);
            } else {
              setCredits(data.credits || 0);
            }
          }
        } catch (error) {
          console.error('Unexpected error fetching credits:', error);
          if (isMounted) setCredits(0);
        }
      } else {
        if (isMounted) setCredits(0);
      }
    };

    fetchCredits();

    // Cleanup to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]); // Dependency on isAuthenticated to re-fetch on auth change

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCredits(0); // Reset credits on logout
    navigate('/');
  };

  const handleSignUp = () => {
    navigate('/login?mode=register');
  };

  const handleCreditsClick = () => {
    if (isAuthenticated) {
      navigate('/subscription');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
              Dashboard
            </NavLink>
            <NavLink to="/transcribe" className={({ isActive }) => isActive ? "active" : ""}>
              Transcribe
            </NavLink>
            <NavLink to="/files" className={({ isActive }) => isActive ? "active" : ""}>
              History
            </NavLink>
            <NavLink to="/help" className={({ isActive }) => isActive ? "active" : ""}>
              Support
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => isActive ? "active" : ""}>
              Settings
            </NavLink>
            <div className="credits-box" onClick={handleCreditsClick}>
              <img src="/images/coin.png" alt="Credits" className="coin" />
              <span className="credits-display">{credits}</span>
            </div>
          </>
        ) : (
          <>
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
              Home
            </NavLink>
            <NavLink to="/pricing" className={({ isActive }) => isActive ? "active" : ""}>
              Pricing
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>
              About Us
            </NavLink>
            <NavLink to="/help" className={({ isActive }) => isActive ? "active" : ""}>
              Support
            </NavLink>
          </>
        )}
      </div>
      <div className="navbar-actions flex items-center">
        {isAuthenticated ? (
          <>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="signup-button" onClick={handleSignUp}>
              Sign Up
            </button>
            <button className="login-button" onClick={handleLogin}>
              Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;