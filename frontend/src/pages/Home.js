import React from 'react';
import SmokeyCursor from '../components/lightswind/smokey-cursor'; // Adjust the path based on your file structure
import './Home.css';
import { NavLink, useNavigate } from 'react-router-dom';

function Home({ isAuthenticated, setIsAuthenticated, language, setLanguage }) {
  const navigate = useNavigate();
  const handleSignUp = () => {
    navigate('/login?mode=register');
  };
  return (
    <div className="home-container">
      {/* SmokeyCursor as background */}
      <SmokeyCursor />
      
      {/* Foreground content */}
      <div className="content-container">
        {isAuthenticated ? (
          <>
            <h1>Cantonese Speech Platform</h1>
            <p>
              You are logged in! Access your speech-to-text and text-to-speech tools via the navigation.
            </p>
          </>
        ) : (
          <>
            <h1 className="Welcome-heading">
              <span className="gradient-text">Magical AI</span> <br /> converts audio to Cantonese
            </h1>
            <p>
              Unlock Cantonese audio with swift, AI-powered transcription, blending real-time precision <br /> and multi-dialect mastery in an enchanting experience.
            </p>
            <button className="custom-button" onClick={handleSignUp}> 
              Get Started
            </button>
            <div className="features">
              <div className="feature-card">
                <div className="feature-card-box">
                  <span></span>
                  <div className="title">
                    <h2>Speech-to-Text</h2>
                    <p className='content'>
                      Convert spoken Cantonese into text in real-time for meetings, interviews or lectures. Ideal for transcription, live captions or voice command systems.
                    </p>
                  </div>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-card-box">
                  <span></span>
                  <div className="title">
                    <h2>Offline Mode</h2>
                    <p className='content'>
                      Transcribe offline with local processing or use cloud-based options for flexibility and convenience, ensuring accessibility anywhere.
                    </p>
                  </div>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-card-box">
                  <span></span>
                  <div className="title">
                    <h2>High Accuracy</h2>
                    <p className='content'>
                      Powered by advanced AI, our platform ensures precise transcription and speech synthesis, tailored for various Chinese dialects and accents.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Contact Us</h3>
              <p className="info">Email: williamstudymaterial@gmail.com</p>
              <p className="info">Phone: +852 96651800</p>
              <p className="info">Address: ???</p>
            </div>
            <div className="footer-section">
              <h3>Follow Us</h3>
              <p className="info">Social Media: Your social media links</p>
            </div>
            <div className="footer-section">
              <h3>About</h3>
              <p className="info">Your company description</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Cantonese Speech Platform. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;