'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faSignOutAlt, faBars, faTimes, faCog } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

// Web3 wallet utilities
import { connectWallet, disconnectWallet, syncWalletData } from '@/utilities/web3Utils';

// Modal & component imports
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
  Health,
  Build,
  Scout,
  Mine,
  CheckList,
  Eye,
  DiscordIcon,
  InstagramIcon,
  TwitterIcon,
  WarpcastIcon,
  LinkedInIcon,
  Logistics,
  Gaming,
  Supply,
  PublicService,
  Education,
  SocialMedia,
  Squad,
  Syndicate,
  Shop,
  History,
  Financial,
} from '@/components/icons';
import SecurityCheck from './security/security-check';
import FinancialRoadmap from './finance-services/financial-roadmap';
import InvestmentSimulator from './finance-services/investment-simulator';
import VisualizeWallet from './finance-services/visualize_wallet';
import CreateAgent from './agents/create-agent';
import ShareDashboardModal from './client-support/share-dashboard';
import UpgradePlanModal from './upgrade/UpgradePlanModal';
import AgentBoard from './agents/agent-board';
import AgentManager from './agents/agent-manager';
import Notifications from './alerts/notifications';
import DataUpload from '@/components/data-upload';
import SourceDestination from './security/source-destination';
import AIProfile from '@/components/AIProfile';
import DiscordPage from './social-media/discord';
import XTwitterPage from './social-media/x-twitter';
import LinkedInPage from './social-media/linkedin';
import WarpcastPage from './social-media/warpcast';
import InstagramPage from './social-media/instagram';
import HealthcareOverview from './healthcare/overviewpage';
import HealthcareDiagnostics from './healthcare/diagnosticspage';
import HealthcareDataManagement from './healthcare/datapage';
import PublicServicesAnalytics from './public-services/public-analytics';
import PublicServicesEngagement from './public-services/public-engagement';
import PublicServicesOverview from './public-services/public-overview';
// ------------------------------------------------------------------
// Simulated API call to fetch alerts
// ------------------------------------------------------------------
const getAlerts = async (): Promise<string[]> => {
  return new Promise((resolve) => setTimeout(() => resolve([]), 1000));
};

// ------------------------------------------------------------------
// Existing Tool Configuration
// ------------------------------------------------------------------
const tools = [
  { id: 1, name: 'SecurityCheck', label: 'Security Check', icon: ShieldIcon, active: true },
  { id: 2, name: 'FinancialRoadmap', label: 'Financial Roadmap', icon: GraphIcon, active: true },
  { id: 3, name: 'InvestmentSimulator', label: 'Investment Simulator', icon: MoneyIcon, active: true },
  { id: 4, name: 'VisualizeWallet', label: 'Visualize Wallet', icon: BalanceIcon, active: true },
  { id: 5, name: 'SourceDestination', label: 'Security Check V2', icon: ShieldIcon, active: true },
  { id: 6, name: 'DiscordPage', label: 'Discord Portal', icon: DiscordIcon, active: true },
  { id: 7, name: 'XTwitterPage', label: 'XTwitter Portal', icon: TwitterIcon, active: true },
  { id: 8, name: 'LinkedInPage', label: 'Linkedin Portal', icon: LinkedInIcon, active: true },
  { id: 9, name: 'WarpcastPage', label: 'Warpcast Portal', icon: WarpcastIcon, active: true },
  { id: 10, name: 'InstagramPage', label: 'Instagram Portal', icon: InstagramIcon, active: true },
  { id: 11, name: 'HealthcareOverview', label: 'Healthcare Clinic', icon: Health, active: true },
  { id: 12, name: 'HealthcareDiagnostics', label: 'Healthcare Diag', icon: Health, active: true },
  { id: 13, name: 'HealthcareDataManagement', label: 'Healthcare Data', icon: Health, active: true },
  { id: 14, name: 'PublicServicesAnalytics', label: 'Public Analytics', icon: PublicService, active: true },
  { id: 15, name: 'PublicServicesEngagement', label: 'Public Engagement', icon: PublicService, active: true },
  { id: 16, name: 'PublicServicesOverview', label: 'Public Overview', icon: PublicService, active: true },

];

