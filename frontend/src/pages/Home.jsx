import React, { useState, useEffect, useRef } from 'react';
// import SmokeyCursor from '../components/lightswind/smokey-cursor';
import './Home.css';
import { NavLink, useNavigate } from 'react-router-dom';
import WaveSurfer from 'wavesurfer.js';

function Home({ isAuthenticated, setIsAuthenticated, language, setLanguage }) {
  const navigate = useNavigate();
  const handleSignUp = () => {
    navigate('/login?mode=register');
  };
  const [demo, setDemo] = useState('conference');
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Reset playing state when switching demos
    setIsPlaying(false);
    if (waveformRef.current) {
      // Destroy existing instance if it exists
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }

      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#7d7d7dff',
        progressColor: '#9500ffff',
        barWidth: 4,
        height: 50,
        responsive: true,
        barRadius: 3,
      });

      wavesurferRef.current.on('play', () => setIsPlaying(true));
      wavesurferRef.current.on('pause', () => setIsPlaying(false));
      wavesurferRef.current.on('finish', () => setIsPlaying(false)); // Reset on finish

      wavesurferRef.current.on('interaction', () => {
        if (!isPlaying) {
          wavesurferRef.current.play();
        }
      });

      // Load audio based on the current demo
      if (demo === 'conference') {
        wavesurferRef.current.load('/audio/conference-audio.mp3');
      } else if (demo === 'interview') {
        wavesurferRef.current.load('/audio/interview-audio.mp3');
      } else if (demo === 'medical') {
        wavesurferRef.current.load('/audio/medical-audio.mp3');
      }

      return () => {
        if (wavesurferRef.current) {
          wavesurferRef.current.destroy();
          wavesurferRef.current = null;
        }
      };
    }
  }, [demo]);

  const handleTogglePlay = () => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
    }
  };

  return (
    <div className="home-container">
      {/* <SmokeyCursor /> */}
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
            <button className="CTA-button" onClick={handleSignUp}> 
              Get Started
            </button>
            <button className="Contact-button" onClick={handleSignUp}> 
              Contact Us
            </button>
            <div className="demo-container">
              <div className="demo-transcripts">
                <h2>Demo</h2>
                <ul className="demo-buttons">
                  <li>
                    <button
                      className={`demo-button ${demo === 'conference' ? 'active' : ''}`}
                      onClick={(e) => { e.preventDefault(); setDemo('conference'); }}
                    >
                      Conference Call
                    </button>
                  </li>
                  <li>
                    <button
                      className={`demo-button ${demo === 'interview' ? 'active' : ''}`}
                      onClick={(e) => { e.preventDefault(); setDemo('interview'); }}
                    >
                      Interview
                    </button>
                  </li>
                  <li>
                    <button
                      className={`demo-button ${demo === 'medical' ? 'active' : ''}`}
                      onClick={(e) => { e.preventDefault(); setDemo('medical'); }}
                    >
                      Medical Interview
                    </button>
                  </li>
                </ul>
              </div>
              <div className="demo-content">
                {demo === 'conference' && (
                  <>
                    <div className="audio-content">
                      <div id="waveform" ref={waveformRef} className="waveform"></div>
                      <div className="audio-controls">
                        <button 
                          className="play-button" 
                          onClick={handleTogglePlay} 
                          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                        >
                          <img
                            src={isPlaying ? '/images/pause.png' : '/images/play.png'}
                            alt={isPlaying ? 'Pause' : 'Play'}
                            className="play-pause-icon"
                          />
                        </button>
                      </div>
                    </div>
                    <div className="transcript">
                      <p><strong>SPEAKER 1:</strong> 讀書要從薄到厚再從厚到薄</p>
                    </div>
                  </>
                )}
                {demo === 'interview' && (
                  <>
                    <div className="audio-content">
                      <div id="waveform" ref={waveformRef} className="waveform"></div>
                      <div className="audio-controls">
                        <button 
                          className="play-button" 
                          onClick={handleTogglePlay} 
                          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                        >
                          <img
                            src={isPlaying ? '/images/pause.png' : '/images/play.png'}
                            alt={isPlaying ? 'Pause' : 'Play'}
                            className="play-pause-icon"
                          />
                        </button>
                      </div>
                    </div>
                    <div className="transcript">
                      <p><strong>SPEAKER 1:</strong> 所謂會讀書就係本住誠意去讀有價值嘅書</p>
                    </div>
                  </>
                )}
                {demo === 'medical' && (
                  <>
                    <div className="audio-content">
                      <div id="waveform" ref={waveformRef} className="waveform"></div>
                      <div className="audio-controls">
                        <button 
                          className="play-button" 
                          onClick={handleTogglePlay} 
                          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                        >
                          <img
                            src={isPlaying ? '/images/pause.png' : '/images/play.png'}
                            alt={isPlaying ? 'Pause' : 'Play'}
                            className="play-pause-icon"
                          />
                        </button>
                      </div>
                    </div>
                    <div className="transcript">
                      <p><strong>SPEAKER 1:</strong> 好書使人更懂得享受人生</p>
                    </div>
                  </>
                )}
              </div>
            </div>
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
              <p className="info">Email: sonocanto4u@gmail.com</p>
              <p className="info">Phone: +852 96651800</p>
              <p className="info">Address: ???</p>
            </div>
            <div className="footer-section">
              <h3>Follow Us</h3>
              <p className="info">Social Media: Your social media links</p>
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