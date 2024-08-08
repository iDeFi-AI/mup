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
        <div className="summary mb-6">
          <p>
            Flagged Interactions:{" "}
            {summary.number_of_interactions_with_flagged_addresses}
          </p>
          <p>Risky Transactions: {summary.number_of_risky_transactions}</p>
          <p>Total Value: ${summary.total_value.toFixed(2)}</p>
          <p>Dates Involved: {summary.all_dates_involved.join(", ")}</p>
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
