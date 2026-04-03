import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import navigate
import './UpgradePro.css';

const UpgradePro = ({ currentPlan }) => {
  const navigate = useNavigate();

  const handleUpgradeClick = (planName) => {
    if (planName === 'PRO') {
      // Redirect to your payment or checkout page
      navigate('/checkout'); 
    }
  };

  const plans = [
    {
      name: "Free",
      price: "0",
      limit: "100 Daily Requests",
      features: ["5 Security Keys", "Standard Analytics", "Community Support"],
      active: currentPlan === 'FREE',
      type: 'free'
    },
    {
      name: "Pro",
      price: "29",
      limit: "10,000 Daily Requests",
      features: ["Unlimited Keys", "Live Incident Logs", "Priority Support", "Custom Rate Limits"],
      active: currentPlan === 'PRO',
      highlight: true,
      type: 'pro'
    }
  ];

  return (
    <div className="upgrade-page-wrapper">
      <div className="upgrade-container">
        <header className="upgrade-header">
          <span className="brand-badge">SUBSCRIPTION</span>
          <h1>Scale Your Security</h1>
          <p>Deploy enterprise-grade protection for your global infrastructure.</p>
        </header>
        
        <div className="pricing-grid">
          {plans.map((plan) => (
            <div key={plan.name} className={`plan-card ${plan.highlight ? 'pro' : ''} ${plan.active ? 'active-plan' : ''}`}>
              {plan.highlight && <span className="popular-tag">Recommended</span>}
              {plan.active && <span className="current-status-tag">Currently Active</span>}
              
              <div className="card-top">
                <span className="plan-name">{plan.name}</span>
                <div className="plan-price">
                  <span className="currency">$</span>
                  {plan.price}
                  <span className="duration">/mo</span>
                </div>
              </div>

              <div className="plan-divider"></div>
              
              <ul className="feature-list">
                <li className="limit-feature">
                  <strong>{plan.limit}</strong>
                </li>
                {plan.features.map(f => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <div className="card-footer">
                {!plan.active ? (
                  <button 
                    className={`upgrade-btn ${plan.highlight ? 'btn-pro' : 'btn-free'}`}
                    onClick={() => handleUpgradeClick(plan.name.toUpperCase())}
                  >
                    {plan.name === 'Pro' ? 'Get Started with Pro' : 'Choose Plan'}
                  </button>
                ) : (
                  <button className="upgrade-btn disabled-btn" disabled>
                    Current Plan
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <footer className="upgrade-footer">
          <p>Secure payments powered by Stripe. Cancel or change plans at any time.</p>
        </footer>
      </div>
    </div>
  );
};

export default UpgradePro;