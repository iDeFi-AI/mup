import React, { useEffect, useState } from "react";
import { connectWallet, syncWalletData } from "@/utilities/web3Utils";
import { fetchDataAndMetrics } from "@/utilities/apiUtils"; // Example utility from provided script
import WalletSelectionModal from "@/components/wallets"; // Import WalletSelectionModal

const CommunicationHub: React.FC = () => {
  const [address, setAddress] = useState<string | null>(null); // Wallet address state
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state for fetching data
  const [connected, setConnected] = useState<boolean>(false); // Wallet connected state
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false); // Wallet selection modal

  // Function to handle wallet connection
  const handleConnectWallet = (providerName: string) => {
    setLoading(true); // Set loading when connecting wallet
    connectWallet(providerName)
      .then((accounts) => {
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]); // Set the connected wallet address
          syncWalletData(accounts); // Sync wallet data if necessary
          setConnected(true);
          setShowWalletModal(false); // Close the wallet selection modal
        }
      })
      .catch((error) => {
        console.error("Error connecting to wallet:", error);
        setConnected(false);
      })
      .finally(() => {
        setLoading(false); // Stop loading once connection is complete
      });
  };

  // Fetch data and metrics when the wallet is connected
  useEffect(() => {
    if (address) {
      setLoading(true); // Start loading when fetching data
      fetchDataAndMetrics(address)
        .then((response) => {
          setData(response);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }
  }, [address]);

  return (
    <div className="main-content bg-background-color flex flex-col items-center text-center p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Communication Hub</h1>

      {!connected ? (
        <div>
          <button
            onClick={() => setShowWalletModal(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="card bg-white shadow rounded-lg p-6 w-full max-w-3xl">
          {loading ? (
            <p>Loading data...</p>
          ) : data ? (
            <div>
              <p>Your account: {address}</p>
              <p>Data fetched for your communication needs:</p>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          ) : (
            <p>No data available for this address.</p>
          )}
        </div>
      )}

      {showWalletModal && (
        <WalletSelectionModal
          onSelect={handleConnectWallet}
          onClose={() => setShowWalletModal(false)}
        />
      )}
    </div>
  );
};

export default CommunicationHub;
