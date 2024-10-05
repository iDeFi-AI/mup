import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faShieldAlt, faPiggyBank, faCoins, faInfoCircle, faWallet } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { connectWallet, syncWalletData } from '@/utilities/web3Utils';
import WalletSelectionModal from '@/components/wallets';

const FinancialRoadmap: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleWalletSelect = async (provider: string) => {
    try {
      const accounts = await connectWallet(provider);
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        await syncWalletData(accounts);
        fetchRoadmapData(accounts[0]);
        setIsModalOpen(false);
      } else {
        setError('No accounts found. Please check your wallet.');
      }
    } catch (err) {
      setError('Failed to connect to wallet.');
    }
  };

  const fetchRoadmapData = async (address: string) => {
    try {
      const apiResponse = await fetch('/api/basic_metrics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });
      const apiData = await apiResponse.json();

      const qApiResponse = await fetch('/api/quantum_risk_analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ portfolio: { walletAddress: address } }),
      });
      const qApiData = await qApiResponse.json();

      setRoadmapData({ ...apiData, ...qApiData });
    } catch (error) {
      setError('Error fetching roadmap data.');
      console.error('Error fetching roadmap data:', error);
    }
  };

  return (
    <div className="financial-roadmap-container bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Financial Roadmap</h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          <FontAwesomeIcon icon={faWallet} className="mr-2" /> Connect Wallet
        </button>
      </div>

      {isModalOpen && (
        <WalletSelectionModal
          onSelect={handleWalletSelect}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {walletAddress && <p className="text-green-600 mt-4 text-center">Connected: {walletAddress}</p>}
      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

      {/* Financial Input Fields */}
      <div className="financial-inputs mt-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Financial Information</h2>
        <div className="flex flex-col space-y-4 items-center">
          <div className="w-full max-w-lg">
            <label className="block text-gray-700 font-bold mb-2 flex justify-between items-center">
              <span><FontAwesomeIcon icon={faPiggyBank} className="mr-2 text-green-500" /> Annual Income</span>
              <Tippy content="Your estimated annual income before taxes.">
                <FontAwesomeIcon icon={faInfoCircle} className="text-gray-500" />
              </Tippy>
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded focus:outline-none"
              placeholder="Enter your annual income"
            />
          </div>

          <div className="w-full max-w-lg">
            <label className="block text-gray-700 font-bold mb-2 flex justify-between items-center">
              <span><FontAwesomeIcon icon={faCoins} className="mr-2 text-yellow-500" /> Monthly Expenses</span>
              <Tippy content="Total of your estimated monthly expenses.">
                <FontAwesomeIcon icon={faInfoCircle} className="text-gray-500" />
              </Tippy>
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded focus:outline-none"
              placeholder="Enter your monthly expenses"
            />
          </div>

          <div className="w-full max-w-lg">
            <label className="block text-gray-700 font-bold mb-2 flex justify-between items-center">
              <span><FontAwesomeIcon icon={faChartLine} className="mr-2 text-blue-500" /> Investment Amount</span>
              <Tippy content="Amount of money allocated for investments.">
                <FontAwesomeIcon icon={faInfoCircle} className="text-gray-500" />
              </Tippy>
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded focus:outline-none"
              placeholder="Enter the amount you want to invest"
            />
          </div>
        </div>
      </div>

      {/* Display Roadmap Data */}
      {walletAddress && roadmapData && (
        <div className="roadmap-steps grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Wealth Plan Step */}
          <div className="roadmap-step bg-blue-100 p-6 rounded-lg shadow-md">
            <div className="step-header flex items-center">
              <FontAwesomeIcon icon={faChartLine} className="text-blue-600 text-2xl mr-4" />
              <h2 className="text-xl font-semibold">Wealth Plan</h2>
              <Tippy content="Your long-term financial strategy for building wealth." trigger="mouseenter">
                <FontAwesomeIcon icon={faInfoCircle} className="text-gray-500 ml-2" />
              </Tippy>
            </div>
            <p className="mt-4 text-gray-700">{roadmapData?.wealth_plan || 'Loading...'}</p>
          </div>

          {/* Savings Strategy Step */}
          <div className="roadmap-step bg-green-100 p-6 rounded-lg shadow-md">
            <div className="step-header flex items-center">
              <FontAwesomeIcon icon={faPiggyBank} className="text-green-600 text-2xl mr-4" />
              <h2 className="text-xl font-semibold">Savings Strategy</h2>
              <Tippy content="Recommended savings strategies based on your income and future goals." trigger="mouseenter">
                <FontAwesomeIcon icon={faInfoCircle} className="text-gray-500 ml-2" />
              </Tippy>
            </div>
            <p className="mt-4 text-gray-700">Learn how to allocate your income effectively to save for the future.</p>
          </div>

          {/* Risk Management Step */}
          <div className="roadmap-step bg-yellow-100 p-6 rounded-lg shadow-md">
            <div className="step-header flex items-center">
              <FontAwesomeIcon icon={faShieldAlt} className="text-yellow-600 text-2xl mr-4" />
              <h2 className="text-xl font-semibold">Risk Management</h2>
              <Tippy content="Managing risk through a diversified portfolio." trigger="mouseenter">
                <FontAwesomeIcon icon={faInfoCircle} className="text-gray-500 ml-2" />
              </Tippy>
            </div>
            <p className="mt-4 text-gray-700">Ensure that your assets are protected against market volatility and other risks.</p>
          </div>

          {/* Investment Growth Step */}
          <div className="roadmap-step bg-red-100 p-6 rounded-lg shadow-md">
            <div className="step-header flex items-center">
              <FontAwesomeIcon icon={faCoins} className="text-red-600 text-2xl mr-4" />
              <h2 className="text-xl font-semibold">Investment Growth</h2>
              <Tippy content="Strategies for growing your investments over time." trigger="mouseenter">
                <FontAwesomeIcon icon={faInfoCircle} className="text-gray-500 ml-2" />
              </Tippy>
            </div>
            <p className="mt-4 text-gray-700">See how your investments can grow and compound over the years.</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .financial-roadmap-container {
          max-width: 800px;
        }

        .roadmap-step {
          transition: transform 0.2s ease;
        }

        .roadmap-step:hover {
          transform: translateY(-5px);
        }

        .step-header h2 {
          margin-left: 10px;
        }
      `}</style>
    </div>
  );
};

export default FinancialRoadmap;
