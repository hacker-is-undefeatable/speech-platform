import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './pricing.css';

function Pricing({ isAuthenticated, setIsAuthenticated }) {
  const plans = [
    {
      name: 'Free',
      price: '$0/month',
      features: ['Up to 0.5 hours of transcription', 'Support for Cantonese', 'Basic text export'],
    },
    {
      name: 'Pro',
      price: '$19/month',
      features: ['Up to 20 hours of transcription', 'Multi-dialect support', 'Advanced text editing', 'Priority support'],
      recommended: true,
    },
    {
      name: 'Business',
      price: '$49/month',
      features: ['Unlimited transcription', 'All dialects & offline mode', 'Team collaboration tools', 'Dedicated account manager'],
    },
  ];

  return (
    <div className="pricing-container">
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <div className="container">
        <h1>Pricing Plans</h1>
        <p>Choose the plan that best fits your needs and start transcribing today!</p>
        <div className="pricing-table">
          {plans.map((plan, index) => (
            <div key={index} className={`plan ${plan.recommended ? 'recommended' : ''}`}>
              <h2>{plan.name}</h2>
              <p className="price">{plan.price}</p>
              <div className="features">
                <ul>
                  {plan.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
              <Link to="/login?mode=register" className="cta-button">Get Started</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pricing;