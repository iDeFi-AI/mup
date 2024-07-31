// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import web3 from '../../utilities/web3Utils';

interface EthIDACProps {
  seed: string;
  onAccountChange: (account: string | null) => void; // Add a callback prop
}

const EthIDAC: React.FC<EthIDACProps> = ({ seed, onAccountChange }) => {
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    const hash = hashCode(seed);
    const uniqueScore = Math.abs(hash) % 851; // Ensure it's between 0 and 850
    setCurrentScore(uniqueScore);
  }, [seed]);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        if (window.ethereum) {
          // Request account access if not already granted
          await window.ethereum.enable();
        }

        const accounts: string[] | null = await web3.eth.getAccounts();
        const fetchedAccount = accounts?.[0] || null;
        setAccount(fetchedAccount);
        onAccountChange(fetchedAccount); // Call the callback prop
      } catch (error: any) {
        console.error('Error fetching account:', error.message);
      }
    };

    fetchAccount();
  }, []); // Fetch account on component mount

  const hashCode = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
    }
    return hash;
  };

  return (
    <div>
      {account && (
        <div>
          <p>Connected Account: {account}</p>
        </div>
      )}
      {/* You can include additional UI components or information here */}
    </div>
  );
};

export default EthIDAC;
