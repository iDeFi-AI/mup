'use client';
import React from 'react';

const XTwitterPage: React.FC = () => {
  const handleLogin = () => {
    // Redirect to Twitter's login page or your OAuth endpoint
    window.location.href = 'https://twitter.com/login';
  };

  return (
    <div className="container">
      <h1>X (Twitter) Integration</h1>
      <p>
        Your iNFAgent optimizes your Twitter strategy by automating tweet scheduling, monitoring trending topics, and detecting suspicious activities. It not only enhances engagement but also secures your digital conversations.
      </p>

      <div className="section">
        <h2>Platform Performance Metrics</h2>
        <div className="metrics">
          <div className="metric">
            <h3>Tweets Optimized</h3>
            <p>78</p>
          </div>
          <div className="metric">
            <h3>Followers Engaged</h3>
            <p>12,345</p>
          </div>
          <div className="metric">
            <h3>Engagement Rate</h3>
            <p>53%</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Security Metrics & Features</h2>
        <div className="metrics security">
          <div className="metric">
            <h3>Fake Account Mining</h3>
            <p>70%</p>
          </div>
          <div className="metric">
            <h3>Content Building</h3>
            <p>65%</p>
          </div>
          <div className="metric">
            <h3>Spam Defending</h3>
            <p>60%</p>
          </div>
          <div className="metric">
            <h3>Trend Scouting</h3>
            <p>80%</p>
          </div>
          <div className="metric">
            <h3>Recovery (Healing)</h3>
            <p>55%</p>
          </div>
        </div>
        <p className="security-note">
          * Our intelligent algorithms identify and mitigate spam, fake accounts, and phishing attempts in real‑time.
        </p>
      </div>

      <div className="extra-info">
        <h2>Advanced Tools & Services</h2>
        <ul>
          <li>Automated Tweet Scheduling & Analytics</li>
          <li>Trend & Hashtag Analysis</li>
          <li>Audience Sentiment Monitoring</li>
          <li>Custom Engagement Dashboards</li>
        </ul>
      </div>

      <button className="login-button" onClick={handleLogin}>
        Proceed to Twitter Login
      </button>

      <style jsx>{`
        .container {
          padding: 30px;
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
          background: #e8f5fd;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          font-family: 'Roboto', sans-serif;
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          color: #333;
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
          color: #444;
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
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.04);
        }
        .metric h3 {
          font-size: 1.2rem;
          margin-bottom: 5px;
          color: #555;
        }
        .metric p {
          font-size: 1.1rem;
          color: #777;
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
          background-color: #1DA1F2;
          color: white;
          padding: 12px 30px;
          font-size: 1.1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .login-button:hover {
          background-color: #0d8ddb;
        }
      `}</style>
    </div>
  );
};

export default XTwitterPage;