const sideMenuTools = [
  { id: 17, name: 'CreateAgent', label: 'Create Agent', icon: Robot, active: true },
  { id: 18, name: 'AgentBoard', label: 'Agent Board', icon: Robot, active: true },
  { id: 19, name: 'AgentManager', label: 'Agent Manager', icon: Robot, active: true },
  { id: 20, name: 'DataUpload', label: 'Dataset', icon: FileUpload, active: true },
  { id: 21, name: 'ShareDashboardModal', label: 'Share with Client', icon: ContractIcon, active: true },
  { id: 22, name: 'UpgradePlanModal', label: 'Upgrade Plan', icon: LightningIcon, active: true },
  { id: 23, name: 'Notifications', label: 'Notifications', icon: faBell, active: true },
];

const categories = {
  ALL: tools.map((tool) => tool.name),
  MINE: ['FinancialRoadmap', 'InvestmentSimulator'],
  BUILD: ['VisualizeWallet'],
  DEFEND: ['SecurityCheck', 'SourceDestination'],
  SCOUT: ['ShareDashboardModal'],
  HEAL: ['ShareDashboardModal'],
};

// ------------------------------------------------------------------
// New Industry & Integration Sections
// ------------------------------------------------------------------
const industries = [
  {
    id: 101,
    name: 'FinancialServices',
    label: 'Financial',
    icon: Financial,
    modules: [
      { id: 'financial-roadmap', label: 'Financial Roadmap' },
      { id: 'investment-simulator', label: 'Investment Simulator' },
      { id: 'visualize-wallet', label: 'Visualize Wallet' },
    ],
  },
  {
    id: 102,
    name: 'Healthcare',
    label: 'Healthcare',
    icon: Health,
    modules: [
      { id: 'overviewpage', label: 'Healthcare Clinic' },
      { id: 'diagnosticspage', label: 'Healthcare Diag' },
      { id: 'datapage', label: 'Healthcare Data' },
    ],
  },
  {
    id: 103,
    name: 'Logistics',
    label: 'Logistics',
    icon: Logistics,
  },
  {
    id: 104,
    name: 'Supply Chain',
    label: 'Supply Chain',
    icon: Supply,
  },
  {
    id: 105,
    name: 'Social Media',
    label: 'Social Media',
    icon: SocialMedia,
    modules: [
      { id: 'discord', label: 'Discord' },
      { id: 'xtwitter', label: 'X-Twitter' },
      { id: 'linkedin', label: 'Linkedin' },
      { id: 'instagram', label: 'Instagram' },
      { id: 'warpcast', label: 'Warpcast' },
    ],
  },
  {
    id: 106,
    name: 'Gaming',
    label: 'Gaming',
    icon: Gaming,
  },
  {
    id: 107,
    name: 'Education',
    label: 'Education',
    icon: Education,
  },
  {
    id: 108,
    name: 'Public Services',
    label: 'Public Services',
    icon: KeyIcon,
  },
];

const integrations = [
  { id: 201, name: 'APIProviders', label: 'API Providers', icon: PlusIcon },
  { id: 202, name: 'Marketplace', label: 'Marketplace', icon: Shop },
  { id: 203, name: 'Analytics', label: 'Analytics', icon: GraphIcon },
  { id: 204, name: 'Squads', label: 'Squads', icon: Squad },
  { id: 205, name: 'Syndicates', label: 'Syndicates', icon: Syndicate },
  { id: 206, name: 'Upgrades', label: 'Upgrades', icon: LightningIcon },
];

// ------------------------------------------------------------------
// Sample Agent Data
// ------------------------------------------------------------------
const agents = [
  {
    name: 'iNFAgent #001',
    imageUrl: '/iNFA1.png',
    traits: { Mining: 75, Building: 60, Defending: 45, Scouting: 85, Healing: 55 },
    tokens: { amount: 100 },
    energy: { level: 80 },
  },
  {
    name: 'iNFAgent #002',
    imageUrl: '/iNFA2.png',
    traits: { Mining: 65, Building: 75, Defending: 60, Scouting: 50, Healing: 70 },
    tokens: { amount: 150 },
    energy: { level: 70 },
  },
];

