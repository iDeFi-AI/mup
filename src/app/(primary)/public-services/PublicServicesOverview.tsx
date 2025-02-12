'use client';
import React from 'react';

const PublicServicesOverview: React.FC = () => {
  const handleLearnMore = () => {
    // Update this URL to your actual public services overview portal
    window.location.href = 'https://example-publicservices-overview.com';
  };

  return (
    <div className="container">
      <h1>Public Services Overview</h1>
      <p>
        iNFAgent empowers public service agencies by streamlining operations, enhancing transparency, and ensuring efficient service delivery. Our platform provides real‑time monitoring and actionable insights to help governments and public organizations serve their communities effectively.
      </p>
      
      <div className="section">
        <h2>Service Performance Metrics</h2>
        <div className="metrics">
          <div className="metric">
            <h3>Citizens Served</h3>
            <p>15,000</p>
          </div>
          <div className="metric">
            <h3>Avg. Response Time</h3>
            <p>4.5 min</p>
          </div>
          <div className="metric">
            <h3>Service Coverage</h3>
            <p>92%</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Security & Efficiency Metrics</h2>
        <div className="metrics security">
          <div className="metric">
            <h3>Data Mining</h3>
            <p>80%</p>
          </div>
          <div className="metric">
            <h3>Infrastructure Building</h3>
            <p>75%</p>
          </div>
          <div className="metric">
            <h3>Service Defending</h3>
            <p>85%</p>
          </div>
          <div className="metric">
            <h3>Needs Scouting</h3>
            <p>90%</p>
          </div>
          <div className="metric">
            <h3>Incident Healing</h3>
            <p>70%</p>
          </div>
        </div>
        <p className="security-note">
          * These metrics showcase our commitment to maintaining transparency and operational efficiency.
        </p>
      </div>

      <div className="extra-info">
        <h2>Partner Platforms & Resources</h2>
        <ul>
          <li><a href="https://www.usa.gov" target="_blank" rel="noreferrer">USA.gov</a></li>
          <li><a href="https://www.data.gov" target="_blank" rel="noreferrer">Data.gov</a></li>
          <li><a href="https://www.civicplus.com" target="_blank" rel="noreferrer">CivicPlus</a></li>
          <li><a href="https://www.govtech.com" target="_blank" rel="noreferrer">GovTech</a></li>
        </ul>
      </div>

      <button className="proceed-button" onClick={handleLearnMore}>
        Learn More About Public Services
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
          margin: 30px 0;
          text-align: left;
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

export default PublicServicesOverview;
