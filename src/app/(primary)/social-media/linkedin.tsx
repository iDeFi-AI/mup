'use client';
import React from 'react';

const LinkedInPage: React.FC = () => {
  const handleLogin = () => {
    // Redirect to LinkedIn's login page or your OAuth endpoint
    window.location.href = 'https://www.linkedin.com/login';
  };

  return (
    <div className="container">
      <h1>LinkedIn Integration</h1>
      <p>
        Your iNFAgent is revolutionizing your professional engagement on LinkedIn. It manages connections, schedules posts, and continuously monitors for phishing attempts, spam, and fraudulent profiles—all while providing real‑time insights.
      </p>

      <div className="section">
        <h2>Platform Performance Metrics</h2>
        <div className="metrics">
          <div className="metric">
            <h3>Connections Managed</h3>
            <p>234</p>
          </div>
          <div className="metric">
            <h3>Posts Scheduled</h3>
            <p>12</p>
          </div>
          <div className="metric">
            <h3>Engagement Rate</h3>
            <p>45%</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Security Metrics & Features</h2>
        <div className="metrics security">
          <div className="metric">
            <h3>Profile Mining</h3>
            <p>80%</p>
          </div>
          <div className="metric">
            <h3>Connection Building</h3>
            <p>70%</p>
          </div>
          <div className="metric">
            <h3>Fraud Defending</h3>
            <p>60%</p>
          </div>
          <div className="metric">
            <h3>Trend Scouting</h3>
            <p>50%</p>
          </div>
          <div className="metric">
            <h3>Incident Recovery</h3>
            <p>40%</p>
          </div>
        </div>
        <p className="security-note">
          * Our intelligent algorithms protect your professional network from phishing and fraudulent activities.
        </p>
      </div>

      <div className="extra-info">
        <h2>Advanced Tools & Services</h2>
        <ul>
          <li>Automated Content Scheduling & Smart Post Recommendations</li>
          <li>Real‑Time Network Insights & Fraud Alerts</li>
          <li>Advanced Analytics for Industry Trends</li>
          <li>Customizable Dashboards for Professional Branding</li>
        </ul>
      </div>

      <button className="login-button" onClick={handleLogin}>
        Proceed to LinkedIn Login
      </button>

      <style jsx>{`
        .container {
          padding: 30px;
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
          background: #eef3f8;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.07);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
          border: 1px solid #ddd;
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
          background-color: #0077b5;
          color: white;
          padding: 12px 30px;
          font-size: 1.1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .login-button:hover {
          background-color: #005582;
        }
      `}</style>
    </div>
  );
};

export default LinkedInPage;
