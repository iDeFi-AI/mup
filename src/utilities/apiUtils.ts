import axios from 'axios';

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

// Fetch transactions and metrics from the backend API (iDefi API)
export const fetchDataAndMetrics = async (address: string) => {
  try {
    const response = await axios.get('/api/endpoints', {
      params: { endpoint: 'data_and_metrics', address },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data and metrics:', error);
    throw new Error('Failed to fetch data and metrics.');
  }
};

// Fetch data and metrics (including capital gains) from the backend API
export const fetchCapitalGainsMetrics = async (address: string) => {
  try {
    const response = await axios.get('/api/endpoints', {
      params: { endpoint: 'data_and_metrics', address },
    });
    return response.data.metrics.capitalGains;  // Assuming 'capitalGains' is part of the 'metrics'
  } catch (error) {
    console.error('Error fetching capital gains metrics:', error);
    throw error;
  }
};

// Configure the beneficiary for a given wallet address
export const configureBeneficiary = async (walletAddress: string, beneficiaryAddress: string) => {
  try {
    const response = await axios.post('/api/endpoints', {
      endpoint: 'configure_beneficiary', // Assuming you have an endpoint for this
      walletAddress,
      beneficiaryAddress,
    });
    return response.data;
  } catch (error) {
    console.error('Error configuring beneficiary:', error);
    throw error;
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
    throw new Error('Failed to fetch transaction summary.');
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
    throw new Error('Failed to check flagged address.');
  }
};

// Fetch transactions from Etherscan directly
export const fetchEtherscanData = async (address: string): Promise<Transaction[]> => {
  const ethApiKey = 'QEX6DGCMDRPXRU89FKPUR4BG9AUMCR4FXD';
  const ethUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ethApiKey}`;

  try {
    const ethResponse = await axios.get(ethUrl);
    const ethData = ethResponse.data;

    if (ethData.status === '1') {
      return ethData.result.map((tx: any, index: number) => ({
        id: tx.hash || index.toString(),
        timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
        type: address.toLowerCase() === tx.from.toLowerCase() ? 'Sent' : 'Received',
        cryptocurrency: 'ETH',
        usdAmount: parseFloat(tx.value) / 1e18,
        thirdPartyWallet: address.toLowerCase() === tx.from.toLowerCase() ? tx.to : tx.from,
        flagged: false,
        risk: mapRiskLevel(tx.risk || 'None'),
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
    throw new Error('Failed to check multiple addresses.');
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
    throw new Error('Failed to analyze transactions.');
  }
};

// Monitor address (new function)
export const monitorAddress = async (address: string) => {
  try {
    const response = await axios.post('/api/endpoints', {
      endpoint: 'monitor_address',
      address,
    });
    return response.data;
  } catch (error) {
    console.error('Error monitoring address:', error);
    throw new Error('Failed to monitor the address.');
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
    // Sending POST request to Next.js API route
    const response = await axios.post('/api/endpoints', {
      endpoint: 'visualize_dataset',
      source_type: sourceType,
      address,
      filename,
      max_nodes: maxNodes,
    });

    return response.data;
  } catch (error) {
    console.error('Error visualizing dataset:', error);
    throw new Error('Failed to visualize dataset.');
  }
};


/**
 * Quantum API Integration (internal routing to quantum API)
 */
export const quantumRiskAnalysis = async (portfolio: any) => {
  try {
    const response = await axios.post('/api/quantum', {
      endpoint: 'quantumRiskAnalysis',
      portfolio,
    });
    return response.data;
  } catch (error) {
    console.error('Error during quantum risk analysis:', error);
    throw new Error('Failed to perform quantum risk analysis.');
  }
};

export const portfolioOptimization = async (portfolio: any) => {
  try {
    const response = await axios.post('/api/quantum', {
      endpoint: 'portfolioOptimization',
      portfolio,
    });
    return response.data;
  } catch (error) {
    console.error('Error during portfolio optimization:', error);
    throw new Error('Failed to optimize portfolio.');
  }
};

export const compileAndRunQASM = async (filename: string, useIBMBackend: boolean) => {
  try {
    const response = await axios.post('/api/quantum', {
      endpoint: 'compileAndRunQASM',
      filename,
      useIBMBackend,
    });
    return response.data;
  } catch (error) {
    console.error('Error compiling and running QASM:', error);
    throw new Error('Failed to compile and run QASM.');
  }
};

export const storeQuantumStateInMemory = async (state: string) => {
  try {
    const response = await axios.post('/api/quantum', {
      endpoint: 'storeQuantumStateInMemory',
      state,
    });
    return response.data;
  } catch (error) {
    console.error('Error storing quantum state in memory:', error);
    throw new Error('Failed to store quantum state in memory.');
  }
};

export const retrieveQuantumStateFromMemory = async () => {
  try {
    const response = await axios.post('/api/quantum', {
      endpoint: 'retrieveQuantumStateFromMemory',
    });
    return response.data;
  } catch (error) {
    console.error('Error retrieving quantum state from memory:', error);
    throw new Error('Failed to retrieve quantum state from memory.');
  }
};

/**
 * Agent API Integrations
 */

/// Create a new agent
export const createAgent = async (agentName: string) => {
  try {
    const response = await axios.post('/api/agents', {
      endpoint: 'create_agent',
      agentName,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating agent:', error);
    throw new Error('Failed to create agent.');
  }
};

// Assign endpoints to an agent
export const assignEndpointsToAgent = async (agentName: string, endpoints: string[]) => {
  try {
    const response = await axios.post('/api/agents', {
      endpoint: 'assign_endpoints',
      agent_name: agentName,
      endpoints,
    });
    return response.data;
  } catch (error) {
    console.error('Error assigning endpoints to agent:', error);
    throw new Error('Failed to assign endpoints.');
  }
};

// Fetch agent status
export const fetchAgentStatus = async (agentName: string) => {
  try {
    const response = await axios.get('/api/agents', {
      params: { agentName, endpoint: 'status' },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching agent status:', error);
    throw new Error('Failed to fetch agent status.');
  }
};

// Fetch agents by category
export const fetchAgentsByCategory = async (category: string) => {
  try {
    const response = await axios.get('/api/agents', {
      params: { category, endpoint: 'get_agents_by_category' },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching agents by category:', error);
    throw new Error('Failed to fetch agents by category.');
  }
};
