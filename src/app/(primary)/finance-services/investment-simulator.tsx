import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faChartPie, faArrowUp, faArrowDown, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { connectWallet, syncWalletData } from '@/utilities/web3Utils';
import WalletSelectionModal from '@/components/wallets';

const InvestmentSimulator: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleWalletSelect = async (provider: string) => {
    try {
      const accounts = await connectWallet(provider);
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        await syncWalletData(accounts);
        runSimulation(accounts[0]);
        setIsModalOpen(false);
      } else {
        setError('No accounts found. Please check your wallet.');
      }
    } catch (err) {
      setError('Failed to connect to wallet.');
    }
  };

  const runSimulation = async (address: string) => {
    try {
      const response = await fetch('/api/portfolio_optimization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ portfolio: { walletAddress: address } }),
      });
      const data = await response.json();
      setSimulationResult(data);
    } catch (error) {
      setError('Error running simulation.');
      console.error('Error running simulation:', error);
    }
  };

  return (
    <div className="investment-simulator bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Investment Simulator</h1>

      {/* Wallet Connect Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          Connect Wallet
        </button>
      </div>

      {/* WalletSelectionModal */}
      {isModalOpen && (
        <WalletSelectionModal
          onSelect={handleWalletSelect}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {walletAddress && <p className="text-green-600 mt-4 text-center">Connected: {walletAddress}</p>}
      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

      {/* Financial Input Fields */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Simulation Parameters</h2>
        <div className="flex flex-col space-y-4 items-center">
          <div className="w-full max-w-lg">
            <label className="block text-gray-700 font-bold mb-2 flex justify-between items-center">
              <span><FontAwesomeIcon icon={faCoins} className="mr-2 text-yellow-500" /> Investment Amount</span>
              <Tippy content="This is the amount you want to allocate for the simulation.">
                <FontAwesomeIcon icon={faInfoCircle} className="text-gray-500 ml-2" />
              </Tippy>
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded focus:outline-none"
              placeholder="Enter the amount to invest"
            />
          </div>

          <div className="w-full max-w-lg">
            <label className="block text-gray-700 font-bold mb-2 flex justify-between items-center">
              <span><FontAwesomeIcon icon={faChartPie} className="mr-2 text-green-500" /> Risk Tolerance</span>
              <Tippy content="Adjust the slider to indicate your tolerance for investment risk.">
                <FontAwesomeIcon icon={faInfoCircle} className="text-gray-500 ml-2" />
              </Tippy>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              className="w-full p-2 border rounded focus:outline-none"
              placeholder="Enter your risk tolerance level (1-10)"
            />
          </div>

          <div className="w-full max-w-lg">
            <label className="block text-gray-700 font-bold mb-2 flex justify-between items-center">
              <span><FontAwesomeIcon icon={faArrowDown} className="mr-2 text-red-500" /> Investment Time Horizon</span>
              <Tippy content="How long do you plan to keep this investment?">
                <FontAwesomeIcon icon={faInfoCircle} className="text-gray-500 ml-2" />
              </Tippy>
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded focus:outline-none"
              placeholder="Enter the number of years"
            />
          </div>
        </div>
      </div>

      {/* Simulation Results */}
      {walletAddress && simulationResult && (
        <div className="simulation-results mt-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Simulation Results</h2>
          <div className="flex flex-col space-y-4">
            <div className="bg-blue-100 p-4 rounded-lg shadow-md">
              <FontAwesomeIcon icon={faChartPie} className="text-blue-600 text-2xl mr-4" />
              <h3 className="text-lg font-semibold">Portfolio Optimization</h3>
              <p className="text-gray-700">{simulationResult.optimized_portfolio}</p>
            </div>

            <div className="bg-green-100 p-4 rounded-lg shadow-md">
              <FontAwesomeIcon icon={faArrowUp} className="text-green-600 text-2xl mr-4" />
              <h3 className="text-lg font-semibold">Expected Growth</h3>
              <p className="text-gray-700">Your portfolio is expected to grow by {simulationResult.expected_growth}% over time.</p>
            </div>

            <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
              <FontAwesomeIcon icon={faArrowDown} className="text-yellow-600 text-2xl mr-4" />
              <h3 className="text-lg font-semibold">Risk Factor</h3>
              <p className="text-gray-700">The calculated risk factor for this investment is {simulationResult.risk_factor}.</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .investment-simulator {
          max-width: 800px;
        }

        .simulation-results div {
          transition: transform 0.2s ease;
        }
        .simulation-results div:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
};

export default InvestmentSimulator;
