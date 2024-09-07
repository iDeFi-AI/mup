"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  connectWallet,
  disconnectWallet,
  syncWalletData,
} from "@/utilities/web3Utils";
import WalletSelectionModal from "@/components/wallets";
import {
  AnalysisIcon,
  ShieldIcon,
  GraphIcon,
  KeyIcon,
  MoneyIcon,
  BalanceIcon,
  AdvisorIcon,
  ContractIcon,
  SavingsIcon,
  ChecklistIcon,
  StarIcon,
  PlusIcon,
  CopyIcon,
  LightningIcon,
  Alert,
} from "@/components/icons";
import SecurityCheck from "./security/security-check";
import SourceDestination from "./security/source-destination";
import FinancialRoadmap from "./planning/financial-roadmap";
import InvestmentSimulator from "./planning/investment-simulator";
import FinancialHealth from "./metrics/financial-health";
import CommunicationHub from "./client-support/communication-hub";
import ShareDashboardModal from "./client-support/share-dashboard";
import UpgradePlanModal from "./upgrade/UpgradePlanModal";

const categories = {
  ALL: ["SecurityCheck", "SourceDestination", "FinancialRoadmap", "InvestmentSimulator", "FinancialHealth", "CommunicationHub"],
  PLANNING: ["FinancialRoadmap", "InvestmentSimulator"],
  METRICS: ["FinancialHealth"],
  SECURITY: ["SecurityCheck", "SourceDestination"],
  CLIENT_SUPPORT: ["CommunicationHub"],
};