// ------------------------------------------------------------------
// Main Dashboard Component
// ------------------------------------------------------------------
const DashboardV3: React.FC = () => {
  // Connection and wallet state
  const [connectedAccounts, setConnectedAccounts] = useState<{ account: string; provider: string }[]>([]);
  const [manualAddress, setManualAddress] = useState('');
  const [mainAccount, setMainAccount] = useState<string | null>(null);

  // Tool and UI state
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [recents, setRecents] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filteredTools, setFilteredTools] = useState<string[]>(categories.ALL);
  const [activeCategory, setActiveCategory] = useState('ALL');

  // Industry module selection states
  const [selectedFSModule, setSelectedFSModule] = useState<string | null>(null);
  const [selectedGamingModule, setSelectedGamingModule] = useState<string | null>(null);
  const [selectedHealthCareModule, setSelectedHealthCareModule] = useState<string | null>(null);
  const [selectedPublicServicesModule, setSelectedPublicServicesModule] = useState<string | null>(null);
  const [selectedSupplyChainModule, setSelectedSupplyChainModule] = useState<string | null>(null);
  const [selectedLogisticsModule, setSelectedLogisticsModule] = useState<string | null>(null);
  const [selectedEducationModule, setSelectedEducationModule] = useState<string | null>(null);
  const [selectedSocialMediaModule, setSelectedSocialMediaModule] = useState<string | null>(null);

  // UI toggles
  const [recentsOpen, setRecentsOpen] = useState(true);
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [createAgentDropdownOpen, setCreateAgentDropdownOpen] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [showAgentManagementModal, setShowAgentManagementModal] = useState(false);
  const [selectedAgentIndex, setSelectedAgentIndex] = useState(0);
  const selectedAgent = agents[selectedAgentIndex];

  // Clear industry module selections when switching industries
  useEffect(() => {
    if (activeTool !== 'FinancialServices') setSelectedFSModule(null);
    if (activeTool !== 'Social Media') setSelectedLogisticsModule(null);
    if (activeTool !== 'Healthcare') setSelectedHealthCareModule(null);
    if (activeTool !== 'Education') setSelectedEducationModule(null);
    if (activeTool !== 'Logistics') setSelectedLogisticsModule(null);
    if (activeTool !== 'Public Services') setSelectedPublicServicesModule(null);
    if (activeTool !== 'Supply Chain') setSelectedSupplyChainModule(null);

  }, [activeTool]);

  // ------------------------------------------------------------------
  // Side Effects
  // ------------------------------------------------------------------
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

  // ------------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------------
  const toggleAgentManagementModal = useCallback(() => {
    setShowAgentManagementModal((prev) => !prev);
  }, []);

  const handleMintNewAgent = async (agentRole: string) => {
    try {
      const response = await fetch('/api/mint-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentRole }),
      });
      const result = await response.json();
      if (result.error) {
        alert(`Error minting agent: ${result.error}`);
      } else {
        alert(`Agent minted! Image URL: ${result.image_url}`);
      }
    } catch (error) {
      console.error('Error minting agent:', error);
      alert('Error minting agent. Please try again.');
    }
  };

  const handleConnectWallet = useCallback(() => {
    setShowWalletModal(true);
  }, []);

  const handleWalletSelect = async (provider: string) => {
    const accounts = await connectWallet(provider);
    if (accounts) {
      const existingAccounts = connectedAccounts.map((acc) => JSON.stringify(acc));
      const newAccounts = accounts.map((acc: string) => JSON.stringify({ account: acc, provider }));
      const uniqueAccounts = Array.from(new Set([...existingAccounts, ...newAccounts])).map((s) => JSON.parse(s));
      setConnectedAccounts(uniqueAccounts);
      setMainAccount(uniqueAccounts[0].account);
      setShowWalletModal(false);
    } else {
      alert('Failed to connect wallet. Please try again.');
    }
  };

  const handleDataSync = (data: any) => setUploadedData(data);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    window.location.href = '/';
  };

  const handleDisconnectWallet = useCallback(
    (account: string) => {
      const updatedAccounts = connectedAccounts.filter((acc) => acc.account !== account);
      setConnectedAccounts(updatedAccounts);
      if (mainAccount === account) {
        setMainAccount(updatedAccounts.length ? updatedAccounts[0].account : null);
      }
      disconnectWallet();
    },
    [connectedAccounts, mainAccount]
  );

  const copyToClipboard = useCallback((account: string) => {
    navigator.clipboard.writeText(account);
    alert('Address copied to clipboard!');
  }, []);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  const toggleCreateAgentDropdown = () => setCreateAgentDropdownOpen((prev) => !prev);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

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
      setConnectedAccounts((prev) => [...prev, { account: manualAddress, provider: 'Manual' }]);
      setMainAccount(manualAddress);
      setManualAddress('');
    } else {
      alert('Address already added or invalid.');
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
    // Clear industry module selections when switching away from an industry
    if (tool !== 'FinancialServices') {
      setSelectedFSModule(null);
    }
    if (tool !== 'Social Media') {
      setSelectedSocialMediaModule(null);
    }
    setRecents((prev) => [tool, ...prev.filter((item) => item !== tool)].slice(0, 5));
  };

  const toggleFavorite = (tool: string) => {
    setFavorites((prev) =>
      prev.includes(tool) ? prev.filter((item) => item !== tool) : [...prev, tool]
    );
  };

  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
    setActiveTool('Notifications');
  };

  // ------------------------------------------------------------------
  // Industry Module Render Helpers
  // ------------------------------------------------------------------
  const renderFinancialServicesModule = (module: string) => {
    switch (module) {
      case 'financial-health':
        return (
          <div>
            <h2>Financial Health</h2>
            <p>Financial Health Module</p>
          </div>
        );
      case 'financial-roadmap':
        return <FinancialRoadmap />;
      case 'investment-simulator':
        return <InvestmentSimulator />;
      case 'performance-tracker':
        return (
          <div>
            <h2>Performance Tracker</h2>
            <p>Performance Tracker Module</p>
          </div>
        );
      case 'retirement-planning':
        return (
          <div>
            <h2>Retirement Planning</h2>
            <p>Retirement Planning Module</p>
          </div>
        );
      case 'visualize-wallet':
        return <VisualizeWallet />;
      default:
        return (
          <div>
            <h2>Financial Services Dashboard</h2>
            <p>Select a module from above</p>
          </div>
        );
    }
  };

  const renderSocialMediaModule = (module: string) => {
    switch (module) {
      case 'discord':
        return <DiscordPage />;
      case 'xtwitter':
        return <XTwitterPage />;
      case 'linkedin':
        return <LinkedInPage />;
      case 'warpcast':
        return <WarpcastPage />;
      case 'instagram':
        return <InstagramPage />;
      default:
        return <p>Select a gaming module from the grid.</p>;
    }
  };

  const renderHealthCareModule = (module: string) => {
    switch (module) {
      case 'overviewpage':
        return <HealthcareOverview />;
      case 'diagnosticspage':
        return <HealthcareDiagnostics />;
      case 'datapage':
        return <HealthcareDataManagement />;
      default:
        return <p>Select a gaming module from the grid.</p>;
    }
  };

  const renderIndustryGrid = (
    industryName: string,
    modules: { id: string; label: string }[],
    onSelect: (id: string) => void
  ) => (
    <div className="industry-active-container">
      <div className="grid-container">
        {modules.map((mod) => (
          <div key={mod.id} className="grid-item" onClick={() => onSelect(mod.id)}>
            <p>{mod.label}</p>
          </div>
        ))}
      </div>
    </div>
  );

  
