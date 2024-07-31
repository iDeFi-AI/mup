// web3Utils.ts

import Web3 from 'web3';

declare global {
  interface Window {
    ethereum?: any;
  }
}

let web3: Web3;

if (typeof window !== 'undefined' && window.ethereum !== undefined) {
  // Use MetaMask provider
  window.ethereum.request({ method: 'eth_requestAccounts' });
  web3 = new Web3(window.ethereum);
} else {
  // Fallback to a local provider or Infura
  web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/YOUR_INFURA_API_KEY'));
}

export default web3;
