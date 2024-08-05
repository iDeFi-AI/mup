import axios from 'axios';

// Fetch transactions from the backend API
export const fetchTransactionsFromApi = async (address: string) => {
  try {
    const response = await axios.get('/api/fetch-transactions', {
      params: { address },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return null;
  }
};

// Check if the address is flagged
export const checkFlaggedAddress = async (address: string) => {
  try {
    const response = await axios.get('/api/check-flagged-address', {
      params: { address },
    });
    return response.data;
  } catch (error) {
    console.error('Error checking flagged address:', error);
    return null;
  }
};

// Fetch data and metrics from the backend API
export const fetchDataAndMetrics = async (address: string) => {
  try {
    const response = await axios.get('/api/get_data_and_metrics', {
      params: { address },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data and metrics:', error);
    return null;
  }
};

// Quantum API: Perform quantum risk analysis
export const quantumRiskAnalysis = async (portfolio: any) => {
  try {
    const response = await axios.get('/api/quantum', {
      params: { action: 'quantumRiskAnalysis', portfolio: JSON.stringify(portfolio) },
    });
    return response.data;
  } catch (error) {
    console.error('Error performing quantum risk analysis:', error);
    return null;
  }
};

// Quantum API: Perform portfolio optimization
export const portfolioOptimization = async (portfolio: any) => {
  try {
    const response = await axios.get('/api/quantum', {
      params: { action: 'portfolioOptimization', portfolio: JSON.stringify(portfolio) },
    });
    return response.data;
  } catch (error) {
    console.error('Error performing portfolio optimization:', error);
    return null;
  }
};

// Quantum API: Compile and run a QASM file
export const compileAndRunQASM = async (filename: string, useIBMBackend: boolean = false) => {
  try {
    const response = await axios.get('/api/quantum', {
      params: { action: 'compileAndRunQASM', filename, useIBMBackend: useIBMBackend.toString() },
    });
    return response.data;
  } catch (error) {
    console.error('Error compiling and running QASM:', error);
    return null;
  }
};

// Quantum API: Initialize quantum memory
export const initializeQuantumMemory = async () => {
  try {
    const response = await axios.get('/api/quantum', {
      params: { action: 'initializeQuantumMemory' },
    });
    return response.data;
  } catch (error) {
    console.error('Error initializing quantum memory:', error);
    return null;
  }
};

// Quantum API: Store a quantum state in memory
export const storeQuantumStateInMemory = async (state: string) => {
  try {
    const response = await axios.get('/api/quantum', {
      params: { action: 'storeQuantumStateInMemory', state },
    });
    return response.data;
  } catch (error) {
    console.error('Error storing quantum state in memory:', error);
    return null;
  }
};

// Quantum API: Retrieve the quantum state from memory
export const retrieveQuantumStateFromMemory = async () => {
  try {
    const response = await axios.get('/api/quantum', {
      params: { action: 'retrieveQuantumStateFromMemory' },
    });
    return response.data;
  } catch (error) {
    console.error('Error retrieving quantum state from memory:', error);
    return null;
  }
};
