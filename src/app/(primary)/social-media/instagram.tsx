'use client';
import React from 'react';

const InstagramPage: React.FC = () => {
  const handleLogin = () => {
    // Redirect to Instagram's login page or your OAuth endpoint
    window.location.href = 'https://www.instagram.com/accounts/login/';
  };

  return (
    <div className="container">
      <h1>Instagram Integration</h1>
      <p>
        Your iNFAgent is elevating your Instagram presence by optimizing post performance and hashtag strategies while safeguarding content integrity. It automatically detects trends and potential security risks to keep your brand protected.
      </p>

      <div className="section">
        <h2>Platform Performance Metrics</h2>
        <div className="metrics">
          <div className="metric">
            <h3>Posts Optimized</h3>
            <p>89</p>
          </div>
          <div className="metric">
            <h3>Hashtags Monitored</h3>
            <p>50</p>
          </div>
          <div className="metric">
            <h3>Engagement Rate</h3>
            <p>65%</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Security Metrics & Features</h2>
        <div className="metrics security">
          <div className="metric">
            <h3>Content Verification</h3>
            <p>70%</p>
          </div>
          <div className="metric">
            <h3>Privacy Protection</h3>
            <p>68%</p>
          </div>
          <div className="metric">
            <h3>Phishing Detection</h3>
            <p>60%</p>
          </div>
          <div className="metric">
            <h3>Trend Scouting</h3>
            <p>80%</p>
          </div>
          <div className="metric">
            <h3>Recovery (Healing)</h3>
            <p>60%</p>
          </div>
        </div>
        <p className="security-note">
          * Our security suite ensures content authenticity and user privacy on Instagram.
        </p>
      </div>

      <div className="extra-info">
        <h2>Additional Tools & Services</h2>
        <ul>
          <li>Auto-Post Scheduling & Content Calendar</li>
          <li>Hashtag Strategy & Trend Detection</li>
          <li>Automated Engagement Alerts</li>
          <li>Advanced Image & Video Analytics</li>
        </ul>
      </div>

      <button className="login-button" onClick={handleLogin}>
        Proceed to Instagram Login
      </button>

      <style jsx>{`
        .container {
          padding: 30px;
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
          background: #fafafa;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          font-family: 'Helvetica Neue', Arial, sans-serif;
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          color: #4a4a4a;
        }
        p {
          font-size: 1.1rem;
          margin-bottom: 20px;
          line-height: 1.6;
          color: #555;
        }
        h2 {
          font-size: 1.8rem;
          margin-bottom: 15px;
          color: #333;
        }
        .metrics {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
        }
        .metric {
          background: #fff;
          border: 1px solid #eee;
          padding: 15px;
          border-radius: 8px;
          flex: 1 1 28%;
          margin: 10px 0;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        .metric h3 {
          font-size: 1.2rem;
          margin-bottom: 5px;
          color: #444;
        }
        .metric p {
          font-size: 1.1rem;
          color: #666;
        }
        .security-note {
          font-size: 0.9rem;
          color: #888;
          margin-top: 10px;
        }
        .extra-info {
          margin: 30px 0;
          text-align: left;
          padding: 0 20px;
        }
        .extra-info ul {
          list-style: disc;
          padding-left: 20px;
          color: #555;
          font-size: 1rem;
        }
        .login-button {
          background-color: #e1306c;
          color: white;
          padding: 12px 30px;
          font-size: 1.1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .login-button:hover {
          background-color: #c13584;
        }
      `}</style>
    </div>
  );
};

export default InstagramPage;
