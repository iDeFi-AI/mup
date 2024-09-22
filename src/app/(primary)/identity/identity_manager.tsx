// mup/src/components/DidManagementPage.tsx
import React, { useState, useEffect } from 'react';
import { createJWT } from 'did-jwt'; // For creating JWT with DID
import { EthrDID } from 'ethr-did'; // For Ethereum-based DIDs
import { connectWallet, disconnectWallet, signMessage } from '@/utilities/web3Utils'; // Web3 utilities

const DidManagementPage: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [did, setDid] = useState<string | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Connect wallet on component load
  useEffect(() => {
    const initWallet = async () => {
      try {
        const accounts = await connectWallet('MetaMask');
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } catch (err) {
        setError('Failed to connect MetaMask');
      }
    };
    initWallet();
  }, []);

  const handleWalletConnect = async () => {
    try {
      const accounts = await connectWallet('MetaMask');
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setError(null);
      } else {
        setError('No accounts found. Please connect your wallet.');
      }
    } catch (err) {
      setError('Failed to connect wallet.');
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnectWallet();
      setWalletAddress(null);
      setDid(null);
      setJwt(null);
      setError(null);
    } catch (err) {
      setError('Failed to disconnect wallet.');
    }
  };

  const handleCreateDID = async () => {
    try {
      if (!walletAddress) {
        setError('Please connect your wallet first.');
        return;
      }

      // Create EthrDID instance using the wallet address
      const ethrDid = new EthrDID({
        identifier: walletAddress,
        provider: window.ethereum, // Use Web3 provider
        chainNameOrId: 'mainnet', // Specify the Ethereum network
      });

      setDid(ethrDid.did); // Set DID in state
      console.log('Created DID:', ethrDid.did);
    } catch (err: any) {
      setError('Failed to create DID: ' + err.message);
    }
  };

  const handleSignData = async () => {
    try {
      if (!walletAddress || !did) {
        setError('Please create a DID first.');
        return;
      }

      // Message to be signed
      const message = 'Sign this message to authenticate';

      // Sign the message with the connected wallet
      const signature = await signMessage(message);

      // Create a JWT using the DID and signed message
      const jwtToken = await createJWT(
        { sub: did, claim: { message } }, // Payload
        { issuer: did, signer: async () => signature } // Signing function using the wallet signature
      );

      setJwt(jwtToken); // Store the signed JWT
      console.log('Signed JWT:', jwtToken);
    } catch (err: any) {
      setError('Failed to sign data: ' + err.message);
    }
  };

  return (
    <div>
      <h1>DID Management</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Wallet Address: {walletAddress || 'Not connected'}</p>
      <p>DID: {did || 'No DID created yet'}</p>
      <p>JWT: {jwt || 'No JWT created yet'}</p>
      <button onClick={handleWalletConnect} disabled={!!walletAddress}>
        {walletAddress ? 'Wallet Connected' : 'Connect Wallet'}
      </button>
      <button onClick={handleDisconnectWallet} disabled={!walletAddress}>
        Disconnect Wallet
      </button>
      <button onClick={handleCreateDID} disabled={!walletAddress}>
        Create DID
      </button>
      <button onClick={handleSignData} disabled={!did}>
        Sign Data with DID
      </button>
    </div>
  );
};

export default DidManagementPage;
