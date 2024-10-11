import React, { useState } from 'react';

interface AgentManagementModalProps {
  onClose: () => void;
  onMint: (agentRole: string) => void;
}

const AgentManagementModal: React.FC<AgentManagementModalProps> = ({ onClose, onMint }) => {
  const [selectedRole, setSelectedRole] = useState('Miner'); // Default agent role

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2>Manage or Mint a New Agent</h2>
        
        {/* Dropdown for selecting agent role */}
        <select value={selectedRole} onChange={handleRoleChange} className="role-select">
          <option value="Miner">Miner</option>
          <option value="Builder">Builder</option>
          <option value="Defender">Defender</option>
          <option value="Scout">Scout</option>
          <option value="Healer">Healer</option>
        </select>
        
        {/* Mint button */}
        <button onClick={() => onMint(selectedRole)} className="mint-button">
          Mint New Agent
        </button>
        
        {/* Close button */}
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
      
      <style jsx>{`
        .modal-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5); /* Grey out the background */
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1001; /* Ensure it is above the sidebar */
        }

        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
          text-align: center;
          z-index: 1002;
        }

        .role-select {
          padding: 8px;
          font-size: 16px;
          margin: 10px;
          border-radius: 4px;
        }

        .mint-button {
          background-color: #007bff;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          margin: 10px;
        }

        .close-button {
          background-color: #ff7e2f;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          margin: 10px;
        }
      `}</style>
    </div>
  );
};

export default AgentManagementModal;
