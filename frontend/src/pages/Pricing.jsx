import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './pricing.css';

function Pricing({ isAuthenticated, setIsAuthenticated }) {
  const [isYearly, setIsYearly] = useState(false);

  const subscriptionPlans = [
    {
      name: 'Free',
      originalPrice: '$0',
      price: '$0',
      features: ['0.5 hr transcription/month', 'Cantonese support', 'Basic text export', 
        'Access to a limited set of tutorial resources', 'Email support with a 48-hour response time'
      ],
      cta: 'Join Waitlist',
      recommended: false,
    },
    {
      name: 'Pro (+30% off during early access)',
      originalPrice: '$28',
      price: isYearly ? '$14' : '$17.50',
      features: ["20 hrs transcription/month", "Cantonese & Mandarin support", "Advanced editing (e.g., manual corrections, timestamps)", 
        "Priority support with a 24-hour response time", "Basic analytics (e.g., transcription duration report)", 
        "Export in multiple formats (e.g., TXT, DOCX)", "Real-time transcription with a 5-second delay", 
        "Customizable transcription settings (e.g., speaker separation)", "Audio enhancement for clearer input", 
        "Mobile app access for on-the-go transcription"],
      cta: 'Become an Early Supporter',
      recommended: true,
    },
    {
      name: 'Pro+ (+30% off during early access)',
      originalPrice: '$50',
      price: isYearly ? '$28' : '$35',
      features: ["Unlimited transcription", "All dialects & offline mode", "Team collaboration (e.g., shared projects, multi-user access)", 
        "Dedicated account manager", "Advanced analytics (e.g., speaker identification, usage trends)", 
        "Export with customizable templates and metadata", "Integration with third-party tools (e.g., CRM, cloud storage)", 
        "Real-time transcription with no delay", "AI-powered summary generation", "Automated workflow integration (e.g., auto-save to cloud)", 
        "Multi-device synchronization", "24/7 premium support with live chat", "Priority processing for faster transcription turnaround"],
      cta: 'Become an Early Supporter',
      recommended: false,
    },
  ];

  // Simplified comparison data for a concise table
  const comparisonRows = [
    { feature: 'Monthly Transcription', free: '0.5 hr', pro: '20 hrs', proPlus: 'Unlimited' },
    { feature: 'Language Support', free: 'Cantonese', pro: 'Cantonese & Mandarin', proPlus: 'All Dialects + Offline' },
    { feature: 'Export Formats', free: 'Basic (TXT)', pro: 'Key Formats (TXT, DOCX)', proPlus: 'Custom + Metadata' },
    { feature: 'Real-time Delay', free: '-', pro: '5 sec', proPlus: 'None (Instant)' },
    { feature: 'Analytics', free: '-', pro: 'Basic Features', proPlus: 'Advanced Insights' },
    { feature: 'Audio Enhancement', free: '-', pro: 'Included', proPlus: 'Included' },
    { feature: 'Mobile App', free: '-', pro: 'Included', proPlus: 'Included' },
    { feature: 'Team Collaboration', free: '-', pro: '-', proPlus: 'Included' },
    { feature: 'AI Summary', free: '-', pro: '-', proPlus: 'Included' },
    { feature: 'Support Speed', free: '48 hrs', pro: '24 hrs', proPlus: 'Live Chat (24/7)' },
  ];

  return (
    <div className="pricing-container">
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <div className="container">
        <header className="pricing-header">
          <h1 className='title'>All-in-one transcription suite. <br />Powered by AI.</h1>
          <h2 className='subtitle'>
            Transcription, Transcription and Transcription - <br />all in one powerful package.
          </h2>
          <div className="billing-toggle">
            <span className={`billing-option ${!isYearly ? 'active' : ''}`}>Monthly</span>
            <label className="switch">
              <input type="checkbox" checked={isYearly} onChange={() => setIsYearly(!isYearly)} />
              <span className="slider"></span>
            </label>
            <span className={`billing-option ${isYearly ? 'active' : ''}`}>
              Yearly <span className={`save ${isYearly ? 'yearly' : 'monthly'}`}>Save 20%</span>
            </span>
          </div>
        </header>

        <section className="subscription-section">
          <div className="pricing-table">
            {subscriptionPlans.map((plan, index) => (
              <div key={index} className={`plan-card ${plan.recommended ? 'recommended' : ''}`}>
                <h3>{plan.name}</h3>
                <div className="price-container">
                  {plan.name === 'Free' ? (
                    <p className="price">{plan.price}</p>
                  ) : (
                    <>
                      <p className="original-price">{plan.originalPrice}</p>
                      <p className="price">{plan.price}</p>
                    </>
                  )}
                </div>
                <p className="billing-frequency">{plan.name === 'Free' ? 'Free for all users' : isYearly ? 'billed yearly' : 'billed monthly'}</p>
                <div className="features">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="feature-item">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-check mr-2 mt-1 opacity-30"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      <span className="feature-text">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                <Link to={plan.name === 'Free' ? '/waitlist' : '/login?mode=register'} className="cta-button">
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Table Section */}
        <section className="comparison-section">
          <h2 className="comparison-title">Compare Plans</h2>
          <div className="table-container">
            <table className="challenges-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Features</th>
                  {subscriptionPlans.map((plan, index) => (
                    <th key={index} style={{ width: '25%' }} className={plan.recommended ? 'recommended' : ''}>{plan.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, index) => (
                  <tr key={index}>
                    <td><strong>{row.feature}</strong></td>
                    <td>{row.free}</td>
                    <td>{row.pro}</td>
                    <td>{row.proPlus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Pricing;