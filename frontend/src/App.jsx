import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Help from './pages/Help';
import Transcribe from './pages/Transcribe';
import Files from './pages/Files';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import Wallet from './pages/Wallet';
import S2T from './pages/speech-to-text';
import T2S from './pages/text-to-speech';
import API from './pages/Solution/API';
import CombinedBiometricsSensor from './pages/Solution/CombinedBiometricsSensor';
import Glasses from './pages/Solution/Glasses';
import Sensor from './pages/Solution/Sensor';

// ProtectedRoute component to handle authentication
const ProtectedRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

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
      <div className={`content ${isAuthenticated ? 'content-with-sidebar' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={<Home isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} language={language} setLanguage={setLanguage} />}
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/app/transcribe" />
              ) : (
                <Login setIsAuthenticated={setIsAuthenticated} language={language} setLanguage={setLanguage} />
              )
            }
          />
          <Route
            path="/pricing"
            element={<Pricing isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} language={language} setLanguage={setLanguage} />}
          />
          <Route
            path="/help"
            element={<Help isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} language={language} setLanguage={setLanguage} />}
          />
          <Route
            path="/speech-to-text"
            element={<S2T isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} language={language} setLanguage={setLanguage} />}
          />
          <Route
            path="/text-to-speech"
            element={<T2S isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} language={language} setLanguage={setLanguage} />}
          />
          <Route
            path="/text-to-speech"
            element={<T2S isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} language={language} setLanguage={setLanguage} />}
          />
                    <Route
            path="/text-to-speech"
            element={<T2S isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} language={language} setLanguage={setLanguage} />}
          />
                    <Route
            path="/text-to-speech"
            element={<T2S isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} language={language} setLanguage={setLanguage} />}
          />
          <Route
            path="/solutions/api"
            element={<API />}
          />
          <Route
            path="/solutions/combined-biometrics"
            element={<CombinedBiometricsSensor />}
          />
          <Route
            path="/solutions/glasses"
            element={<Glasses />}
          />
          <Route
            path="/solutions/sensor"
            element={<Sensor />}
          />
          <Route
            path="/app/transcribe"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Transcribe isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} language={language} setLanguage={setLanguage} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/wallet"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Wallet isAuthenticated={isAuthenticated} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/files"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Files isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} language={language} setLanguage={setLanguage} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/help"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Help isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} language={language} setLanguage={setLanguage} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/settings"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Settings isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} language={language} setLanguage={setLanguage} />
              </ProtectedRoute>
            }
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