import React from 'react';
import Navbar from '../components/Navbar';
import './about.css';

function About({ isAuthenticated, setIsAuthenticated }) {
  return (
    <div className="about-container">
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <div className="container">
        <h1>About Us</h1>
        <p className="intro">
          Welcome to the Cantonese Speech Platform, your trusted partner in revolutionizing speech-to-text technology for Cantonese, Mandarin, and beyond. Founded in 2023, we are a team of passionate innovators dedicated to breaking language barriers with cutting-edge AI.
        </p>
        
        <section className="mission">
          <h2>Our Mission</h2>
          <p>
            Our mission is to empower individuals and businesses with accurate, real-time transcription and speech synthesis tools tailored for diverse dialects. We aim to enhance communication, accessibility, and productivity across global communities, starting with the rich linguistic heritage of Cantonese and Chinese dialects.
          </p>
        </section>

        <section className="team">
          <h2>Our Team</h2>
          <p>
            Our team comprises AI experts, linguists, and software engineers with decades of combined experience. Based in Hong Kong, we bring local expertise and global perspectives to create solutions that resonate with users worldwide. Meet some of our key members:
          </p>
          <div className="team-members">
            <div className="member">
              <h3>Dr. Li Wei</h3>
              <p>Chief AI Scientist - 15+ years in speech recognition</p>
            </div>
            <div className="member">
              <h3>Ms. Chan Mei Ling</h3>
              <p>Lead Linguist - Expert in Cantonese dialects</p>
            </div>
            <div className="member">
              <h3>Mr. Zhang Hao</h3>
              <p>Software Engineer - Specializes in real-time processing</p>
            </div>
          </div>
        </section>

        <section className="call-to-action">
          <h2>Join Us on This Journey</h2>
          <p>
            Whether you're an individual looking to transcribe personal recordings or a business seeking scalable solutions, we’re here to help. Get started today by signing up or contact us for more information.
          </p>
          <a href="/login?mode=register" className="cta-button">Sign Up Now</a>
          <a href="/help" className="cta-button secondary">Contact Us</a>
        </section>
      </div>
    </div>
  );
}

export default About;