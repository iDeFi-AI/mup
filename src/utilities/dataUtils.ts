import { openaiApiKey } from '@/constants/env';
import { storeJsonData } from './firebaseClient';
import { fetchEtherscanData, checkFlaggedAddress } from './apiUtils';

interface Transaction {
  timestamp: string;
  type: 'Sent' | 'Received';
  cryptocurrency: string;
  usdAmount: number;
  thirdPartyWallet: string;
  flagged: boolean;
}

// Function to fetch data for a specified cryptocurrency
export const fetchData = async (address: string, cryptocurrency: string): Promise<Transaction[] | null> => {
  switch (cryptocurrency.toLowerCase()) {
    case 'eth':
      return fetchEtherscanData(address);
    // case 'btc':  // Uncomment and implement if BTC support is added
    //   return fetchBlockCypherData(address);
    default:
      console.error('Unsupported cryptocurrency');
      return null;
  }
};

// Generate the OpenAI prompt for relationship analysis and recommendations
export const generateOpenAIPrompt = (
  userAddress: string,
  transactions: Transaction[],
  status: string // Pass or Fail
): string => {
  // Default to an empty array if transactions is undefined
  const limitedTransactions = (transactions || []).slice(0, 10); // Limit transactions to avoid token issues

  const transactionDetails = limitedTransactions
    .map(
      (txn, index) =>
        `Transaction ${index + 1} - ${txn.type}: ${txn.usdAmount} USD involving ${txn.thirdPartyWallet}.`
    )
    .join('\n');

  const prompt = `
    Analyze the Ethereum address ${userAddress} to identify patterns and relationships with other unique addresses found in the transaction details.
    Focus on mapping out transaction patterns and identifying potential malicious activities.
    Based on the status of FAIL OR PASS (${status}), provide recommendations for improving security and transaction practices.
    IF the status is FAIL, indicate to not transact or interact with the address.
    ${transactionDetails}
  `;

  console.log('Generated OpenAI Prompt:', prompt);

  return prompt;
};

// Function to generate insights using OpenAI
export const generateInsights = async (
  userAddress: string,
  transactions: Transaction[],
  status: string // Pass or Fail
): Promise<string | null> => {
  try {
    // Ensure transactions is not undefined
    const txns = transactions || [];
    
    const openAIPrompt = generateOpenAIPrompt(userAddress, txns, status);

    const payload = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Provide insights and recommendations for Ethereum address ${userAddress}. Consider the security status of PASS or FAIL: ${status}`,
        },
        { role: 'user', content: openAIPrompt },
      ],
    };

    console.log('Request payload:', payload);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', response.status);
    const responseData = await response.json();
    console.log('Response data:', responseData);

    if (responseData.choices && responseData.choices.length > 0) {
      const insightsText = responseData.choices[0]?.message?.content;

      console.log('Insights:', insightsText);

      if (insightsText !== undefined && insightsText !== null) {
        await storeJsonData({
          insights: insightsText,
          timestamp: Date.now(),
          userAddress,
        });
        return insightsText;
      } else {
        console.error('Insights text is undefined or null.');
        return null;
      }
    } else {
      console.error('No insights available.');
      return null;
    }
  } catch (error) {
    console.error('Error generating insights:', error);
    return null;
  }
};

// Fetch data and metrics (not used if you directly call checkFlaggedAddress)
export const fetchDataAndMetrics = async (address: string) => {
  try {
    const response = await fetch(
      `https://api.idef.ai/api/get_data_and_metrics?address=${address}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data and metrics:', error);
    return null;
  }
};
