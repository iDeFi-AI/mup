'use client';
import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faSignOutAlt, faBars, faTimes, faCog } from '@fortawesome/free-solid-svg-icons'; // Added faBars and faTimes for mobile sidebar
import Image from 'next/image';
import {
  connectWallet,
  disconnectWallet,
  syncWalletData,
} from '@/utilities/web3Utils';
import WalletSelectionModal from '@/components/wallets';
import {
  ShieldIcon,
  GraphIcon,
  KeyIcon,
  MoneyIcon,
  BalanceIcon,
  AdvisorIcon,
  PlusIcon,
  CopyIcon,
  LightningIcon,
  Alert,
  Robot,
  StarIcon,
  ContractIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FileUpload,
  Heal,
  Build,
  Scout,
  Mine,
  CheckList,
  Eye
} from '@/components/icons';
import SecurityCheck from './security/security-check';
import FinancialRoadmap from './planning/financial-roadmap';
import InvestmentSimulator from './planning/investment-simulator';
import VisualizeWallet from './metrics/visualize_wallet';
import CreateAgent from './agents/create-agent';
import ShareDashboardModal from './client-support/share-dashboard';
import UpgradePlanModal from './upgrade/UpgradePlanModal';
import AgentBoard from './agents/agent-board';
import AgentManager from './agents/agent-manager';
import Notifications from './alerts/notifications';
import DataUpload from '@/components/data-upload';
import SourceDestination from './security/source-destination';
import AIProfile from '@/components/AIProfile';

// Simulate fetching alerts from an API or database
const getAlerts = async () => {
  return new Promise<string[]>((resolve) => {
    setTimeout(() => {
      resolve([]); // Example alerts
    }, 1000);
  });
};

const tools = [
  { id: 1, name: 'SecurityCheck', label: 'Security Check', icon: ShieldIcon, active: true },
  { id: 2, name: 'FinancialRoadmap', label: 'Financial Roadmap', icon: GraphIcon, active: true },
  { id: 3, name: 'InvestmentSimulator', label: 'Investment Simulator', icon: MoneyIcon, active: true },
  { id: 4, name: 'VisualizeWallet', label: 'Visualize Wallet', icon: BalanceIcon, active: true },
  { id: 5, name: 'SourceDestination', label: 'Security Check V2', icon: ShieldIcon, active: true },
];

const sideMenuTools = [
  { id: 6, name: 'CreateAgent', label: 'Create Agent', icon: Robot, active: true },
  { id: 7, name: 'AgentBoard', label: 'Agent Board', icon: Robot, active: true },
  { id: 8, name: 'AgentManager', label: 'Agent Manager', icon: Robot, active: true },
  { id: 9, name: 'DataUpload', label: 'Dataset', icon: FileUpload, active: true }, // New Dataset Upload Tool
  { id: 10, name: 'ShareDashboardModal', label: 'Share with Client', icon: ContractIcon, active: true },
  { id: 11, name: 'UpgradePlanModal', label: 'Upgrade Plan', icon: LightningIcon, active: true },
  { id: 12, name: 'Notifications', label: 'Notifications', icon: faBell, active: true },
];

const categories = {
  ALL: tools.map((tool) => tool.name),
  MINE: ['FinancialRoadmap', 'InvestmentSimulator'],
  BUILD: ['VisualizeWallet'],
  DEFEND: ['SecurityCheck', 'SourceDestination'],
  SCOUT: ['ShareDashboardModal'],
  HEAL: ['ShareDashboardModal'],
};

// Sample agent data
const agents = [
  {
    name: 'iNFA #001',
    imageUrl: '/iNFA1.png',
    traits: { Mining: 75, Building: 60, Defending: 45, Scouting: 85, Healing: 55 },
  },
  {
    name: 'iNFA #002',
    imageUrl: '/iNFA2.png',
    traits: { Mining: 65, Building: 75, Defending: 60, Scouting: 50, Healing: 70 },
  },
];

