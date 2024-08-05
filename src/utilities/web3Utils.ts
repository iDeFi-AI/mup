// web3Utils.ts

import Web3 from 'web3';

declare global {
  interface Window {
    ethereum?: any;
  }
}

let web3: Web3;

// Initialize web3 with a fallback provider
if (typeof window !== 'undefined' && window.ethereum !== undefined) {
  // Use MetaMask provider but do not auto-connect
  web3 = new Web3(window.ethereum);
} else {
  // Fallback to a local provider or Infura
  web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/YOUR_INFURA_API_KEY'));
}

// Function to request account access
export const connectWallet = async (): Promise<string | null> => {
  try {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0]; // Return the first account
    } else {
      console.error('MetaMask is not installed');
      return null;
    }
  } catch (error) {
    console.error('Error connecting wallet:', error);
    return null;
  }
};

export default web3;
