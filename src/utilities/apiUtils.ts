import axios from "axios";

// Define the Transaction type to use consistently
export interface Transaction {
  id: string;
  timestamp: string;
  type: 'Sent' | 'Received';
  cryptocurrency: string;
  usdAmount: number;
  thirdPartyWallet: string;
  flagged: boolean;
  risk: 'High' | 'Medium' | 'Low' | 'None';
}

// Utility function to validate Ethereum address
export const isValidAddress = (address: string) => {
  const ethRegExp = /^(0x)?[0-9a-fA-F]{40}$/;
  return ethRegExp.test(address);
};

// Map risk level to one of the specific string literals
const mapRiskLevel = (risk: string): 'High' | 'Medium' | 'Low' | 'None' => {
  switch (risk.toLowerCase()) {
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Low';
    case 'none':
    default:
      return 'None';
  }
};

// Fetch transactions and metrics from the backend API
export const fetchDataAndMetrics = async (address: string) => {
  try {
    const response = await axios.get('/api/endpoints', {
      params: { endpoint: 'get_data_and_metrics', address },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data and metrics:', error);
    return null;
  }
};

// Fetch transaction summary from the backend API
export const fetchTransactionSummary = async (address: string) => {
  try {
    const response = await axios.post('/api/endpoints', {
      endpoint: 'transaction_summary',
      address,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction summary:', error);
    return null;
  }
};


// Check if the address is flagged
export const checkFlaggedAddress = async (address: string) => {
  try {
    const response = await axios.get('/api/endpoints', {
      params: { endpoint: 'checkaddress', address },
    });
    return response.data;
  } catch (error) {
    console.error('Error checking flagged address:', error);
    return null;
  }
};

// Fetch transactions from Etherscan directly
export const fetchEtherscanData = async (
  address: string
): Promise<Transaction[]> => {
  const ethApiKey = 'QEX6DGCMDRPXRU89FKPUR4BG9AUMCR4FXD';
  const ethUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ethApiKey}`;

  try {
    const ethResponse = await axios.get(ethUrl);
    const ethData = ethResponse.data;

    if (ethData.status === '1') {
      return ethData.result.map((tx: any, index: number) => ({
        id: tx.hash || index.toString(), // Use transaction hash as ID or index as fallback
        timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
        type: address.toLowerCase() === tx.from.toLowerCase() ? 'Sent' : 'Received',
        cryptocurrency: 'ETH',
        usdAmount: parseFloat(tx.value) / 1e18,
        thirdPartyWallet: address.toLowerCase() === tx.from.toLowerCase() ? tx.to : tx.from,
        flagged: false,
        risk: mapRiskLevel(tx.risk || 'None'), // Ensure the risk is mapped correctly
      }));
    } else {
      console.error('Error fetching Etherscan data:', ethData.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching Etherscan data:', error);
    return [];
  }
};

// Check multiple addresses for flagged or suspicious activities
export const checkMultipleAddresses = async (addresses: string[]) => {
  try {
    const response = await axios.post('/api/endpoints', {
      endpoint: 'check_multiple_addresses',
      addresses,
    });
    return response.data;
  } catch (error) {
    console.error('Error checking multiple addresses:', error);
    return null;
  }
};

// Analyze transactions with the backend API
export const analyzeTransactions = async (address: string, transactions: Transaction[]) => {
  try {
    const response = await axios.post('/api/endpoints', {
      endpoint: 'analyze_transactions',
      address,
      transactions,
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing transactions:', error);
    return null;
  }
};

/**
 * Function to visualize a dataset either from an Ethereum address, local file, or Firebase.
 * @param sourceType - 'local', 'firebase', or 'address'
 * @param address - Ethereum address to visualize if applicable
 * @param filename - Filename for Firebase or local source
 * @param maxNodes - Maximum number of nodes to display
 */
export const visualizeDataset = async ({
  sourceType,
  address = null,
  filename = null,
  maxNodes = null,
}: {
  sourceType: 'local' | 'firebase' | 'address',
  address?: string | null,
  filename?: string | null,
  maxNodes?: number | null,
}) => {
  try {
    const response = await axios.post('/api/visualize_dataset', {
      source_type: sourceType,
      address,
      filename,
      max_nodes: maxNodes,
    });

    return response.data;
  } catch (error) {
    console.error('Error visualizing dataset:', error);
    return { error: 'Failed to visualize dataset' };
  }
};


