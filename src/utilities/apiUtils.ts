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
