import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import About from './pages/About';
import Help from './pages/Help';
import Transcribe from './pages/Transcribe';
import Files from './pages/Files';
import Settings from './pages/Settings';
import Subscription from './pages/Subscription';
import Pricing from './pages/Pricing';
import Profile from './pages/Profile';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [language, setLanguage] = useState('en');
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Render Navbar only if not on /login page
  const showNavbar = location.pathname !== '/login';

  return (
    <>
      {showNavbar && (
        <Navbar
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          language={language}
          setLanguage={setLanguage}
        />
      )}
      <div className="content">
        <Routes>
          <Route
            path="/"
            element={<Home isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} language={language} setLanguage={setLanguage} />}
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} language={language} setLanguage={setLanguage} />}
          />
          <Route
            path="/about"
            element={<About isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} language={language} setLanguage={setLanguage} />}
          />
          <Route
            path="/help"
            element={<Help isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} language={language} setLanguage={setLanguage} />}
          />
          <Route
            path="/transcribe"
            element={<Transcribe isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} language={language} setLanguage={setLanguage} />}
          />
          <Route
            path="/files"
            element={<Files isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} language={language} setLanguage={setLanguage} />}
          />
          <Route
            path="/settings"
            element={<Settings isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} language={language} setLanguage={setLanguage} />}
          />
          <Route
            path="/subscription"
            element={<Subscription isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} language={language} setLanguage={setLanguage} />}
          />
          <Route
            path="/pricing"
            element={<Pricing isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} language={language} setLanguage={setLanguage} />}
          />
          <Route
            path="/profile"
            element={<Profile isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} language={language} setLanguage={setLanguage} />}
          />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;