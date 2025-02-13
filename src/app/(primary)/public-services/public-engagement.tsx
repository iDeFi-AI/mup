'use client';
import React from 'react';

const PublicServicesEngagement: React.FC = () => {
  const handleLearnMore = () => {
    // Redirect to the Public Services Engagement portal
    window.location.href = 'https://example-publicservices-engagement.com';
  };

  return (
    <div className="container">
      <h1>Citizen Engagement & Digital Services</h1>
      <p>
        iNFAgent enhances public service delivery by engaging citizens through digital platforms. Our system collects feedback, streamlines public consultations, and ensures quick, transparent responses to community needs.
      </p>

      <div className="section">
        <h2>Engagement Metrics</h2>
        <div className="metrics">
          <div className="metric">
            <h3>Public Consultations</h3>
            <p>45</p>
          </div>
          <div className="metric">
            <h3>Feedback Entries</h3>
            <p>3,200</p>
          </div>
          <div className="metric">
            <h3>Citizen Satisfaction</h3>
            <p>88%</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Security & Integrity Metrics</h2>
        <div className="metrics security">
          <div className="metric">
            <h3>Data Mining</h3>
            <p>78%</p>
          </div>
          <div className="metric">
            <h3>System Building</h3>
            <p>82%</p>
          </div>
          <div className="metric">
            <h3>Threat Defending</h3>
            <p>85%</p>
          </div>
          <div className="metric">
            <h3>Feedback Scouting</h3>
            <p>90%</p>
          </div>
          <div className="metric">
            <h3>Service Healing</h3>
            <p>75%</p>
          </div>
        </div>
        <p className="security-note">
          * These figures represent our ability to protect citizen data and maintain service integrity.
        </p>
      </div>

      <div className="extra-info">
        <h2>Additional Tools & Partnerships</h2>
        <ul>
          <li>
            <a href="https://www.mygov.in" target="_blank" rel="noreferrer">MyGov.in</a>
          </li>
          <li>
            <a href="https://www.usa.gov/citizen" target="_blank" rel="noreferrer">USA.gov Citizen Services</a>
          </li>
          <li>
            <a href="https://www.digitalgov.gov" target="_blank" rel="noreferrer">DigitalGov</a>
          </li>
          <li>
            <a href="https://www.civicplus.com" target="_blank" rel="noreferrer">CivicPlus</a>
          </li>
        </ul>
      </div>

      <button className="proceed-button" onClick={handleLearnMore}>
        Learn More About Citizen Engagement
      </button>

      <style jsx>{`
        .container {
          padding: 40px;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
          background: #f2f6f9;
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

export default PublicServicesEngagement;
