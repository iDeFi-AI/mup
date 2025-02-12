'use client';
import React from 'react';

const HealthcareDataManagement: React.FC = () => {
  const handleLearnMore = () => {
    // Redirect to the Healthcare Data Management portal (update URL as needed)
    window.location.href = 'https://example-healthcare-datamanagement.com';
  };

  return (
    <div className="container">
      <h1>Secure Healthcare Data Management</h1>
      <p>
        iNFAgent ensures that all sensitive healthcare data is securely stored, synchronized, and audited. Our platform employs rigorous encryption, continuous monitoring, and automated access controls to guarantee patient privacy and regulatory compliance.
      </p>

      <div className="section">
        <h2>Data Management Performance Metrics</h2>
        <div className="metrics">
          <div className="metric">
            <h3>Records Synchronized</h3>
            <p>12,345</p>
          </div>
          <div className="metric">
            <h3>Data Integrity Score</h3>
            <p>98%</p>
          </div>
          <div className="metric">
            <h3>User Access Audits</h3>
            <p>150 audits</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Security & Compliance Metrics</h2>
        <div className="metrics security">
          <div className="metric">
            <h3>Data Mining</h3>
            <p>88%</p>
          </div>
          <div className="metric">
            <h3>Repository Building</h3>
            <p>85%</p>
          </div>
          <div className="metric">
            <h3>Access Defending</h3>
            <p>93%</p>
          </div>
          <div className="metric">
            <h3>Anomaly Scouting</h3>
            <p>80%</p>
          </div>
          <div className="metric">
            <h3>Incident Recovery</h3>
            <p>90%</p>
          </div>
        </div>
        <p className="security-note">
          * Our advanced encryption protocols and continuous monitoring ensure that your healthcare data remains secure and compliant.
        </p>
      </div>

      <div className="extra-info">
        <h2>Industry Partners</h2>
        <ul>
          <li>
            <a href="https://www.cerner.com" target="_blank" rel="noreferrer">Cerner</a>
          </li>
          <li>
            <a href="https://www.epic.com" target="_blank" rel="noreferrer">Epic Systems</a>
          </li>
          <li>
            <a href="https://www.mckesson.com" target="_blank" rel="noreferrer">McKesson</a>
          </li>
          <li>
            <a href="https://www.meditech.com" target="_blank" rel="noreferrer">Meditech</a>
          </li>
        </ul>
      </div>

      <button className="proceed-button" onClick={handleLearnMore}>
        Learn More About Data Management
      </button>

      <style jsx>{`
        .container {
          padding: 40px;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
          background: #f4f7fc;
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

export default HealthcareDataManagement;
