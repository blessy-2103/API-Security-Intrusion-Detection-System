import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentPage.css';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const selectedPlan = location.state?.selectedPlan || 'PRO';
    const planPrice = selectedPlan === 'PRO' ? '29.00' : '0.00';
    const [processing, setProcessing] = useState(false);

    const handlePayment = (e) => {
        e.preventDefault();
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            alert(`Success! APIGuardian ${selectedPlan} is now active.`);
            navigate('/dashboard');
        }, 2500);
    };

    return (
        <div className="checkout-viewport">
            <div className="checkout-container">
                {/* Left Side: Summary & API Focus */}
                <aside className="checkout-sidebar">
                    <button className="back-link" onClick={() => navigate(-1)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                        Back to plans
                    </button>

                    <div className="brand-context">
                        <div className="logo-placeholder">AG</div>
                        <div>
                            <h3>APIGuardian</h3>
                            <p>API Security & Gateway</p>
                        </div>
                    </div>

                    <div className="order-details">
                        <div className="price-main">
                            <span className="currency">$</span>
                            <span className="amount">{planPrice}</span>
                            <span className="period">/per month</span>
                        </div>
                        
                        <div className="plan-pill">
                            <span className="dot"></span> {selectedPlan} PLAN
                        </div>

                        <div className="benefit-stack">
                            <div className="benefit-item">
                                <strong>Global Rate Limiting</strong>
                                <p>Prevent DDoS and brute-force attacks</p>
                            </div>
                            <div className="benefit-item">
                                <strong>JWT & API Key Guard</strong>
                                <p>Automated credential rotation & validation</p>
                            </div>
                            <div className="benefit-item">
                                <strong>Advanced Analytics</strong>
                                <p>Deep inspection of request payloads</p>
                            </div>
                        </div>
                    </div>

                    <footer className="sidebar-footer">
                        <p>© 2026 APIGuardian Security Systems</p>
                    </footer>
                </aside>

                {/* Right Side: Payment Form */}
                <main className="checkout-form-area">
                    <div className="form-header">
                        <h2>Payment Details</h2>
                        <div className="secure-tag">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                            Enterprise Grade Security
                        </div>
                    </div>

                    <form onSubmit={handlePayment} className="premium-form">
                        <div className="input-field">
                            <label>Email Address</label>
                            <input type="email" placeholder="developer@company.com" required />
                        </div>

                        <div className="input-field">
                            <label>Card Information</label>
                            <div className="card-input-group">
                                <input type="text" className="card-num" placeholder="Card number" maxLength="19" required />
                                <div className="card-sub-group">
                                    <input type="text" placeholder="MM / YY" maxLength="5" required />
                                    <input type="text" placeholder="CVC" maxLength="3" required />
                                </div>
                            </div>
                        </div>

                        <div className="input-field">
                            <label>Billing Country</label>
                            <select className="premium-select">
                                <option>United States</option>
                                <option>India</option>
                                <option>United Kingdom</option>
                                <option>Singapore</option>
                            </select>
                        </div>

                        <button type="submit" className="complete-btn" disabled={processing}>
                            {processing ? (
                                <div className="loader-dots"><span></span><span></span><span></span></div>
                            ) : (
                                `Activate APIGuardian ${selectedPlan}`
                            )}
                        </button>
                    </form>

                    <div className="checkout-footer">
                        <p>Payments are processed securely. By subscribing, you agree to APIGuardian's Terms of Service and Privacy Policy.</p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PaymentPage;