const DashboardV3: React.FC = () => {
  // Instead of just string[], now connectedAccounts is an array of objects
  const [connectedAccounts, setConnectedAccounts] = useState<
    { account: string; provider: string }[]
  >([]);
  const [manualAddress, setManualAddress] = useState<string>("");
  const [mainAccount, setMainAccount] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [recents, setRecents] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filteredTools, setFilteredTools] = useState<string[]>(categories.ALL);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [recentsOpen, setRecentsOpen] = useState<boolean>(true);
  const [favoritesOpen, setFavoritesOpen] = useState<boolean>(true);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // State for modal visibility
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false); // Upgrade plan modal visibility
  const openUpgradeModal = () => setIsUpgradeModalOpen(true);
  const closeUpgradeModal = () => setIsUpgradeModalOpen(false);

  useEffect(() => {
    if (connectedAccounts.length > 0) {
      syncWalletData(connectedAccounts.map(acc => acc.account));
    }
  }, [connectedAccounts]);

  const handleConnectWallet = () => {
    setShowWalletModal(true);
  };

  const handleWalletSelect = async (provider: string) => {
    const accounts = await connectWallet(provider);
    if (accounts) {
      const uniqueAccounts = Array.from(
        new Set([
          ...connectedAccounts,
          ...accounts.map((account: string) => ({ account, provider })),
        ])
      );
      setConnectedAccounts(uniqueAccounts);
      setMainAccount(uniqueAccounts[0].account); // Set the first account as the main account
      setShowWalletModal(false);
    } else {
      alert("Failed to connect wallet. Please try again.");
    }
  };

  const handleDisconnectWallet = (account: string) => {
    const updatedAccounts = connectedAccounts.filter(acc => acc.account !== account);
    setConnectedAccounts(updatedAccounts);
    if (mainAccount === account) {
      setMainAccount(updatedAccounts.length > 0 ? updatedAccounts[0].account : null);
    }
    disconnectWallet();
  };

  const copyToClipboard = (account: string) => {
    navigator.clipboard.writeText(account);
    alert("Address copied to clipboard!");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const shortenAddress = (address: string) => {
    const isMobile = window.innerWidth < 768;
    return isMobile
      ? address.length > 10
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : address
      : address.length > 10
      ? `${address.slice(0, 42)}...${address.slice(-6)}`
      : address;
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualAddress(e.target.value);
  };

  const addManualAddress = () => {
    if (manualAddress && !connectedAccounts.some(acc => acc.account === manualAddress)) {
      setConnectedAccounts(prevAccounts => [...prevAccounts, { account: manualAddress, provider: "Manual" }]);
      setMainAccount(manualAddress);
      setManualAddress("");
    } else {
      alert("This address is already added or invalid.");
    }
  };

  const handleFilterClick = (filter: keyof typeof categories) => {
    setFilteredTools(categories[filter]);
    setActiveCategory(filter);
    setActiveTool(null);
  };

  const handleToolClick = (tool: string) => {
    setActiveTool(tool);
    setRecents(prev => [tool, ...prev.filter(item => item !== tool)].slice(0, 5));
    setIsShareModalOpen(false);
  };

  const toggleFavorite = (tool: string) => {
    setFavorites(prev =>
      prev.includes(tool) ? prev.filter(item => item !== tool) : [...prev, tool]
    );
  };

  const handleCloseModal = () => {
    setIsShareModalOpen(false);
  };
  

  const renderActiveTool = () => {
    switch (activeTool) {
      case "SecurityCheck":
        return <SecurityCheck />;
      case "SourceDestination":
        return <SourceDestination />;
      case "FinancialRoadmap":
        return <FinancialRoadmap />;
      case "InvestmentSimulator":
        return <InvestmentSimulator />;
      case "FinancialHealth":
        return <FinancialHealth />;
      case "CommunicationHub":
        return <CommunicationHub />;
      default:
        return renderToolGrid();
    }
  };

  const renderToolGrid = () => (
    <div className="grid-container">
      {categories[activeCategory as keyof typeof categories].map((tool) => (
        <div
          key={tool}
          className="grid-item"
          onClick={() => handleToolClick(tool)}
        >
          <div className="icon-placeholder">
            {tool === "SecurityCheck" ? <ShieldIcon /> : tool === "FinancialHealth" ? <BalanceIcon /> : <ChecklistIcon />}
          </div>
          <p>{tool.replace(/([A-Z])/g, " $1")}</p> {/* Converts camelCase to readable format */}
          <span
            className={`star-icon ${favorites.includes(tool) ? "favorited" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(tool);
            }}
          >
            {favorites.includes(tool) ? "★" : "☆"}
          </span>
        </div>
      ))}
    </div>
  );

  const getWalletLogo = (provider: string) => {
    if (provider === "MetaMask") {
      return "/metamask-logo.png";
    } else if (provider === "CoinbaseWallet") {
      return "/coinbase-logo.png";
    } else {
      return "/logo.png";
    }
  };

  return (
    <div className="dashboard-container">
      {showWalletModal && (
        <WalletSelectionModal
          onSelect={handleWalletSelect}
          onClose={() => setShowWalletModal(false)}
        />
      )}

      <div className="sidebar">
        <div className="logo">
          <Image 
            src="/brandlogo.png" 
            alt="iDEFi.AI Logo" 
            width={150} 
            height={50} 
            className="logo-image"
          />
        </div>
        <nav className="nav-menu">
        <ul>
          <li className={activeTool === null ? "active" : ""} onClick={() => setActiveTool(null)}>
            <AdvisorIcon /> Agent Tools
          </li>

          <li onClick={() => setRecentsOpen(!recentsOpen)}>
            <GraphIcon /> Recents {recentsOpen ? "▼" : "►"}
          </li>
          {recentsOpen && recents.length > 0 && (
              <ul className="sub-menu">
                {recents.map((tool) => (
                  <li key={tool} onClick={() => handleToolClick(tool)}>
                    {tool.replace(/([A-Z])/g, " $1")}
                  </li>
                ))}
              </ul>
            )}

          <li onClick={() => setFavoritesOpen(!favoritesOpen)}>
            <StarIcon /> Favorites {favoritesOpen ? "▼" : "►"}
          </li>
          {favoritesOpen && favorites.length > 0 && (
              <ul className="sub-menu">
                {favorites.map((tool) => (
                  <li key={tool} onClick={() => handleToolClick(tool)}>
                    {tool.replace(/([A-Z])/g, " $1")}
                  </li>
                ))}
              </ul>
            )}

          {/* Share with Client button triggers the modal */}
          <li onClick={() => setIsShareModalOpen(true)}>
            <ContractIcon /> Share with Client
          </li>

           {/* Upgrade Plan button triggers the upgrade plan modal */}
            <li onClick={openUpgradeModal}>
              <LightningIcon /> Upgrade Plan
            </li>
        </ul>
        <p className="beta-notice">
            <Alert /> This is a Beta version of our Demo. Please be aware that some of the features and access to certain tools will be limited.
          </p>
      </nav>

      {/* Other dashboard content */}

      {/* Render the modal when isShareModalOpen is true */}
      {isShareModalOpen && (
        <ShareDashboardModal onClose={handleCloseModal} />
      )}

      {/* Upgrade Plan Modal */}
      {isUpgradeModalOpen && (
        <UpgradePlanModal onClose={closeUpgradeModal} />
      )}

      </div>
      
      <div className="main-content bg-background-color">
        <div className="header">
          <div className="wallet-management">
            <div className="wallet-summary" onClick={toggleDropdown}>
              <span>{mainAccount ? shortenAddress(mainAccount) : "No Wallet Connected"}</span>
              <span>{showDropdown ? "▲" : "▼"}</span>
            </div>
            {showDropdown && (
              <div className="wallet-dropdown">
                {connectedAccounts.map(({ account, provider }, index) => (
                  <div key={index} className="wallet-info" onClick={() => setMainAccount(account)}>
                    <Image
                      src={getWalletLogo(provider)}
                      alt="Wallet Logo"
                      width={24}
                      height={24}
                      className="wallet-logo"
                      priority
                      quality={100}
                      layout="fixed"
                    />
                    <span className="wallet-address" title={account}>
                      {shortenAddress(account)}
                    </span>
                    <button onClick={() => copyToClipboard(account)} className="copy-button">
                      <CopyIcon />
                    </button>
                    <button onClick={() => handleDisconnectWallet(account)} className="disconnect-button">
                      Disconnect
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button onClick={handleConnectWallet} className="connect-button">
              <KeyIcon style={{ marginRight: '8px' }} />
              Connect and Sync Your Wallets
            </button>
          </div>
          <div className="wallet-input-container">
            <input
              type="text"
              className="wallet-input"
              value={manualAddress}
              placeholder="Enter Wallet Address . . ."
              onChange={handleManualInput}
            />
            <button onClick={addManualAddress} className="add-button">
              <PlusIcon style={{ marginRight: '8px' }} />
              Add
            </button>
          </div>
          <div className="filter-buttons">
            <button 
              className={`filter-button ${activeCategory === 'ALL' ? 'active' : ''}`} 
              onClick={() => handleFilterClick('ALL')}
            >
              ALL
            </button>
            <button 
              className={`filter-button ${activeCategory === 'PLANNING' ? 'active' : ''}`} 
              onClick={() => handleFilterClick('PLANNING')}
            >
              Planning
            </button>
            <button 
              className={`filter-button ${activeCategory === 'METRICS' ? 'active' : ''}`} 
              onClick={() => handleFilterClick('METRICS')}
            >
              Metrics
            </button>
            <button 
              className={`filter-button ${activeCategory === 'SECURITY' ? 'active' : ''}`} 
              onClick={() => handleFilterClick('SECURITY')}
            >
              Security
            </button>
            <button 
              className={`filter-button ${activeCategory === 'CLIENT_SUPPORT' ? 'active' : ''}`} 
              onClick={() => handleFilterClick('CLIENT_SUPPORT')}
            >
              Client Support
            </button>
          </div>
        </div>

        {renderActiveTool()}
      </div>

      <style jsx>{`
      .dashboard-container {
        display: flex;
        height: 100vh;
        background-color: #f8f9fa;
        overflow: hidden;
      }

      .sidebar {
        width: 240px;
        background-color: white;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        border-right: 1px solid #E0E0E0;
        overflow-y: auto;
        transition: all 0.3s ease;
      }

      .logo {
        margin-bottom: 30px;
      }

      .logo-image {
        max-width: 150px;
        height: auto;
      }

      .nav-menu ul {
        list-style: none;
        padding: 0;
        width: 100%;
        display: flex;
        flex-direction: column;
      }

      .nav-menu li {
        padding: 15px 20px;
        font-size: 16px;
        color: #757575;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        border-radius: 8px;
        transition: background-color 0.3s, color 0.3s;
      }

      .nav-menu li.active,
      .nav-menu li:hover {
        color: #FF7E2F;
        background-color: #f2f2f2;
        font-weight: bold;
      }

      .sub-menu {
        padding-left: 20px;
        margin-top: 5px;
      }

      .sub-menu li {
        padding: 10px;
        font-size: 14px;
        color: #555;
        cursor: pointer;
        border-radius: 6px;
        transition: background-color 0.3s, color 0.3s;
      }

      .sub-menu li:hover {
        color: #FF7E2F;
        background-color: #f2f2f2;
      }

      .upgrade-section {
        margin-top: auto;
        text-align: center;
      }

      .upgrade-button {
        background-color: #FF7E2F;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        margin-bottom: 10px;
      }

      .main-content {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        transition: all 0.3s ease;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 30px;
      }

      .wallet-management {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        max-width: 600px;
      }

      .wallet-summary {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background-color: #f2f2f2;
        border-radius: 8px;
        cursor: pointer;
      }

      .wallet-info {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .wallet-address {
        font-size: 14px;
        color: #333;
      }

      .copy-button,
      .disconnect-button {
        background-color: #FF7E2F;
        color: white;
        padding: 5px 10px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
      }

      .wallet-dropdown {
        margin-top: 10px;
        padding: 10px;
        background-color: white;
        border: 1px solid #E0E0E0;
        border-radius: 8px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        max-height: 200px;
        overflow-y: auto;
      }

      .wallet-dropdown div:hover {
          background-color: #f2f2f2;
          transition: background-color 0.3s;
          cursor: pointer;
        }

      .connect-button {
        background-color: #FF7E2F;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        margin-top: 10px;
      }

      .wallet-input-container {
        display: flex;
        gap: 10px;
        flex: 1;
        margin-top: 10px;
        width: 100%;
      }

      .wallet-input {
        width: 100%;
        padding: 10px;
        border: 1px solid #E0E0E0;
        border-radius: 8px;
        font-size: 16px;
      }

      .add-button {
        background-color: #007bff;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
      }

      .filter-buttons {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        width: 100%;
        margin-top: 10px;
      }

      .filter-button {
        background-color: #F1F0EB;
        color: #333;
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.3s, color 0.3s;
        flex: 1;
      }

      .filter-button.active,
      .filter-button:hover {
        background-color: #FF7E2F;
        color: white;
      }

      .grid-container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        width: 100%;
      }

      .grid-item {
        background-color: white;
        border: 1px solid #E0E0E0;
        border-radius: 12px;
        height: 150px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        cursor: pointer;
        transition: transform 0.3s, box-shadow 0.3s;
        position: relative;
      }

      .grid-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
      }

      .icon-placeholder {
        margin-bottom: 10px;
      }

      .grid-item p {
        font-size: 14px;
        color: #757575;
      }

      .star-icon {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        font-size: 20px;
        color: #FFD700;
      }

      .star-icon.favorited {
        color: #FF7E2F;
      }

       .beta-notice {
          margin-top: 20px;
          padding: 10px;
          background-color: #fff3cd;
          color: #856404;
          border: 1px solid #ffeeba;
          border-radius: 8px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

      @media (max-width: 1200px) {
        .grid-container {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      @media (max-width: 1024px) {
        .grid-container {
          grid-template-columns: repeat(2, 1fr);
        }

        .sidebar {
          width: 200px;
        }
      }

      @media (max-width: 768px) {
        .grid-container {
          grid-template-columns: 1fr;
        }

        .sidebar {
          width: 100%;
          padding: 10px;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-direction: row;
          z-index: 1000;
          border-right: none;
          border-bottom: 1px solid #E0E0E0;
          background-color: white;
          transition: all 0.3s ease;
        }

        .nav-menu ul {
          flex-direction: row;
          justify-content: space-around;
          padding: 0 10px;
          width: 100%;
        }

        .nav-menu li {
          flex: 1;
          text-align: center;
          padding: 10px 0;
          font-size: 14px;
        }

        .main-content {
          padding: 80px 10px 20px 10px;
        }

        .wallet-management {
          max-width: 100%;
        }
      }

      @media (max-width: 480px) {
        .sidebar {
          flex-direction: column;
          height: auto;
        }

        .wallet-management {
          flex-direction: column;
          align-items: flex-start;
        }

        .header {
          flex-direction: column;
          align-items: flex-start;
        }

        .wallet-summary {
          width: 100%;
        }

        .connect-button {
          width: 100%;
          justify-content: center;
        }
      }

      @media (max-width: 360px) {
        .sidebar {
          padding: 5px;
          height: 50px;
        }

        .wallet-input-container {
          flex-direction: column;
          gap: 5px;
        }
      }
    `}</style>
    </div>
  );
};

export default DashboardV3;