// Main function to render the active industry's modules
const renderActiveIndustry = () => {
  if (activeTool === 'FinancialServices') {
    const fsModules = industries.find((ind) => ind.name === 'FinancialServices')?.modules ?? [];
    return selectedFSModule
      ? renderFinancialServicesModule(selectedFSModule)
      : renderIndustryGrid('Financial Services', fsModules, setSelectedFSModule);
  } else if (activeTool === 'Social Media') {
    const SocialMediaModules = industries.find((ind) => ind.name === 'Social Media')?.modules ?? [];
    return selectedSocialMediaModule
      ? renderSocialMediaModule(selectedSocialMediaModule)
      : renderIndustryGrid('Social Media', SocialMediaModules, setSelectedSocialMediaModule);
  } else if (activeTool === 'Healthcare') {
    const hcModules = industries.find((ind) => ind.name === 'Healthcare')?.modules ?? [];
    return selectedHealthCareModule
      ? renderHealthCareModule(selectedHealthCareModule)
      : renderIndustryGrid('Healthcare', hcModules, setSelectedHealthCareModule);
  }
  return <p>Select an industry or tool from the sidebar.</p>;
};

  // ------------------------------------------------------------------
  // Helper: Render Tool Grid for non-industry tools
  // ------------------------------------------------------------------
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

  // ------------------------------------------------------------------
  // Main Render: Active Tool / Section Rendering
  // ------------------------------------------------------------------
  const renderActiveTool = () => {
    if (showNotifications && activeTool === 'Notifications') return <Notifications />;
    const tool = tools.find((t) => t.name === activeTool);
    if (tool) {
      switch (tool.name) {
        case 'SecurityCheck': return <SecurityCheck />;
        case 'FinancialRoadmap': return <FinancialRoadmap />;
        case 'InvestmentSimulator': return <InvestmentSimulator />;
        case 'VisualizeWallet': return <VisualizeWallet />;
        case 'SourceDestination': return <SourceDestination />;
        case 'DiscordPage': return <DiscordPage />;
        case 'XTwitterPage': return <XTwitterPage />;
        case 'LinkedInPage': return <LinkedInPage />;
        case 'InstagramPage': return <InstagramPage />;
        default: return renderToolGrid();
      }
    }
    switch (activeTool) {
      case 'CreateAgent': return <CreateAgent />;
      case 'AgentBoard': return <AgentBoard />;
      case 'AgentManager': return <AgentManager />;
      case 'DataUpload': return <DataUpload />;
      case 'ShareDashboardModal': return <ShareDashboardModal />;
      case 'UpgradePlanModal': return <UpgradePlanModal />;
      // Industries
      case 'FinancialServices': return renderActiveIndustry();
      case 'Social Media': return renderActiveIndustry();
      case 'Healthcare': return  renderActiveIndustry();
      case 'Logistics': return renderActiveIndustry();
      case 'Education': return renderActiveIndustry();
      case 'Gaming': return renderActiveIndustry();

      case 'APIProviders':
        return (
          <div>
            <h2>API Providers</h2>
            <p>Integrate with multiple third-party API providers.</p>
          </div>
        );
      case 'Marketplace':
        return (
          <div>
            <h2>Marketplace</h2>
            <p>Access a decentralized marketplace for digital assets.</p>
          </div>
        );
      case 'Analytics':
        return (
          <div>
            <h2>Analytics</h2>
            <p>Advanced data insights and performance metrics.</p>
          </div>
        );
      case 'Squads':
        return (
          <div>
            <h2>Squads</h2>
            <p>Collaborate with decentralized teams and squads.</p>
          </div>
        );
      case 'Syndicates':
        return (
          <div>
            <h2>Syndicates</h2>
            <p>Join or form syndicates for shared operational goals.</p>
          </div>
        );
      case 'Upgrades':
        return (
          <div>
            <h2>Upgrades</h2>
            <p>Explore platform upgrade options and new features.</p>
          </div>
        );
      default:
        return renderToolGrid();
    }
  };

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
            {/* Primary Dashboard */}
            <li className={activeTool === null ? 'active' : ''} onClick={() => { setActiveTool(null); }}>
              <AdvisorIcon /> Agent Dash
            </li>
            {/* Tools Submenu */}
            <li onClick={() => setRecentsOpen(!recentsOpen)}>
              <History /> Recents {recentsOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
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
            {/* Agent Tools Dropdown */}
            <li onClick={toggleCreateAgentDropdown}>
              <Robot /> Agent Tools {createAgentDropdownOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </li>
            {createAgentDropdownOpen && (
              <ul className="sub-menu">
                <li onClick={() => handleToolClick('CreateAgent')}>
                  <PlusIcon /> Create
                </li>
                <li onClick={() => handleToolClick('DataUpload')}>
                  <FileUpload /> Upload
                </li>
                <li onClick={() => handleToolClick('AgentBoard')}>
                  <Eye /> Monitor
                </li>
                <li onClick={() => handleToolClick('AgentManager')}>
                  <CheckList /> Manage
                </li>
                <li className="notification-item" onClick={handleNotificationClick}>
                  <FontAwesomeIcon icon={faBell} className={activeAlerts.length > 0 ? 'alert-active' : ''} />
                  <span>Alerts</span>
                  {activeAlerts.length > 0 && <span className="notification-count">{activeAlerts.length}</span>}
                </li>
              </ul>
            )}
            {/* Industries Section */}
            <li className="section-header">Industries</li>
            {industries.map((industry) => (
              <li key={industry.id} onClick={() => handleToolClick(industry.name)}>
                <industry.icon /> {industry.label}
              </li>
            ))}
            {/* Integrations Section */}
            <li className="section-header">Integrations</li>
            {integrations.map((intg) => (
              <li key={intg.id} onClick={() => handleToolClick(intg.name)}>
                <intg.icon /> {intg.label}
              </li>
            ))}
          </ul>
          <ul>
            <li className="logout-button" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
            </li>
          </ul>
        </nav>
      </div>
      <div className="main-content bg-background-color">
        <div className="header">
          <div className="beta-notice">
            <Alert /> This is a Beta version. Some features may be limited.
          </div>
          <div className="agent-wallet-container">
            {/* Agent Display Section */}
            <div className="agent-display">
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
              <div className="agent-card">
                <img src={selectedAgent.imageUrl} alt={selectedAgent.name} className="agent-image" />
                <div className="agent-info">
                  <h3>{selectedAgent.name}</h3>
                  <div className="traits">
                    {Object.entries(selectedAgent.traits).map(([trait, level]) => (
                      <div key={trait} className="trait">
                        <span className="trait-icon">{getTraitIcon(trait)}</span>
                        <span className="trait-name">{trait}</span>
                        <div className="progress-bar">
                          <div className="progress" style={{ width: `${level}%`, backgroundColor: getTraitColor(trait) }}>
                            {level}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Tokens & Energy */}
                  <div className="agent-stats">
                    <div className="agent-stat">
                      <span className="stat-icon">🪙</span>
                      <span className="stat-label">iNFA Tokens:</span>
                      <span className="stat-value">{selectedAgent.tokens?.amount ?? 0}</span>
                    </div>
                    <div className="agent-stat">
                      <span className="stat-icon">⚡</span>
                      <span className="stat-label">Energy:</span>
                      <span className="stat-value">{selectedAgent.energy?.level ?? 0}</span>
                    </div>
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
                <KeyIcon style={{ marginRight: '8px' }} /> Connect and Sync Your Wallets
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
                  <PlusIcon style={{ marginRight: '8px' }} /> Add
                </button>
              </div>
            </div>
          </div>
          {/* Filter Buttons */}
          <div className="filter-buttons">
            <button className={`filter-button ${activeCategory === 'ALL' ? 'active' : ''}`} onClick={() => handleFilterClick('ALL')}>
              <StarIcon style={{ marginRight: '8px' }} /> ALL
            </button>
            <button className={`filter-button ${activeCategory === 'MINE' ? 'active' : ''}`} onClick={() => handleFilterClick('MINE')}>
              <Mine style={{ marginRight: '8px' }} /> Mining
            </button>
            <button className={`filter-button ${activeCategory === 'BUILD' ? 'active' : ''}`} onClick={() => handleFilterClick('BUILD')}>
              <Build style={{ marginRight: '8px' }} /> Building
            </button>
            <button className={`filter-button ${activeCategory === 'DEFEND' ? 'active' : ''}`} onClick={() => handleFilterClick('DEFEND')}>
              <ShieldIcon style={{ marginRight: '8px' }} /> Defending
            </button>
            <button className={`filter-button ${activeCategory === 'SCOUT' ? 'active' : ''}`} onClick={() => handleFilterClick('SCOUT')}>
              <Scout style={{ marginRight: '8px' }} /> Scouting
            </button>
            <button className={`filter-button ${activeCategory === 'HEAL' ? 'active' : ''}`} onClick={() => handleFilterClick('HEAL')}>
              <Health style={{ marginRight: '8px' }} /> Healing
            </button>
          </div>
        </div>
        {/* Active Tool / Section Rendering */}
        {renderActiveTool()}
      </div>

      {/* ------------------------------------------------------------------
            Inline CSS Styles
      ------------------------------------------------------------------ */}
      <style jsx>{`
        .dashboard-container {
          display: flex;
          height: 100vh;
          background-color: #f8f9fa;
          overflow: hidden;
          z-index: 1;
        }
        .profile-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1002;
        }
        .gear-icon {
          position: absolute;
          top: -10px;
          right: -10px;
          background-color: white;
          border: 2px solid #e0e0e0;
          border-radius: 50%;
          padding: 5px;
          font-size: 18px;
          color: #333;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: background-color 0.3s, transform 0.3s;
        }
        .gear-icon:hover {
          color: #ff7e2f;
          transform: scale(1.1);
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
          align-items: center;
          border-right: 1px solid #e0e0e0;
          overflow-y: auto;
          transition: all 0.3s ease;
          z-index: 1;
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
          justify-content: flex-start;
          gap: 10px;
          border-radius: 8px;
          transition: background-color 0.3s, color 0.3s;
        }
        .nav-menu li.active,
        .nav-menu li:hover {
          color: #ff7e2f;
          background-color: #f2f2f2;
          font-weight: bold;
        }
        .section-header {
          width: 100%;
          padding: 10px 20px;
          font-size: 14px;
          text-transform: uppercase;
          color: #555;
          background-color: #f9f9f9;
          margin-top: 20px;
          border-radius: 4px;
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
          color: #ff7e2f;
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
          box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
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
          box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
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
        /* New Tokens & Energy Styles */
        .agent-stats {
          display: flex;
          justify-content: space-around;
          margin-top: 15px;
        }
        .agent-stat {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          color: #333;
        }
        .stat-icon {
          font-size: 16px;
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
          background-color: #ff7e2f;
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
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
          max-height: 200px;
          overflow-y: auto;
        }
        .wallet-dropdown div:hover {
          background-color: #f2f2f2;
          transition: background-color 0.3s;
          cursor: pointer;
        }
        .connect-button {
          background-color: #ff7e2f;
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
          flex: 3;
          padding: 10px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 16px;
        }
        .add-button {
          flex: 1;
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
          background-color: #f1f0eb;
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
          background-color: #ff7e2f;
          color: white;
        }
        .grid-container {
          display: grid;
          cursor: pointer;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          width: 100%;
        }
        .grid-item {
          background-color: white;
          border: 1px solid #e0e0e0;
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
          cursor: pointer;
          box-shadow: 0 10px 15px rgba(0,0,0,0.1);
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
          color: #ffd700;
        }
        .star-icon.favorited {
          color: #ff7e2f;
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
          color: #ff7e2f;
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
          width: 100%;
          padding: 5px 10px;
          background-color: #fff3cd;
          color: #ff7e2f;
          border-bottom: 1px solid #ffeeba;
          font-size: 0.75rem;
          text-align: center;
          border-radius: 0;
          margin: 0;
        }
        /* Industry Modules – Financial Services & Gaming */
        .industry-subnav {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }
        .industry-subnav button {
          padding: 8px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background-color: #f1f0eb;
          color: #333;
          cursor: pointer;
          transition: background-color 0.3s, color 0.3s;
        }
        .industry-subnav button.active,
        .industry-subnav button:hover {
          background-color: #ff7e2f;
          color: white;
        }
        .industry-content {
          background-color: #fff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
          margin-top: 20px;
        }
        .industry-active-container {
          background-color: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
          margin-top: 20px;
        }
        .back-button {
          margin-bottom: 20px;
          background-color: #007bff;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        .industry-grid-item {
          height: auto;
          padding: 20px;
        }
        /* Responsive Styles */
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
            background-color: #ff7e2f;
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
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
            max-height: 200px;
            overflow-y: auto;
            width: 100%;
          }
          .connect-button,
          .add-button {
            background-color: #ff7e2f;
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
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            font-size: 16px;
          }
          .connect-button {
            width: 100%;
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
            padding: 20px 10px;
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
