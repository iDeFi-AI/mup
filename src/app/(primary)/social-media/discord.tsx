'use client';
import React from 'react';

const DiscordPage: React.FC = () => {
  const handleLogin = () => {
    // Redirect to Discord's login page or your OAuth endpoint
    window.location.href = 'https://discord.com/login';
  };

  return (
    <div className="container">
      <h1>Discord Integration</h1>
      <p>
        Your iNFAgent is actively safeguarding your Discord community. It detects malicious behavior, filters spam, and ensures secure, real‑time communication. Our intelligent system adapts to evolving community trends, flagging suspicious activity and providing actionable moderation insights.
      </p>

      <div className="section">
        <h2>Platform Performance Metrics</h2>
        <div className="metrics">
          <div className="metric">
            <h3>Moderation Hours</h3>
            <p>12 hrs</p>
          </div>
          <div className="metric">
            <h3>Messages Analyzed</h3>
            <p>2,345</p>
          </div>
          <div className="metric">
            <h3>Engagement Score</h3>
            <p>89%</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Security Metrics & Features</h2>
        <div className="metrics security">
          <div className="metric">
            <h3>Content Mining</h3>
            <p>75%</p>
          </div>
          <div className="metric">
            <h3>Channel Building</h3>
            <p>60%</p>
          </div>
          <div className="metric">
            <h3>Threat Defending</h3>
            <p>90%</p>
          </div>
          <div className="metric">
            <h3>Behavior Scouting</h3>
            <p>85%</p>
          </div>
          <div className="metric">
            <h3>Recovery (Healing)</h3>
            <p>55%</p>
          </div>
        </div>
        <p className="security-note">
          * These metrics reflect our tailored moderation algorithms that keep Discord channels secure and engaging.
        </p>
      </div>

      <div className="extra-info">
        <h2>Enhanced Tools & Services</h2>
        <ul>
          <li>Real‑Time Incident Alerts & Automated Moderation</li>
          <li>Advanced Spam & Abuse Detection</li>
          <li>AI‑Powered User Behavior Analysis</li>
          <li>Customizable Security Dashboards for Community Managers</li>
        </ul>
      </div>

      <button className="login-button" onClick={handleLogin}>
        Proceed to Discord Login
      </button>

      <style jsx>{`
        .container {
          padding: 30px;
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
          font-family: Arial, sans-serif;
          background: #f0f2f5;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          color: #4a4a4a;
        }
        p {
          font-size: 1.1rem;
          margin-bottom: 20px;
          line-height: 1.5;
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
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 8px;
          flex: 1 1 28%;
          margin: 10px 0;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        .metric h3 {
          font-size: 1.2rem;
          margin-bottom: 5px;
          color: #333;
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
          background-color: #7289da;
          color: white;
          padding: 12px 30px;
          font-size: 1.1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .login-button:hover {
          background-color: #677bc4;
        }
      `}</style>
    </div>
  );
};

export default DiscordPage;
