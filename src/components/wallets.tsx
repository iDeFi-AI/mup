import React from "react";
import Image from "next/image";

interface WalletSelectionModalProps {
  onSelect: (provider: string) => void;
  onClose: () => void;
}

const WalletSelectionModal: React.FC<WalletSelectionModalProps> = ({ onSelect, onClose }) => {
  return (
    <div className="wallet-modal-container">
      <div className="wallet-modal-content">
        <h2 className="modal-title">Select a Wallet</h2>
        <div className="wallet-options">
          <button
            onClick={() => onSelect("MetaMask")}
            className="wallet-option"
          >
            <Image src="/metamask-logo.png" alt="MetaMask" width={32} height={32} />
            <span>MetaMask</span>
          </button>
          <button
            onClick={() => onSelect("CoinbaseWallet")}
            className="wallet-option"
          >
            <Image src="/coinbase-logo.png" alt="Coinbase Wallet" width={32} height={32} />
            <span>Coinbase Wallet</span>
          </button>
          {/* Add more wallet options as needed */}
        </div>
        <button onClick={onClose} className="close-button">Cancel</button>
      </div>
      
      <style jsx>{`
        .wallet-modal-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1001; /* Grey out background */
        }

        .wallet-modal-content {
          background-color: white;
          padding: 25px;
          border-radius: 8px;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 1002; /* Modal content appears above */
          width: 100%;
          max-width: 400px;
          text-align: center;
        }

        .modal-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .wallet-options {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .wallet-option {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px; /* Adjust gap between the logo and text */
          padding: 10px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background-color: white;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.2s;
        }

        .wallet-option:hover {
          background-color: #ff7e2f;
          color: #ffffff;
          transform: scale(1.02); /* Slight scale on hover */
        }

        .close-button {
          margin-top: 20px;
          font-size: 16px;
          color: #007bff;
          background: none;
          border: none;
          cursor: pointer;
        }

        .close-button:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default WalletSelectionModal;
