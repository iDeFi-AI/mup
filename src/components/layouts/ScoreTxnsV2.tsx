import React, { useEffect, useState } from "react";
import axios from "axios";

// Define the base URL for the iDeFi API
const IDEFI_API_BASE_URL = 'https://api.idefi.ai';
const ETHERSCAN_API_BASE_URL = 'https://api.etherscan.io/api';
const ETHERSCAN_API_KEY = 'QEX6DGCMDRPXRU89FKPUR4BG9AUMCR4FXD';

// Define types for transaction data and summary
type TransactionType = "Sent" | "Received";

interface Transaction {
  id: string;
  timestamp: string;
  type: TransactionType;
  cryptocurrency: string;
  usdAmount: number;
  thirdPartyWallet: string;
  flagged: boolean;
  risk: "High" | "Medium" | "Low" | "None";
}

interface TransactionSummary {
  number_of_interactions_with_flagged_addresses: number;
  number_of_risky_transactions: number;
  total_value: number;
  all_dates_involved: string[];
}

interface CheckAddressResult {
  address: string;
  status: "Fail" | "Pass" | "Warning";
  description?: string;
}

interface ScoreTxnsV2Props {
  transactions: Transaction[];
}

// Function to fetch transaction summary from the iDeFi API
const fetchTransactionSummary = async (address: string): Promise<TransactionSummary> => {
  try {
    const response = await axios.get(`${IDEFI_API_BASE_URL}/api/transaction_summary`, {
      params: { address },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction summary:", error);
    throw new Error("Failed to fetch transaction summary.");
  }
};

// Function to check multiple addresses for flagged status from the iDeFi API
const checkMultipleAddresses = async (addresses: string[]): Promise<CheckAddressResult[]> => {
  try {
    const response = await axios.post(`${IDEFI_API_BASE_URL}/api/check_multiple_addresses`, {
      addresses,
    });
    return response.data;
  } catch (error) {
    console.error("Error checking multiple addresses:", error);
    throw new Error("Failed to check multiple addresses.");
  }
};

// Function to fetch Etherscan data
const fetchEtherscanData = async (address: string): Promise<Transaction[]> => {
  const etherscanUrl = `${ETHERSCAN_API_BASE_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`;

  try {
    const response = await axios.get(etherscanUrl);
    const ethData = response.data;

    if (ethData.status === '1') {
      return ethData.result.map((tx: any, index: number) => ({
        id: tx.hash || index.toString(),
        timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
        type: address.toLowerCase() === tx.from.toLowerCase() ? 'Sent' : 'Received',
        cryptocurrency: 'ETH',
        usdAmount: parseFloat(tx.value) / 1e18,
        thirdPartyWallet: address.toLowerCase() === tx.from.toLowerCase() ? tx.to : tx.from,
        flagged: false,
        risk: 'None',
      }));
    } else {
      console.error('Error fetching Etherscan data:', ethData.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching Etherscan data:', error);
    throw new Error('Failed to fetch Etherscan data.');
  }
};

const ScoreTxnsV2: React.FC<ScoreTxnsV2Props> = ({ transactions }) => {
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [updatedTransactions, setUpdatedTransactions] = useState<Transaction[]>([]);
  const [status, setStatus] = useState<"Fail" | "Pass" | "Warning" | null>(null);

  useEffect(() => {
    const fetchSummaryData = async () => {
      if (transactions.length > 0) {
        const primaryAddress = transactions[0].thirdPartyWallet;
        const addresses = transactions.map((tx) => tx.thirdPartyWallet);

        try {
          // Fetch transaction summary for the primary wallet address
          const summaryData = await fetchTransactionSummary(primaryAddress);
          if (summaryData) {
            setSummary(summaryData);
          }

          // Check multiple addresses for flagged status
          const checkResults = await checkMultipleAddresses(addresses);

          if (checkResults && Array.isArray(checkResults)) {
            // Determine the status based on the root, parent, and child addresses
            const primaryCheckResult = checkResults.find(
              (result: CheckAddressResult) =>
                result.address.toLowerCase() === primaryAddress.toLowerCase()
            );
            const parentOrChildFail = checkResults.some(
              (result: CheckAddressResult) =>
                result.address.toLowerCase() !== primaryAddress.toLowerCase() &&
                result.status === "Fail"
            );

            if (primaryCheckResult?.status === "Fail") {
              setStatus("Fail");
            } else if (parentOrChildFail) {
              setStatus("Warning");
            } else {
              setStatus("Pass");
            }

            // Update transactions with flagged info from backend
            const newTransactions = transactions.map((tx) => ({
              ...tx,
              flagged: checkResults.some(
                (result: CheckAddressResult) =>
                  result?.address?.toLowerCase() === tx.thirdPartyWallet.toLowerCase() &&
                  result?.status === "Fail"
              ),
            }));
            setUpdatedTransactions(newTransactions);
          }
        } catch (error) {
          console.error("Error fetching summary data:", error);
        }
      }
    };

    fetchSummaryData();
  }, [transactions]);

  const getStatus = (transaction: Transaction) => {
    return transaction.flagged ? "Fail" : "Pass";
  };

  const renderSummary = () => {
    if (status === "Pass" && summary) {
      return (
        <div className="summary-card bg-white shadow-md rounded-lg p-6 mb-6">
          <p className="text-lg text-green-500">This address has passed all checks.</p>
        </div>
      );
    } else if (status === "Fail" && summary) {
      return (
        <div className="summary-card bg-white shadow-md rounded-lg p-6 mb-6">
          <p className="text-lg">
            Flagged Interactions:{" "}
            <span className="font-medium text-danger-color">
              {summary.number_of_interactions_with_flagged_addresses}
            </span>
          </p>
          <p className="text-lg">
            Risky Transactions:{" "}
            <span className="font-medium text-warning-color">
              {summary.number_of_risky_transactions}
            </span>
          </p>
          <p className="text-lg">
            Total Value:{" "}
            <span className="font-medium text-success-color">
              ${summary.total_value.toFixed(2)}
            </span>
          </p>
          <p className="text-lg">
            Dates Involved:{" "}
            <span className="font-medium">{summary.all_dates_involved.join(", ")}</span>
          </p>
        </div>
      );
    } else if (status === "Warning" && summary) {
      return (
        <div className="summary-card bg-yellow-200 shadow-md rounded-lg p-6 mb-6">
          <p className="text-lg text-yellow-800">
            This address has indirect interactions with flagged addresses.
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="score-transactions w-full max-w-lg mx-auto my-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Transaction History</h2>
      {renderSummary()}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Amount</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Involved Address</th>
            </tr>
          </thead>
          <tbody>
            {updatedTransactions.map((txn, index) => (
              <tr
                key={index}
                className={`text-center ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <td className="py-2 px-4 border-b">
                  {new Date(txn.timestamp).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">{txn.type}</td>
                <td className="py-2 px-4 border-b">
                  ${txn.usdAmount.toFixed(2)}
                </td>
                <td className="py-2 px-4 border-b">
                  <span
                    className={
                      getStatus(txn) === "Pass"
                        ? "text-green-500 font-bold"
                        : "text-red-500 font-bold"
                    }
                  >
                    {getStatus(txn)}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">{txn.thirdPartyWallet}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScoreTxnsV2;
