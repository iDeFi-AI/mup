'use client';
import React from 'react';

const WarpcastPage: React.FC = () => {
  const handleLogin = () => {
    // Redirect to Warpcast (Farcaster.xyz) login page or your OAuth endpoint
    window.location.href = 'https://warpcast.com/login';
  };

  return (
    <div className="container">
      <h1>Warpcast (Farcaster) Integration</h1>
      <p>
        Your iNFAgent is optimizing your live-streaming experience on Warpcast (Farcaster.xyz) by monitoring stream quality, preventing unauthorized access, and ensuring secure broadcast performance.
      </p>

      <div className="section">
        <h2>Platform Performance Metrics</h2>
        <div className="metrics">
          <div className="metric">
            <h3>Live Viewers Monitored</h3>
            <p>456</p>
          </div>
          <div className="metric">
            <h3>Streams Analyzed</h3>
            <p>5</p>
          </div>
          <div className="metric">
            <h3>Quality Score</h3>
            <p>82%</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Security Metrics & Features</h2>
        <div className="metrics security">
          <div className="metric">
            <h3>Stream Mining</h3>
            <p>65%</p>
          </div>
          <div className="metric">
            <h3>Broadcast Building</h3>
            <p>75%</p>
          </div>
          <div className="metric">
            <h3>Access Defending</h3>
            <p>70%</p>
          </div>
          <div className="metric">
            <h3>Quality Scouting</h3>
            <p>80%</p>
          </div>
          <div className="metric">
            <h3>Incident Healing</h3>
            <p>60%</p>
          </div>
        </div>
        <p className="security-note">
          * These metrics ensure your live streams are secure and of the highest quality.
        </p>
      </div>

      <div className="extra-info">
        <h2>Advanced Tools & Services</h2>
        <ul>
          <li>Real‑Time Stream Quality Analytics</li>
          <li>Unauthorized Access Alerts</li>
          <li>Viewer Engagement & Content Piracy Prevention</li>
          <li>Customizable Broadcast Performance Dashboard</li>
        </ul>
      </div>

      <button className="login-button" onClick={handleLogin}>
        Proceed to Warpcast Login
      </button>

      <style jsx>{`
        .container {
          padding: 30px;
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
          background: #fff7e6;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
          font-family: Verdana, sans-serif;
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
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.04);
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
          background-color: #ff6600;
          color: white;
          padding: 12px 30px;
          font-size: 1.1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .login-button:hover {
          background-color: #cc5200;
        }
      `}</style>
    </div>
  );
};

export default WarpcastPage;
