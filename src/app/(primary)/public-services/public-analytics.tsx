'use client';
import React from 'react';

const PublicServicesAnalytics: React.FC = () => {
  const handleLearnMore = () => {
    // Redirect to the Public Services Analytics portal (update URL as needed)
    window.location.href = 'https://example-publicservices-analytics.com';
  };

  return (
    <div className="container">
      <h1>Public Services Analytics</h1>
      <p>
        iNFAgent leverages real‑time data analytics to transform public service delivery. By integrating diverse data sources, our platform provides transparent insights, drives evidence‑based policy making, and optimizes resource allocation.
      </p>

      <div className="section">
        <h2>Analytics Performance Metrics</h2>
        <div className="metrics">
          <div className="metric">
            <h3>Reports Generated</h3>
            <p>200</p>
          </div>
          <div className="metric">
            <h3>Incident Alerts</h3>
            <p>37</p>
          </div>
          <div className="metric">
            <h3>Data Coverage</h3>
            <p>95%</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Security & Integrity Metrics</h2>
        <div className="metrics security">
          <div className="metric">
            <h3>Data Mining</h3>
            <p>82%</p>
          </div>
          <div className="metric">
            <h3>Infrastructure Building</h3>
            <p>78%</p>
          </div>
          <div className="metric">
            <h3>Access Defending</h3>
            <p>88%</p>
          </div>
          <div className="metric">
            <h3>Trend Scouting</h3>
            <p>80%</p>
          </div>
          <div className="metric">
            <h3>Incident Healing</h3>
            <p>75%</p>
          </div>
        </div>
        <p className="security-note">
          * Our robust analytics framework ensures data accuracy and rapid incident detection.
        </p>
      </div>

      <div className="extra-info">
        <h2>Public Data Portals & Resources</h2>
        <ul>
          <li>
            <a href="https://www.data.gov" target="_blank" rel="noreferrer">Data.gov</a>
          </li>
          <li>
            <a href="https://www.opendatanetwork.com" target="_blank" rel="noreferrer">Open Data Network</a>
          </li>
          <li>
            <a href="https://www.govtech.com" target="_blank" rel="noreferrer">GovTech</a>
          </li>
          <li>
            <a href="https://www.digitalgov.gov" target="_blank" rel="noreferrer">DigitalGov</a>
          </li>
        </ul>
      </div>

      <button className="proceed-button" onClick={handleLearnMore}>
        Learn More About Public Analytics
      </button>

      <style jsx>{`
        .container {
          padding: 40px;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
          background: #eef7f9;
          border-radius: 12px;
          box-shadow: 0 6px 12px rgba(0,0,0,0.08);
          font-family: 'Segoe UI', sans-serif;
        }
        h1 {
          font-size: 2.8rem;
          margin-bottom: 15px;
          color: #333;
        }
        p {
          font-size: 1.15rem;
          margin-bottom: 25px;
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
          padding: 20px;
          border-radius: 10px;
          flex: 1 1 28%;
          margin: 10px;
          box-shadow: 0 3px 6px rgba(0,0,0,0.05);
        }
        .metric h3 {
          font-size: 1.3rem;
          margin-bottom: 8px;
          color: #333;
        }
        .metric p {
          font-size: 1.2rem;
          color: #666;
        }
        .security-note {
          font-size: 0.95rem;
          color: #777;
          margin-top: 10px;
        }
        .extra-info {
          text-align: left;
          margin: 30px 0;
          padding: 0 20px;
        }
        .extra-info ul {
          list-style: disc;
          padding-left: 20px;
          font-size: 1rem;
          color: #555;
        }
        .extra-info a {
          color: #0072ce;
          text-decoration: none;
        }
        .extra-info a:hover {
          text-decoration: underline;
        }
        .proceed-button {
          background-color: #0072ce;
          color: #fff;
          padding: 15px 35px;
          font-size: 1.2rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .proceed-button:hover {
          background-color: #005fa3;
        }
      `}</style>
    </div>
  );
};

export default PublicServicesAnalytics;
