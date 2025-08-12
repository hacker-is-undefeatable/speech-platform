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

  // Collect all unique features for the comparison table
  const allFeatures = [...new Set(subscriptionPlans.flatMap(plan => plan.features))];

  // Define table content for each feature and plan
  const tableContent = {
    '0.5 hr transcription/month': {
      Free: 'Included',
      Pro: 'Not available',
      ProPlus: 'Not available',
    },
    'Cantonese support': {
      Free: 'Included',
      Pro: 'Included',
      ProPlus: 'Included',
    },
    'Basic text export': {
      Free: 'Included',
      Pro: 'Included',
      ProPlus: 'Included',
    },
    'Access to a limited set of tutorial resources': {
      Free: 'Included',
      Pro: 'Included',
      ProPlus: 'Included',
    },
    'Email support with a 48-hour response time': {
      Free: 'Included',
      Pro: 'Not available',
      ProPlus: 'Not available',
    },
    '20 hrs transcription/month': {
      Free: 'Not available',
      Pro: 'Included',
      ProPlus: 'Not available',
    },
    'Cantonese & Mandarin support': {
      Free: 'Not available',
      Pro: 'Included',
      ProPlus: 'Included',
    },
    'Advanced editing (e.g., manual corrections, timestamps)': {
      Free: 'Not available',
      Pro: 'Included',
      ProPlus: 'Included',
    },
    'Priority support with a 24-hour response time': {
      Free: 'Not available',
      Pro: 'Included',
      ProPlus: 'Not available',
    },
    'Basic analytics (e.g., transcription duration report)': {
      Free: 'Not available',
      Pro: 'Included',
      ProPlus: 'Included',
    },
    'Export in multiple formats (e.g., TXT, DOCX)': {
      Free: 'Not available',
      Pro: 'Included',
      ProPlus: 'Included',
    },
    'Real-time transcription with a 5-second delay': {
      Free: 'Not available',
      Pro: 'Included',
      ProPlus: 'Not available',
    },
    'Customizable transcription settings (e.g., speaker separation)': {
      Free: 'Not available',
      Pro: 'Included',
      ProPlus: 'Included',
    },
    'Audio enhancement for clearer input': {
      Free: 'Not available',
      Pro: 'Included',
      ProPlus: 'Included',
    },
    'Mobile app access for on-the-go transcription': {
      Free: 'Not available',
      Pro: 'Included',
      ProPlus: 'Included',
    },
    'Unlimited transcription': {
      Free: 'Not available',
      Pro: 'Not available',
      ProPlus: 'Included',
    },
    'All dialects & offline mode': {
      Free: 'Not available',
      Pro: 'Not available',
      ProPlus: 'Included',
    },
    'Team collaboration (e.g., shared projects, multi-user access)': {
      Free: 'Not available',
      Pro: 'Not available',
      ProPlus: 'Included',
    },
    'Dedicated account manager': {
      Free: 'Not available',
      Pro: 'Not available',
      ProPlus: 'Included',
    },
    'Advanced analytics (e.g., speaker identification, usage trends)': {
      Free: 'Not available',
      Pro: 'Not available',
      ProPlus: 'Included',
    },
    'Export with customizable templates and metadata': {
      Free: 'Not available',
      Pro: 'Not available',
      ProPlus: 'Included',
    },
    'Integration with third-party tools (e.g., CRM, cloud storage)': {
      Free: 'Not available',
      Pro: 'Not available',
      ProPlus: 'Included',
    },
    'Real-time transcription with no delay': {
      Free: 'Not available',
      Pro: 'Not available',
      ProPlus: 'Included',
    },
    'AI-powered summary generation': {
      Free: 'Not available',
      Pro: 'Not available',
      ProPlus: 'Included',
    },
    'Automated workflow integration (e.g., auto-save to cloud)': {
      Free: 'Not available',
      Pro: 'Not available',
      ProPlus: 'Included',
    },
    'Multi-device synchronization': {
      Free: 'Not available',
      Pro: 'Not available',
      ProPlus: 'Included',
    },
    '24/7 premium support with live chat': {
      Free: 'Not available',
      Pro: 'Not available',
      ProPlus: 'Included',
    },
    'Priority processing for faster transcription turnaround': {
      Free: 'Not available',
      Pro: 'Not available',
      ProPlus: 'Included',
    },
  };

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
          <div className="comparison-table-container">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Features</th>
                  {subscriptionPlans.map((plan, index) => (
                    <th key={index} className={plan.recommended ? 'recommended' : ''}>{plan.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature, index) => (
                  <tr key={index}>
                    <td>{feature}</td>
                    {subscriptionPlans.map((plan, i) => (
                      <td key={i} className="feature-status">
                        {tableContent[feature][plan.name === 'Free' ? 'Free' : plan.name === 'Pro (+30% off during early access)' ? 'Pro' : 'ProPlus']}
                      </td>
                    ))}
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