import React from 'react';
import './Home.css';

function Transcribe({ isAuthenticated, setIsAuthenticated }) {
  return (
    <div className="home-container">
      <h1>Speech to Text</h1>
      <p>Start a new transcription session here.</p>
    </div>
  );
}

export default Transcribe;