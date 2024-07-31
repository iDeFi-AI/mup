import axios from 'axios';

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
