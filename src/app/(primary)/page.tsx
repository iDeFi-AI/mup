'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  pushTransaction,
  pushAiInsights,
  listenToTransactions,
  storeUserId,
} from '@/utilities/firebaseClient';
import Head from 'next/head';
import Image from 'next/image';
import EthIDAC from '@/components/layouts/EthIDAC';
import HexagonScore from '@/components/layouts/ScoreHexa';
import ScoreTxns from '@/components/layouts/ScoreTxns';
import CodeTerminal from '@/components/layouts/CodeTerminal';
import { fetchData, generateInsights, generateOpenAIPrompt, fetchDataAndMetrics } from '@/utilities/dataUtils';
import { fetchTransactionsFromApi, checkFlaggedAddress } from '@/utilities/apiUtils';
import web3 from '@/utilities/web3Utils';

// Define the Transaction type
type TransactionType = 'Sent' | 'Received';

// Define the Transaction interface
interface Transaction {
  timestamp: string;
  type: TransactionType;
  cryptocurrency: string;
  thirdPartyIdacScore: number;
  usdAmount: number;
  thirdPartyWallet: string;
}

interface InsightsResponse {
  openAIResponse?: string | null; // Adjust the type based on the expected response
  // Add other properties as needed
}

const getColorForScore = (score: number): string => {
  if (score >= 850) {
    return 'green';
  } else if (score >= 740) {
    return 'yellow';
  } else if (score >= 630) {
    return 'orange';
  } else if (score >= 410) {
    return 'red';
  } else if (score >= 310) {
    return 'black';
  } else {
    return 'grey';
  }
};

