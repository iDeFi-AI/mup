import Web3 from 'web3';

// Extend the Window interface to include the ethereum property
declare global {
  interface Window {
    ethereum?: any; // Define a broader type for ethereum
  }
}

// Initialize a Web3 instance
let web3: Web3 | null = null;

// Function to connect to the wallet and initialize web3
export const connectWallet = async (): Promise<string | null> => {
  try {
    // Check if the window has ethereum providers
    if (typeof window !== 'undefined' && window.ethereum) {
      // Get all providers
      const providers = window.ethereum.providers || [window.ethereum];

      // Prompt user to select a provider
      const provider = await selectProvider(providers);

      if (provider) {
        // Request account access
        const accounts = await provider.request({ method: 'eth_requestAccounts' });

        // Initialize web3 with the chosen provider
        web3 = new Web3(provider);

        // Return the connected account
        return accounts[0];
      } else {
        console.error('No provider selected');
        return null;
      }
    } else {
      console.error('No Ethereum wallet is installed');
      return null;
    }
  } catch (error) {
    console.error('Error connecting wallet:', error);
    return null;
  }
};

// Function to allow user to select a provider if multiple are available
const selectProvider = async (providers: any[]): Promise<any | null> => {
  for (const provider of providers) {
    // Identify provider types (MetaMask, Coinbase, etc.)
    if (provider.isMetaMask) {
      return provider; // Prefer MetaMask if available
    } else if (provider.isCoinbaseWallet) {
      return provider;
    }
  }
  // Return the first provider if no preferred provider is found
  return providers.length > 0 ? providers[0] : null;
};

// Export the default web3 instance
export default web3;
