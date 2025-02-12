'use client';
import React from 'react';

const HealthcareDiagnostics: React.FC = () => {
  const handleLearnMore = () => {
    // Redirect to the Diagnostics Portal (update URL as needed)
    window.location.href = 'https://example-healthcare-diagnostics.com';
  };

  return (
    <div className="container">
      <h1>Predictive Diagnostics & Analytics</h1>
      <p>
        iNFAgent’s AI-driven diagnostic tools analyze patient data in real‑time to predict outcomes, generate proactive alerts, and empower healthcare providers to intervene early. Our platform fuses historical data with live inputs to ensure accurate risk scoring.
      </p>
      <div className="section">
        <h2>Diagnostic Performance Metrics</h2>
        <div className="metrics">
          <div className="metric">
            <h3>Diagnostic Accuracy</h3>
            <p>92%</p>
          </div>
          <div className="metric">
            <h3>Alerts Generated</h3>
            <p>34</p>
          </div>
          <div className="metric">
            <h3>Response Efficiency</h3>
            <p>88%</p>
          </div>
        </div>
      </div>
      <div className="section">
        <h2>Security & Compliance Metrics</h2>
        <div className="metrics security">
          <div className="metric">
            <h3>Patient Data Mining</h3>
            <p>90%</p>
          </div>
          <div className="metric">
            <h3>System Integrity</h3>
            <p>85%</p>
          </div>
          <div className="metric">
            <h3>Threat Defending</h3>
            <p>88%</p>
          </div>
          <div className="metric">
            <h3>Anomaly Scouting</h3>
            <p>80%</p>
          </div>
          <div className="metric">
            <h3>Incident Recovery</h3>
            <p>75%</p>
          </div>
        </div>
        <p className="security-note">
          * Robust security measures ensure patient data privacy and system resilience.
        </p>
      </div>
      <div className="extra-info">
        <h2>Diagnostic Partners</h2>
        <ul>
          <li>
            <a href="https://www.labcorp.com" target="_blank" rel="noreferrer">LabCorp</a>
          </li>
          <li>
            <a href="https://www.questdiagnostics.com" target="_blank" rel="noreferrer">Quest Diagnostics</a>
          </li>
          <li>
            <a href="https://www.bioreference.com" target="_blank" rel="noreferrer">BioReference Laboratories</a>
          </li>
        </ul>
      </div>
      <button className="proceed-button" onClick={handleLearnMore}>
        Learn More About Diagnostics
      </button>

      <style jsx>{`
        .container {
          padding: 40px;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
          background: #f9f9fb;
          border-radius: 12px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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

export default HealthcareDiagnostics;
