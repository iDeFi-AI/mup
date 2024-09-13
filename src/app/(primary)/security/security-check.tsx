"use client";

import React, { useState } from "react";
import Image from "next/image";
import ScoreTxnsV2 from "@/components/layouts/ScoreTxnsV2";
import CodeTerminal from "@/components/layouts/CodeTerminal";
import {
  checkFlaggedAddress,
  fetchDataAndMetrics,
  fetchEtherscanData,
} from "@/utilities/apiUtils";
import { connectWallet, syncWalletData } from "@/utilities/web3Utils";
import { ShieldIcon } from "@/components/icons";
import { generateInsights } from "@/utilities/dataUtils";

// Utility function to validate Ethereum address
const isValidAddress = (address: string): boolean => {
  const ethRegExp = /^(0x)?[0-9a-fA-F]{40}$/;
  return ethRegExp.test(address);
};

const SecurityCheck: React.FC = () => {
  const [address, setAddress] = useState<string>("");
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [status, setStatus] = useState<"Pass" | "Fail" | "Yellow" | null>(null);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [metrics, setMetrics] = useState<Record<string, any>>({});
  const [transactions, setTransactions] = useState<any[]>([]);
  const [insights, setInsights] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);

  const handleCheckStatus = async () => {
    if (!isValidAddress(address)) {
      setAlertMessage("Invalid Ethereum address. Please enter a valid address.");
      return;
    }

    setLoading(true);
    setAlertMessage(null);

    try {
      const flaggedResponse = await checkFlaggedAddress(address);
      const dataAndMetrics = await fetchDataAndMetrics(address);
      const transactionHistory = await fetchEtherscanData(address);

      let calculatedStatus: "Pass" | "Fail" | "Yellow" = "Pass";
      let calculatedScore = 100;

      // Check if the address was flagged or if there is any transaction data
      if (flaggedResponse || transactionHistory.length > 0) {
        const { status: flaggedStatus, metrics: flaggedMetrics } = flaggedResponse || {};
        const { score, additionalMetrics } = dataAndMetrics || {};

        if (flaggedStatus === "Fail") {
          calculatedStatus = "Fail";
          calculatedScore = 20;
        } else if (flaggedStatus === "Pass" && score < 50) {
          calculatedStatus = "Fail";
          calculatedScore = score;
        } else if (score >= 50 && score < 71) {
          calculatedStatus = "Yellow";
          calculatedScore = score;
        } else {
          calculatedStatus = "Pass";
          calculatedScore = score;
        }

        setMetrics({ ...flaggedMetrics, ...additionalMetrics });
        setTransactions(transactionHistory);
      } else {
        // No transaction history or flag means the address is safe by default
        setAlertMessage("No transaction history or flags found. Address is considered safe.");
        calculatedStatus = "Pass";
        calculatedScore = 100;
      }

      setStatus(calculatedStatus);
      setOverallScore(calculatedScore);
    } catch (error) {
      console.error("Error during status check:", error);
      setAlertMessage("Failed to check status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = async (providerName: string) => {
    const accounts = await connectWallet(providerName);
    if (accounts && accounts.length > 0) {
      setConnectedAccount(accounts[0]);
      setAddress(accounts[0]);
      await syncWalletData(accounts);
    } else {
      setAlertMessage("Failed to connect wallet. Please try again.");
    }
  };

  const handleGenerateInsights = async () => {
    if (!isValidAddress(address)) {
      setAlertMessage("Invalid Ethereum address. Please enter a valid address.");
      return;
    }

    setLoadingInsights(true);

    try {
      const insightsData = await generateInsights(address, transactions, status || "None");
      setInsights(insightsData || "No significant insights available.");
      setAlertMessage(null);
    } catch (error) {
      console.error("Error generating insights:", error);
      setAlertMessage("Failed to generate insights. Please try again.");
    } finally {
      setLoadingInsights(false);
    }
  };

  const getHexagonImage = () => {
    if (overallScore === null) return "/hexagon-yellow.png";
    if (overallScore >= 71) return "/hexagon-green.png";
    if (overallScore <= 20) return "/hexagon-red.png";
    return "/hexagon-green.png"; // Default to green if overallScore isn't covered above
  };

  return (
    <div className="min-h-screen bg-background-color flex flex-col items-center text-center p-6">
      
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 mb-8">
        <div className="mb-6">
          <Image
            src="/brandlogo.png"
            alt="brand logo"
            width={150}
            height={150}
            className="mx-auto"
          />
        </div>
        <h2 className="text-3xl font-bold mb-6">Security Check</h2>
      
        {/* Arch Image with input box */}
        <div className="relative mb-4">
          <Image src="/arch-image3.png" alt="Risk Status Arch" width={450} height={180} className="w-full max-w-xs md:max-w-md mx-auto" />

          {/* Score and Hexagon Image in the middle of the arches */}
          {status && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Image src={getHexagonImage()} alt="Hexagon status" width={100} height={115} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{overallScore !== null ? overallScore : ""}</span>
              </div>
            </div>
          )}
        </div>
        
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter Ethereum address"
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-neorange"
        />

        {/* Button Group */}
        <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
          <button
            onClick={handleCheckStatus}
            className="w-full md:w-1/3 bg-neorange text-white p-2 rounded hover:bg-neodark transition-colors flex items-center justify-center"
            disabled={loading}
          >
            <ShieldIcon className="mr-2" />
            {loading ? "Checking..." : "Check Status"}
          </button>
          <button
            onClick={() => handleConnectWallet("CoinbaseWallet")}
            className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-100"
          >
            <Image src="/coinbase-logo.png" alt="Coinbase Wallet" width={32} height={32} />
            <span>Sync Coinbase</span>
          </button>
          <button
            onClick={() => handleConnectWallet("MetaMask")}
            className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-100"
          >
            <Image src="/metamask-logo.png" alt="Sync MetaMask" width={32} height={32} />
            <span>Sync MetaMask</span>
          </button>
        </div>

        {alertMessage && <p className="text-green-500 mt-4">{alertMessage}</p>}
      </div>

      <hr className="w-full border-t border-gray-300 my-6" /> {/* Add a separator */}

      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setShowTransactions(!showTransactions)} className="bg-blue-500 text-white py-2 px-4 rounded-lg">
            {showTransactions ? "Hide Transactions" : "Show Transactions"}
          </button>
          <button onClick={handleGenerateInsights} className="bg-green-500 text-white py-2 px-4 rounded-lg">
            {loadingInsights ? "Generating Insights..." : "Generate Insights"}
          </button>
        </div>

        {showTransactions && <ScoreTxnsV2 transactions={transactions} />}
        
        <div className="mt-4">
          <CodeTerminal>{insights || "No insights generated yet."}</CodeTerminal>
        </div>
      </div>

      {/* CSS */}
      <style jsx>{`
        .pass {
          color: green;
        }
        .fail {
          color: red;
        }
        .yellow {
          color: yellow;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .mobile-friendly {
            flex-direction: column;
          }

          .flex-column {
            flex-direction: column;
          }
        }

        /* Progressively Enhance Experience */
        @media (min-width: 769px) {
          .mobile-friendly {
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
};

export default SecurityCheck;