const DashboardV3: React.FC = () => {
  const [connectedAccounts, setConnectedAccounts] = useState<{ account: string; provider: string }[]>([]);
  const [manualAddress, setManualAddress] = useState<string>('');
  const [mainAccount, setMainAccount] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [recents, setRecents] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filteredTools, setFilteredTools] = useState<string[]>(categories.ALL);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [recentsOpen, setRecentsOpen] = useState<boolean>(true);
  const [favoritesOpen, setFavoritesOpen] = useState<boolean>(true);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [createAgentDropdownOpen, setCreateAgentDropdownOpen] = useState<boolean>(false);
  const [activeAlerts, setActiveAlerts] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // Added state for sidebar toggle
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [showAgentManagementModal, setShowAgentManagementModal] = useState(false);
  const [selectedAgentIndex, setSelectedAgentIndex] = useState<number>(0); // Track selected agent
  const selectedAgent = agents[selectedAgentIndex]; // Get the currently selected agent

  useEffect(() => {
    if (connectedAccounts.length > 0) {
      syncWalletData(connectedAccounts.map((acc) => acc.account));
    }
  }, [connectedAccounts]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const alerts = await getAlerts();
      setActiveAlerts(alerts);
    };

    fetchAlerts();
  }, []);

    // Toggle agent management modal
    const toggleAgentManagementModal = () => {
      setShowAgentManagementModal(!showAgentManagementModal);
    };
  
    // Handler for minting a new agent
    const handleMintNewAgent = async (agentRole: string) => {
      try {
        const response = await fetch('/api/mint-agent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ agentRole }),
        });
        const result = await response.json();
    
        if (result.error) {
          alert(`Error minting agent: ${result.error}`);
        } else {
          alert(`Agent successfully minted! Image URL: ${result.image_url}`);
        }
      } catch (error) {
        console.error('Error minting agent:', error);
        alert('There was an error minting the agent. Please try again.');
      }
    };

  const handleConnectWallet = () => {
    setShowWalletModal(true);
  };

  const handleWalletSelect = async (provider: string) => {
    const accounts = await connectWallet(provider);
    if (accounts) {
      const uniqueAccounts = Array.from(
        new Set([...connectedAccounts, ...accounts.map((account: string) => ({ account, provider }))])
      );
      setConnectedAccounts(uniqueAccounts);
      setMainAccount(uniqueAccounts[0].account);
      setShowWalletModal(false);
    } else {
      alert('Failed to connect wallet. Please try again.');
    }
  };

  const handleDataSync = (data: any) => {
    setUploadedData(data);
  };


  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    window.location.href = '/';
  };

  const handleDisconnectWallet = (account: string) => {
    const updatedAccounts = connectedAccounts.filter((acc) => acc.account !== account);
    setConnectedAccounts(updatedAccounts);
    if (mainAccount === account) {
      setMainAccount(updatedAccounts.length > 0 ? updatedAccounts[0].account : null);
    }
    disconnectWallet();
  };

  const copyToClipboard = (account: string) => {
    navigator.clipboard.writeText(account);
    alert('Address copied to clipboard!');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleCreateAgentDropdown = () => {
    setCreateAgentDropdownOpen(!createAgentDropdownOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
    if (manualAddress && !connectedAccounts.some((acc) => acc.account === manualAddress)) {
      setConnectedAccounts((prevAccounts) => [...prevAccounts, { account: manualAddress, provider: 'Manual' }]);
      setMainAccount(manualAddress);
      setManualAddress('');
    } else {
      alert('This address is already added or invalid.');
    }
  };

  const handleFilterClick = (filter: keyof typeof categories) => {
    setFilteredTools(categories[filter]);
    setActiveCategory(filter);
    setActiveTool(null);
  };

  const handleToolClick = (tool: string) => {
    setShowNotifications(false);
    setActiveTool(tool);
    setRecents((prev) => [tool, ...prev.filter((item) => item !== tool)].slice(0, 5));
  };

  const toggleFavorite = (tool: string) => {
    setFavorites((prev) =>
      prev.includes(tool) ? prev.filter((item) => item !== tool) : [...prev, tool]
    );
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setActiveTool('Notifications');
  };

  const renderActiveTool = () => {
    if (showNotifications && activeTool === 'Notifications') {
      return <Notifications />;
    }

    const tool = tools.find((t) => t.name === activeTool);
    if (tool) {
      switch (tool.name) {
        case 'SecurityCheck':
          return <SecurityCheck />;
        case 'FinancialRoadmap':
          return <FinancialRoadmap />;
        case 'InvestmentSimulator':
          return <InvestmentSimulator />;
        case 'VisualizeWallet':
          return <VisualizeWallet />;
        case 'SourceDestination':
          return <SourceDestination />;
        default:
          return renderToolGrid();
      }
    }

    switch (activeTool) {
      case 'CreateAgent':
        return <CreateAgent />;
      case 'AgentBoard':
        return <AgentBoard />;
      case 'AgentManager':
        return <AgentManager />;
      case 'DataUpload': // Render DataUpload when Dataset is selected
        return <DataUpload />;
      case 'ShareDashboardModal':
        return <ShareDashboardModal />;
      case 'UpgradePlanModal':
        return <UpgradePlanModal />;
      case 'Notifications':
        return <Notifications />;
      default:
        return renderToolGrid();
    }
  };

  const renderToolGrid = () => (
    <div className="grid-container">
      {filteredTools.map((toolName) => {
        const tool = tools.find((t) => t.name === toolName);
        if (!tool) return null;

        return (
          <div
            key={tool.id}
            className={`grid-item ${tool.active ? '' : 'grayed-out'}`}
            onClick={() => tool.active && handleToolClick(tool.name)}
          >
            <div className="icon-placeholder">
              <tool.icon />
            </div>
            <p>{tool.label}</p>
            <span
              className={`star-icon ${favorites.includes(tool.name) ? 'favorited' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(tool.name);
              }}
            >
              {favorites.includes(tool.name) ? '★' : '☆'}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="dashboard-container">
      {showWalletModal && (
        <WalletSelectionModal onSelect={handleWalletSelect} onClose={() => setShowWalletModal(false)} />
      )}
      <button className="hamburger-button" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
      </button>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <div className="logo">
        <div className="profile-container">
        <div className="spline-container">
        <AIProfile selectedAgent={selectedAgentIndex} onAgentChange={setSelectedAgentIndex} />
        </div>
        </div>
      </div>
        <nav className="nav-menu">
          <ul>
            <li className={activeTool === null ? 'active' : ''} onClick={() => setActiveTool(null)}>
              <AdvisorIcon /> Agent Dash
            </li>
  
            <li onClick={() => setRecentsOpen(!recentsOpen)}>
              <GraphIcon /> Recents {recentsOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </li>
            {recentsOpen && recents.length > 0 && (
              <ul className="sub-menu">
                {recents.map((tool) => (
                  <li key={tool} onClick={() => handleToolClick(tool)}>
                    {tools.find((t) => t.name === tool)?.label || tool}
                  </li>
                ))}
              </ul>
            )}
  
            <li onClick={() => setFavoritesOpen(!favoritesOpen)}>
              <StarIcon /> Favorites {favoritesOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </li>
            {favoritesOpen && favorites.length > 0 && (
              <ul className="sub-menu">
                {favorites.map((tool) => (
                  <li key={tool} onClick={() => handleToolClick(tool)}>
                    {tools.find((t) => t.name === tool)?.label || tool}
                  </li>
                ))}
              </ul>
            )}
  
            {/* Create Agent button with dropdown */}
            <li onClick={toggleCreateAgentDropdown}>
              <Robot /> Agent Tools {createAgentDropdownOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </li>
            {createAgentDropdownOpen && (
              <ul className="sub-menu">
                <li onClick={() => handleToolClick('CreateAgent')}>
                  <PlusIcon />Create</li>
                <li onClick={() => handleToolClick('DataUpload')}>
                  <FileUpload />Upload</li>
                <li onClick={() => handleToolClick('AgentBoard')}>
                  <Eye />Monitor </li>
                <li onClick={() => handleToolClick('AgentManager')}>
                  <CheckList />Manage</li>
                 {/* Notifications Bell */}
                <li className="notification-item" onClick={handleNotificationClick}>
                  <FontAwesomeIcon icon={faBell} className={activeAlerts.length > 0 ? 'alert-active' : ''} />
                  <span>Alerts</span>
                  {activeAlerts.length > 0 && <span className="notification-count">{activeAlerts.length}</span>}
                </li>
              </ul>
            )}
  
           

            {/* Share with Client */}
            <li onClick={() => handleToolClick('ShareDashboardModal')}>
              <ContractIcon /> Share with Client
            </li>
  
            {/* Upgrade Plan */}
            <li onClick={() => handleToolClick('UpgradePlanModal')}>
              <LightningIcon /> Upgrade Plan
            </li>
          </ul>
  
          {/* Logout Button */}
          <ul>
            <li className="logout-button" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
            </li>
          </ul>
          <div className="beta-notice">
          <Alert /> This is a Beta version of our Demo. Please be aware that some features and tools may be limited.
        </div>
        </nav>
      </div>
  
      <div className="main-content bg-background-color">
        <div className="header">
          <div className="agent-wallet-container">
            {/* Agent Display Section */}
            <div className="agent-display">
              {/* Agent Select Dropdown */}
              <div className="agent-select">
                <label htmlFor="agentDropdown">Select Agent:</label>
                <select
                  id="agentDropdown"
                  value={selectedAgentIndex}
                  onChange={(e) => setSelectedAgentIndex(Number(e.target.value))}
                  className="agent-dropdown"
                  >
                  {agents.map((agent, index) => (
                    <option key={index} value={index}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Agent Card */}
              <div className="agent-card">
                <img src={selectedAgent.imageUrl} alt={selectedAgent.name} className="agent-image" />
                <div className="agent-info">
                  <div className="traits">
                    {Object.entries(selectedAgent.traits).map(([trait, level]) => (
                      <div key={trait} className="trait">
                        <span className="trait-icon">{getTraitIcon(trait)}</span>
                        <span className="trait-name">{trait}</span>
                        <div className="progress-bar">
                          <div
                            className="progress"
                            style={{ width: `${level}%`, backgroundColor: getTraitColor(trait) }}
                          >
                            {level}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Wallet Management Section */}
            <div className="wallet-management">
              <h2>Wallet Management</h2>
              <div className="wallet-summary" onClick={toggleDropdown}>
                <span>{mainAccount ? shortenAddress(mainAccount) : 'No Wallet Connected'}</span>
                <span>{showDropdown ? '▲' : '▼'}</span>
              </div>
              {showDropdown && (
                <div className="wallet-dropdown">
                  {connectedAccounts.map(({ account, provider }, index) => (
                    <div key={index} className="wallet-info" onClick={() => setMainAccount(account)}>
                      <Image
                        src={
                          provider === 'MetaMask'
                            ? '/metamask-logo.png'
                            : provider === 'Coinbase'
                            ? '/coinbase-logo.png'
                            : '/mainlogo.png'
                        }
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
              <div className="wallet-input-container">
                <input
                  type="text"
                  className="wallet-input"
                  value={manualAddress}
                  placeholder="Enter Wallet Address..."
                  onChange={handleManualInput}
                />
                <button onClick={addManualAddress} className="add-button">
                  <PlusIcon style={{ marginRight: '8px' }} />
                  Add
                </button>
              </div>
            </div>
          </div>
          {/* Filters */}
          <div className="filter-buttons">
            <button
              className={`filter-button ${activeCategory === 'ALL' ? 'active' : ''}`}
              onClick={() => handleFilterClick('ALL')}
            > <StarIcon style={{ marginRight: '8px' }} />
              ALL
            </button>
            <button
              className={`filter-button ${activeCategory === 'MINE' ? 'active' : ''}`}
              onClick={() => handleFilterClick('MINE')}
            > <Mine style={{ marginRight: '8px' }} />
              Mining
            </button>
            <button
              className={`filter-button ${activeCategory === 'BUILD' ? 'active' : ''}`}
              onClick={() => handleFilterClick('BUILD')}
            > <Build style={{ marginRight: '8px' }} />
              Building
            </button>
            <button
              className={`filter-button ${activeCategory === 'DEFEND' ? 'active' : ''}`}
              onClick={() => handleFilterClick('DEFEND')}
            > <ShieldIcon style={{ marginRight: '8px' }} />
              Defending
            </button>
            <button
              className={`filter-button ${activeCategory === 'SCOUT' ? 'active' : ''}`}
              onClick={() => handleFilterClick('SCOUT')}
            > <Scout style={{ marginRight: '8px' }} />
              Scouting
            </button>
            <button
              className={`filter-button ${activeCategory === 'HEAL' ? 'active' : ''}`}
              onClick={() => handleFilterClick('HEAL')}
            > <Heal style={{ marginRight: '8px' }} />
              Healing
            </button>
          </div>
        </div>
  
        {/* Active Tool Rendering */}
        {renderActiveTool()}
      </div>

      <style jsx>{`
        .dashboard-container {
          display: flex;
          height: 100vh;
          background-color: #f8f9fa;
          overflow: hidden;
          z-index: 1; /* Lower priority */
        }

        .profile-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
          z-index: 1002;
        }

        .spline-container {
          z-index: 1003; /* Set a higher z-index than the sidebar */
        }

        .gear-icon {
          position: absolute;
          top: -10px; /* Moves it slightly above the profile image */
          right: -10px; /* Aligns the icon to the right of the profile image */
          background-color: white;
          border: 2px solid #e0e0e0;
          border-radius: 50%;
          padding: 5px;
          font-size: 18px;
          color: #333;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: background-color 0.3s, transform 0.3s;
        }
        
         .gear-icon:hover {
          color: #ff7e2f;
          transform: scale(1.1); /* Slightly enlarges the icon on hover for visual feedback */

        }

        .hamburger-button {
          position: fixed;
          top: 37px;
          left: 23px;
          z-index: 1002;
          background-color: transparent;
          border: none;
          color: #333;
          font-size: 24px;
          cursor: pointer;
          display: none;
        }

        .sidebar {
          width: 250px;
          background-color: white;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          border-right: 1px solid #E0E0E0;
          overflow-y: auto;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .sidebar.open {
          left: 0;
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

        .main-content {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          transition: all 0.3s ease;
          z-index: auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 30px;
        }

        .agent-select {
          margin-right: 100px;
        }

        .agent-select label {
          font-size: 1rem;
          color: #000;
          margin-bottom: 8px;
          margin-right: 10px;
        }

        .agent-dropdown {
          padding: 5px;
          font-size: 1rem;
          border-radius: 5px;
          border: 1px solid #ccc;
          background-color: #333;
          color: #fff;
          width: 100%;
          max-width: 200px;
        }

        .agent-wallet-container {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          width: 100%;
        }

        .agent-display {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 12px;
          flex: 1;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }

        .agent-info h3 {
          font-size: 1.1em;
          font-weight: bold;
          text-align: center;
          margin: 0;
          color: #333;
        }

        .trait {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }

        .trait-icon {
          width: 24px;
          font-size: 1.2em;
          margin-right: 10px;
        }

        .trait-name {
          font-weight: bold;
          flex-shrink: 0;
          margin-right: 10px;
        }

        .progress-bar {
          flex: 1;
          background-color: #000;
          border-radius: 10px;
          overflow: hidden;
          height: 14px;
          max-width: 600px;
          min-width: 400px;
        }

        .progress {
          height: 100%;
          color: white;
          text-align: right;
          padding-right: 5px;
          border-radius: 5px;
          font-size: 10px;
        }

        .wallet-management {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 12px;
          flex: 1;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }

        .agent-display h2,
        .wallet-management h2 {
          margin-bottom: 10px;
        }

        .agent-card {
          display: flex;
          align-items: center;
          gap: 20px;
          background-color: #ffffff;
          border-radius: 12px;
          padding: 20px;
        }

        .agent-image {
          width: 100px;
          height: 100px;
          margin-left: 25px;
          margin-right: 20px;
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
          padding: 8px 0;
        }

        .wallet-address {
          font-size: 14px;
          color: #333;
          flex: 1;
        }

        .copy-button,
        .disconnect-button {
          background-color: #FF7E2F;
          color: white;
          padding: 5px 10px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 12px;
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
          width: 100%;
          justify-content: center;
          margin-top: 20px;
        }

        .wallet-input-container {
          display: flex;
          gap: 10px;
          width: 100%;
          margin-top: 10px;
          padding: 20px 20px;
          justify-content: center;
          align-items: center;
        }

        .wallet-input {
          flex: 3; /* 75% of the container width */
          padding: 10px;
          border: 1px solid #E0E0E0;
          border-radius: 8px;
          font-size: 16px;
        }

        .add-button {
          flex: 1; /* 25% of the container width */
          background-color: #007bff;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 30px;
        }

        .filter-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          width: 100%;
          margin-top: 30px;
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

        .notification-item {
          display: flex;
          align-items: center; 
          justify-content: flex-start;
          gap: 10px;
          padding: 15px 20px;
          font-size: 16px;
          color: #757575;
          cursor: pointer;
          border-radius: 8px;
          transition: background-color 0.3s, color 0.3s;
          position: relative;
        }

        .notification-item:hover {
          color: #FF7E2F;
          background-color: #f2f2f2;
        }

        .notification-count {
          background-color: red;
          color: white;
          border-radius: 50%;
          padding: 3px 7px;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 20px;
          margin-left: 10px;
        }

        .alert-active {
          color: red;
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

        @media (max-width: 1800px) {
          .agent-image {
            width: 100px;
            height: 100px;
            margin-left: 15px;
            margin-right: 10px;
          }

         .progress-bar {
            flex: 1;
            background-color: #000;
            border-radius: 10px;
            overflow: hidden;
            height: 14px;
            max-width: 200px;
            min-width: 175px;
          }
          .progress {
            height: 100%;
            color: white;
            text-align: right;
            padding-right: 5px;
            border-radius: 5px;
            font-size: 10px;
          }
         }
        
        @media (max-width: 1400px) {
          .agent-image {
            width: 100px;
            height: 100px;
            margin-left: 15px;
            margin-right: 10px;
          }

         .progress-bar {
            flex: 1;
            background-color: #000;
            border-radius: 10px;
            overflow: hidden;
            height: 14px;
            max-width: 200px;
            min-width: 175px;
          }
          .progress {
            height: 100%;
            color: white;
            text-align: right;
            padding-right: 5px;
            border-radius: 5px;
            font-size: 10px;
          }
         }

        @media (max-width: 1300px) {
          .grid-container {
            grid-template-columns: repeat(3, 1fr);
          }

          .agent-image {
            width: 100px;
            height: 100px;
            margin-left: 10px;
            margin-right: 5px;
          }

          .progress-bar {
            flex: 1;
            background-color: #000;
            border-radius: 10px;
            overflow: hidden;
            height: 14px;
            max-width: 150px;
            min-width: 100px;
          }

          .progress {
            height: 100%;
            color: white;
            text-align: right;
            padding-right: 5px;
            border-radius: 5px;
            font-size: 10px;
          }
        }

        @media (max-width: 1024px) {
          .grid-container {
            grid-template-columns: repeat(2, 1fr);
          }

          .sidebar {
            width: 200px;
          }
          .agent-image {
            width: 100px;
            height: 100px;
            margin-left: 5px;
            margin-right: 2.5px;
          }

          .progress-bar {
            flex: 1;
            background-color: #000;
            border-radius: 10px;
            overflow: hidden;
            height: 14px;
            max-width: 75px;
            min-width: 50px;
          }

          .progress {
            height: 100%;
            color: white;
            text-align: right;
            padding-right: 5px;
            border-radius: 5px;
            font-size: 10px;
          }
        }

        @media (max-width: 975px) {
        .grid-container {
            grid-template-columns: 1fr;
          }

          .hamburger-button {
            display: block;
          }

          .sidebar {
            width: 240px;
            position: fixed;
            top: 0;
            bottom: 0;
            left: -100%;
            transition: left 0.3s ease;
          }

          .sidebar.open {
            left: 0;
          }

          .main-content {
            padding: 20px 10px 20px 10px;
          }

          .agent-display,
          .wallet-management {
              max-width: 100%;
            }

          .wallet-summary {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background-color: #f2f2f2;
            border-radius: 8px;
            cursor: pointer;
            width: 100%;
            margin-bottom: 20px;
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
          width: 100%;
        }

        .connect-button,
        .add-button {
          background-color: #FF7E2F;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wallet-input-container {
          display: flex;
          gap: 10px;
          width: 100%;
          margin-top: 10px;
        }

        .wallet-input {
          flex: 3;
          padding: 10px;
          border: 1px solid #E0E0E0;
          border-radius: 8px;
          font-size: 16px;
        }

        /* Agent Display Styles */
        .agent-card {
        background-color: #ffffff;
        border-radius: 12px;
        padding: 20px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

        .agent-image {
          width: 100px;
          height: 100px;
        }

        .agent-info h3 {
          font-size: 1.1em;
          font-weight: bold;
          text-align: center;
          margin: 0;
          color: #333;
        }

        .traits {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .trait {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .progress-bar {
          flex: 1;
          background-color: #000;
          border-radius: 10px;
          overflow: hidden;
          height: 15px;
          margin-left: 15px;
          width: 100px;
        }

        .progress {
          height: 100%;
          color: white;
          text-align: right;
          padding-right: 5px;
          border-radius: 5px;
          font-size: 10px;
        }

        /* Filter buttons */
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
       }

        @media (max-width: 768px) {
          .grid-container {
            grid-template-columns: 1fr;
          }

          .hamburger-button {
            display: block;
          }

          .sidebar {
            width: 240px;
            position: fixed;
            top: 0;
            bottom: 0;
            left: -100%;
            transition: left 0.3s ease;
            z-index: 999;

          }

          .sidebar.open {
            left: 0;
            z-index: 999;
          }

          .main-content {
            padding: 20px 10px 20px 10px;
            z-index: auto; 
          }

          .agent-display,
          .wallet-management {
              max-width: 100%;
            }

          .wallet-summary {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background-color: #f2f2f2;
            border-radius: 8px;
            cursor: pointer;
            width: 100%;
            margin-bottom: 20px;
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
          width: 100%;
        }

        .connect-button,
        .add-button {
          background-color: #FF7E2F;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wallet-input-container {
          display: flex;
          gap: 10px;
          width: 100%;
          margin-top: 10px;
        }

        .wallet-input {
          flex: 3;
          padding: 10px;
          border: 1px solid #E0E0E0;
          border-radius: 8px;
          font-size: 16px;
        }

        /* Agent Display Styles */
        .agent-card {
        background-color: #ffffff;
        border-radius: 12px;
        padding: 20px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

        .agent-image {
          width: 100px;
          height: 100px;
        }

        .agent-info h3 {
          font-size: 1.1em;
          font-weight: bold;
          text-align: center;
          margin: 0;
          color: #333;
        }

        .traits {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .trait {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .progress-bar {
          flex: 1;
          background-color: #000;
          border-radius: 10px;
          overflow: hidden;
          height: 15px;
          margin-left: 15px;
          width: 100px;
        }

        .progress {
          height: 100%;
          color: white;
          text-align: right;
          padding-right: 5px;
          border-radius: 5px;
          font-size: 10px;
        }

        /* Filter buttons */
        .filter-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          width: 100%;
          margin-top: 30px;
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
        }

        @media (max-width: 480px) {
          .nav-menu ul {
            flex-wrap: wrap;
            justify-content: space-evenly;
          }

          .nav-menu li {
            flex: 1 0 100%;
            text-align: center;
            padding: 8px 0;
          }

          .sidebar {
            flex-direction: column;
            height: auto;
          }

          .agent-display h2,
          .wallet-management h2 {
            font-size: 1.2em;
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
          .agent-image {
            width: 100px;
            height: 100px;
          }

        .progress-bar {
          flex: 1;
          background-color: #000;
          border-radius: 10px;
          overflow: hidden;
          height: 15px;
          margin-left: 15px;
          width: 100px;
        }

        .progress {
          height: 100%;
          color: white;
          text-align: right;
          padding-right: 5px;
          border-radius: 5px;
          font-size: 10px;
        }
        }

        @media (max-width: 360px) {
          .nav-menu ul {
            flex-wrap: wrap;
            justify-content: space-evenly;
          }

          .nav-menu li {
            flex: 1 0 100%;
            text-align: center;
            padding: 8px 0;
          }

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
      `}</style>
    </div>
  );
};

const getTraitIcon = (trait: string) => {
  switch (trait) {
    case 'Mining': return '⛏️';
    case 'Building': return '🏗️';
    case 'Defending': return '🛡️';
    case 'Scouting': return '🔍';
    case 'Healing': return '➕';
    default: return '';
  }
};

const getTraitColor = (trait: string) => {
  switch (trait) {
    case 'Mining': return '#FF7300';
    case 'Building': return '#BF52B4';
    case 'Defending': return '#55D0FF';
    case 'Scouting': return '#FFE600';
    case 'Healing': return '#45DC6F';
    default: return '#C8C8D9';
  }
};

export default DashboardV3;
