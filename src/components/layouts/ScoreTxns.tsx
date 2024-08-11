import React, { useEffect, useState } from "react";
import {
  checkMultipleAddresses,
  fetchTransactionSummary,
} from "@/utilities/apiUtils";

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
  status: "Fail" | "Pass";
  description?: string;
}

interface ScoreTxnsProps {
  transactions: Transaction[];
}

const ScoreTxns: React.FC<ScoreTxnsProps> = ({ transactions }) => {
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [updatedTransactions, setUpdatedTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchSummaryData = async () => {
      if (transactions.length > 0) {
        const addresses = transactions.map((tx) => tx.thirdPartyWallet);
        try {
          // Fetch transaction summary for the primary wallet address in the transactions list
          const summaryData = await fetchTransactionSummary(transactions[0].thirdPartyWallet);
          if (summaryData) {
            setSummary(summaryData);
          }

          // Check multiple addresses for flagged status
          const checkResults = await checkMultipleAddresses(addresses);

          if (checkResults && Array.isArray(checkResults)) {
            console.log("Multiple Addresses Check Results:", checkResults);

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
          } else {
            console.error("Check results are not in expected format:", checkResults);
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

  return (
    <div className="score-transactions w-full max-w-lg mx-auto my-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Transaction History
      </h2>
      {summary && (
        <div className="summary-card bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="summary-item flex items-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-primary-color mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A3.375 3.375 0 117.21 6.902a3.375 3.375 0 01-2.09 10.902z"
              />
            </svg>
            <p className="text-lg">
              Flagged Interactions:{" "}
              <span className="font-medium text-danger-color">
                {summary.number_of_interactions_with_flagged_addresses}
              </span>
            </p>
          </div>
          <div className="summary-item flex items-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-primary-color mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM4.75 4.75l7.25 7.25m5.25-1.5V19.25c0 .414-.336.75-.75.75h-9a.75.75 0 01-.75-.75V9.25"
              />
            </svg>
            <p className="text-lg">
              Risky Transactions:{" "}
              <span className="font-medium text-warning-color">
                {summary.number_of_risky_transactions}
              </span>
            </p>
          </div>
          <div className="summary-item flex items-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-primary-color mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 1.5a3 3 0 013 3v2a3 3 0 01-3 3H3.75A1.75 1.75 0 002 11.25V20.5a1.5 1.5 0 001.5 1.5h9a3 3 0 003-3v-1.75A3.75 3.75 0 0117.25 14H22m-10-5.25V3.5"
              />
            </svg>
            <p className="text-lg">
              Total Value:{" "}
              <span className="font-medium text-success-color">
                ${summary.total_value.toFixed(2)}
              </span>
            </p>
          </div>
          <div className="summary-item flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-primary-color mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2m-4-2a8.001 8.001 0 01-6.5 3.25A8 8 0 0112 4.5V12z"
              />
            </svg>
            <p className="text-lg">
              Dates Involved:{" "}
              <span className="font-medium">{summary.all_dates_involved.join(", ")}</span>
            </p>
          </div>
        </div>
      )}
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
                className={`text-center ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
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

export default ScoreTxns;
