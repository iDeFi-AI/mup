"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ScoreTxnsV2 from "@/components/layouts/ScoreTxnsV2";
import CodeTerminal from "@/components/layouts/CodeTerminal";
import axios from "axios";
import { connectWallet, syncWalletData } from "@/utilities/web3Utils";
import { generateInsights } from "@/utilities/dataUtils";
import { ShieldIcon } from "@/components/icons";

const IDEFI_API_BASE_URL = "https://api.idefi.ai";
const ETHERSCAN_API_BASE_URL = "https://api.etherscan.io/api";
const ETHERSCAN_API_KEY = "QEX6DGCMDRPXRU89FKPUR4BG9AUMCR4FXD"; // Replace with your actual API key

// Define types for transaction data
interface Transaction {
  id: string;
  timestamp: string;
  type: "Sent" | "Received";
  cryptocurrency: string;
  usdAmount: number;
  thirdPartyWallet: string;
  flagged: boolean;
  risk: "High" | "Medium" | "Low" | "None";
}

// Utility function to validate Ethereum address
const isValidAddress = (address: string): boolean => {
  const ethRegExp = /^(0x)?[0-9a-fA-F]{40}$/;
  return ethRegExp.test(address);
};

// Function to fetch flagged addresses from the backend
const fetchFlaggedAddresses = async (): Promise<Set<string>> => {
  try {
    const response = await axios.get(`${IDEFI_API_BASE_URL}/api/get_flagged_addresses`);
    const data = response.data;
    return new Set(Object.keys(data.flagged_addresses));
  } catch (error) {
    console.error("Error fetching flagged addresses:", error);
    return new Set();
  }
};

// Function to fetch transaction data from Etherscan
const fetchEtherscanData = async (address: string): Promise<Transaction[]> => {
  const etherscanUrl = `${ETHERSCAN_API_BASE_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
  try {
    const response = await axios.get(etherscanUrl);
    const ethData = response.data;

    if (ethData.status === "1") {
      return ethData.result.map((tx: any, index: number) => ({
        id: tx.hash || index.toString(),
        timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
        type: address.toLowerCase() === tx.from.toLowerCase() ? "Sent" : "Received",
        cryptocurrency: "ETH",
        usdAmount: parseFloat(tx.value) / 1e18,
        thirdPartyWallet: address.toLowerCase() === tx.from.toLowerCase() ? tx.to : tx.from,
        flagged: false,
        risk: "None",
      }));
    } else {
      console.error("Error fetching Etherscan data:", ethData.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching Etherscan data:", error);
    throw new Error("Failed to fetch Etherscan data.");
  }
};

const SecurityCheck: React.FC = () => {
  const [address, setAddress] = useState<string>("");
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [status, setStatus] = useState<"Pass" | "Fail" | "Warning" | null>(null);
  const [metrics, setMetrics] = useState<Record<string, any>>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [insights, setInsights] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [flaggedAddresses, setFlaggedAddresses] = useState<Set<string>>(new Set());

  // Fetch flagged addresses once on component mount
  useEffect(() => {
    const loadFlaggedAddresses = async () => {
      const flaggedSet = await fetchFlaggedAddresses();
      setFlaggedAddresses(flaggedSet);
    };
    loadFlaggedAddresses();
  }, []);

  const handleCheckStatus = async () => {
    if (!isValidAddress(address)) {
      setAlertMessage("Invalid Ethereum address. Please enter a valid address.");
      return;
    }

    setLoading(true);
    setAlertMessage(null);

    try {
      // Check if the address is flagged
      const flaggedResponse = await axios.get(`${IDEFI_API_BASE_URL}/api/checkaddress`, {
        params: { address },
      });
      const flaggedStatus = flaggedResponse?.data?.status;

      // Fetch transaction history from Etherscan
      const transactionHistory = await fetchEtherscanData(address);

      if (flaggedStatus) {
        setStatus(flaggedStatus); // PASS, FAIL, or WARNING from backend
        setMetrics(flaggedResponse?.data?.metrics || {});
        setTransactions(transactionHistory);
      } else {
        setAlertMessage("No relevant data found. Address is considered safe.");
        setStatus("Pass");
      }
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
    switch (status) {
      case "Pass":
        return "/hexagon-green.png";
      case "Fail":
        return "/hexagon-red.png";
      case "Warning":
        return "/hexagon-yellow.png";
      default:
        return "/hexagon-yellow.png"; // Default to yellow if status is null
    }
  };

  return (
    <div className="min-h-screen bg-background-color flex flex-col items-center text-center p-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-3xl font-bold mb-6">Security Check</h2>

        {/* Arch Image with input box */}
        <div className="relative mb-4">
          <Image src="/arch-image3.png" alt="Risk Status Arch" width={450} height={180} className="w-full max-w-xs md:max-w-md mx-auto" />

          {/* Score and Hexagon Image in the middle of the arches */}
          {status && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Image src={getHexagonImage()} alt="Hexagon status" width={100} height={115} />
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

      <hr className="w-full border-t border-gray-300 my-6" />

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