const DApp: React.FC = () => {
  const mounted = useRef(false);
  const [userAddress, setUserAddress] = useState('');
  const [generatedScore, setGeneratedScore] = useState<number | null>(null);
  const [insights, setInsights] = useState<string>('');
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [flaggedStatus, setFlaggedStatus] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const otherAddress = ''; // Adjust this value based on your requirements

  useEffect(() => {
    mounted.current = true;

    // Listen to changes in transactions and update the state
    listenToTransactions((data) => {
      if (mounted.current) {
        setTransactions(data || []);
      }
    });

    return () => {
      mounted.current = false;
    };
  }, []);

  const isValidAddress = (address: string) => {
    const ethRegExp = /^(0x)?[0-9a-fA-F]{40}$/;
    const btcRegExp = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    return ethRegExp.test(address) || btcRegExp.test(address);
  };

  const handleAccountChange = (account: string | null) => {
    setConnectedAccount(account);
    setUserAddress(account || ''); // Set userAddress when account changes
  };

  const connectWallet = async () => {
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        window.location.href = 'https://idefi.ai/dapp'; // Redirect to the mobile wallet deep link
      } else {
        const accounts: string[] | null = await web3.eth.requestAccounts();
        const fetchedAccount = accounts?.[0] || null;
        setConnectedAccount(fetchedAccount);
        setUserAddress(fetchedAccount || '');
        window.location.reload();
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error.message);
    }
  };

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const accounts: string[] | null = await web3.eth.getAccounts();
        const fetchedAccount = accounts?.[0] || null;
        setConnectedAccount(fetchedAccount);
        setUserAddress(fetchedAccount || ''); // Set userAddress when account changes
      } catch (error: any) {
        console.error('Error fetching account:', error.message);
      }
    };

    // Fetch account only if mounted and there is no connected account
    if (mounted.current && !connectedAccount) {
      fetchAccount();
    }
  }, [connectedAccount]); 
  
  const handleGenerateScore = async () => {
    // Determine the address to use
    const addressToUse = connectedAccount || userAddress;

    if (!isValidAddress(addressToUse)) {
      alert('Invalid Address. Please enter a valid address.');
      return;
    }

    // Fetch transaction data
    const fetchedTransactions = await fetchData(addressToUse, 'eth');

    if (fetchedTransactions && fetchedTransactions.length > 0) {
      // Store user ID in Firebase
      storeUserId({ userId: addressToUse });

      // Push each transaction individually to Firebase
      fetchedTransactions.forEach((transaction) => {
        pushTransaction(transaction);
      });

      // Set transactions state for ScoreTxns component
      setTransactions(fetchedTransactions);

      // Generate and set the score
      const score = generateScore(addressToUse);
      setGeneratedScore(score);
      
      alert('Transaction history loaded successfully!');

      try {
        // Generate OpenAI prompt based on transactions
        const openAIPrompt = generateOpenAIPrompt(addressToUse, otherAddress, fetchedTransactions, score);

        // Generate and set insights
        const insightsResponse = await generateInsights(addressToUse, otherAddress, openAIPrompt, score);

        // Log the insightsResponse for debugging
        console.log('Insights response:', insightsResponse);

        if (insightsResponse) {
          if (typeof insightsResponse === 'string') {
            // Set insights only if it's a string (not null)
            setInsights(insightsResponse);

            // Push insights to Firebase
            pushAiInsights({ userAddress: addressToUse, insights: insightsResponse, timestamp: Date.now() });
          } else {
            console.error('Invalid insights response:', insightsResponse);
          }
        } else {
          console.error('Insights response is null.');
        }
      } catch (error) {
        console.error('Error generating insights:', error);
      }
    } else {
      // Handle case where there are no transactions
      setTransactions([]); // Set transactions to an empty array

      // Set generated score to null or any default value
      setGeneratedScore(null);

      // Optionally, you can set a message or take other actions to inform the user
      console.log('No transactions available for the given address.');
      alert('No transactions or score available for the given address.');
      return; // This will prevent further execution of the function
    }

    // Check if the address is flagged
    const flaggedResponse = await checkFlaggedAddress(addressToUse);
    if (flaggedResponse && flaggedResponse.description) {
      setFlaggedStatus(flaggedResponse.description);
    } else {
      setFlaggedStatus('No information available.');
    }
  };

  const fetchAiInsights = async () => {
    const addressToUse = connectedAccount || userAddress;

    if (!isValidAddress(addressToUse)) {
      alert('Invalid Address. Please enter a valid address.');
      return;
    }

    // Fetch transaction data
    const fetchedTransactions = await fetchData(addressToUse, 'eth');

    if (fetchedTransactions && fetchedTransactions.length > 0) {
      try {
        // Generate OpenAI prompt based on transactions
        if (generatedScore !== null) {
          const openAIPrompt = generateOpenAIPrompt(addressToUse, otherAddress, fetchedTransactions, generatedScore);

          // Generate and set insights
          const insightsResponse = await generateInsights(addressToUse, otherAddress, openAIPrompt, generatedScore);

          // Log the insightsResponse for debugging
          console.log('Insights response:', insightsResponse);

          if (insightsResponse) {
            if (typeof insightsResponse === 'string') {
              // Set insights only if it's a string (not null)
              setInsights(insightsResponse);
            } else {
              console.error('Invalid insights response:', insightsResponse);
            }
          } else {
            console.error('Insights response is null.');
          }
        }
      } catch (error) {
        console.error('Error generating insights:', error);
      }
    } else {
      console.log('No transactions available for the given address.');
      alert('No transactions available for the given address.');
    }
  };

  const checkAddressFlaggedStatus = async () => {
    const addressToUse = connectedAccount || userAddress;

    if (!isValidAddress(addressToUse)) {
      alert('Invalid Address. Please enter a valid address.');
      return;
    }

    // Check if the address is flagged
    const flaggedResponse = await checkFlaggedAddress(addressToUse);
    if (flaggedResponse && flaggedResponse.description) {
      setFlaggedStatus(flaggedResponse.description);
    } else {
      setFlaggedStatus('No information available.');
    }
  };

  const fetchDataAndMetricsInfo = async () => {
    const addressToUse = connectedAccount || userAddress;

    if (!isValidAddress(addressToUse)) {
      alert('Invalid Address. Please enter a valid address.');
      return;
    }

    const metricsResponse = await fetchDataAndMetrics(addressToUse);
    if (metricsResponse) {
      setMetrics(metricsResponse.metrics);
    } else {
      console.error('Failed to fetch metrics data.');
    }
  };

  const generateScore = (address: string): number => {
    const hash = hashCode(address);
    const uniqueScore = Math.abs(hash) % 851;
    return uniqueScore;
  };

  const hashCode = (str: string): number => {
    let hash = 0;
    for (let i = 0; str && i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
    }
    return hash;
  };

  return (
    <div className="main-container flex flex-col items-center justify-center min-h-screen bg-white text-center">
      <Head>
        <title>MUP</title>
      </Head>
      <section className="flex flex-col items-center justify-center py-12">
        <div className="mb-6">
          <Image src="/brandlogo.png" alt="brand logo" width={200} height={200} />
        </div>
        <h4 className="text-lg mb-16">Connect wallet or enter address</h4>
        <input
          type="text"
          placeholder=" ENTER ADDRESS"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
          className="text-center p-2 border rounded mb-4"
        />
        <div className="flex items-center justify-center mb-4">
          <button
            onClick={connectWallet}
            className="bg-neorange text-white font-bold py-2 px-4 rounded mr-2"
          >
            Connect Wallet
          </button>
          <button
            onClick={handleGenerateScore}
            className="bg-neorange text-white font-bold py-2 px-4 rounded"
          >
            Generate Score
          </button>
        </div>
        <EthIDAC seed={userAddress} onAccountChange={handleAccountChange} />
        <hr className="border-t border-gray-300 w-full mb-12 mt-12" />
        {generatedScore !== null && (
          <div className={`mb-6 ${getColorForScore(generatedScore)}`}>
            <HexagonScore seed={userAddress.toLowerCase()} generatedScore={generatedScore} />
          </div>
        )}
        {generatedScore !== null && transactions.length > 0 && (
          <ScoreTxns transactions={transactions} overallScore={generatedScore} />
        )}
        {generatedScore !== null && transactions.length === 0 && (
          <p className="text-red-500">No transactions available for the given address.</p>
        )}
        <div className="header container mb-6">
          <h2 className="text-xl font-bold mb-2">iDeFi.AI Insights:</h2>
          <CodeTerminal>{insights}</CodeTerminal>
        </div>
        {flaggedStatus && (
          <div className="header container mb-6">
            <h2 className="text-xl font-bold mb-2">Flagged Status:</h2>
            <p>{flaggedStatus}</p>
          </div>
        )}
        {metrics && (
          <div className="header container mb-6">
            <h2 className="text-xl font-bold mb-2">Metrics:</h2>
            <pre className="text-left">{JSON.stringify(metrics, null, 2)}</pre>
          </div>
        )}
        <div className="flex items-center justify-center mt-4">
          <button
            onClick={fetchAiInsights}
            className="bg-neorange text-white font-bold py-2 px-4 rounded mr-2"
          >
            Fetch AI Insights
          </button>
          <button
            onClick={checkAddressFlaggedStatus}
            className="bg-neohover text-white font-bold py-2 px-4 rounded mr-2"
          >
            Check Flagged Status
          </button>
          <button
            onClick={fetchDataAndMetricsInfo}
            className="bg-neodark text-white font-bold py-2 px-4 rounded"
          >
            Fetch Data and Metrics
          </button>
        </div>
      </section>
    </div>
  );
};

export default DApp;
