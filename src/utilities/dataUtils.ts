import { openaiApiKey } from '@/constants/env';
import { storeJsonData } from './firebaseClient';

interface Transaction {
  timestamp: string;
  type: 'Sent' | 'Received';
  cryptocurrency: string;
  thirdPartyIdacScore: number;
  usdAmount: number;
  thirdPartyWallet: string;
}

export const fetchData = async (address: string, cryptocurrency: string): Promise<Transaction[] | null> => {
  switch (cryptocurrency.toLowerCase()) {
    case 'eth':
      return fetchEtherscanData(address);
    case 'btc':
      return fetchBlockCypherData(address);
    default:
      console.error('Unsupported cryptocurrency');
      return null;
  }
};

export const fetchEtherscanData = async (address: string): Promise<Transaction[] | null> => {
  try {
    const ethApiKey = 'QEX6DGCMDRPXRU89FKPUR4BG9AUMCR4FXD';
    const ethUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ethApiKey}`;
    const ethResponse = await fetch(ethUrl);
    const ethData = await ethResponse.json();

    if (ethData.status === '1') {
      const transactions = ethData.result.map((tx: any) => ({
        timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
        type: address.toLowerCase() === tx.from.toLowerCase() ? 'Sent' : 'Received',
        cryptocurrency: 'ETH',
        thirdPartyIdacScore: Math.floor(Math.random() * 1000),
        usdAmount: parseFloat(tx.value) / 1e18,
        thirdPartyWallet: address.toLowerCase() === tx.from.toLowerCase() ? tx.to : tx.from,
      }));

      return transactions;
    } else {
      console.error('Error fetching Etherscan data:', ethData.message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching Etherscan data:', error);
    return []; 
  }
};

export const fetchBlockCypherData = async (address: string): Promise<Transaction[] | null> => {
  try {
    const btcApiKey = openaiApiKey; 
    const btcUrl = `https://api.blockcypher.com/v1/btc/main/addrs/${address}/full?token=${btcApiKey}`;
    const btcResponse = await fetch(btcUrl);
    const btcData = await btcResponse.json();

    if (!btcData.error) {
      const transactions = btcData.txs.map((tx: any) => ({
        timestamp: new Date(tx.received).toISOString(),
        type: address.toLowerCase() === tx.inputs[0].addresses[0].toLowerCase() ? 'Sent' : 'Received',
        cryptocurrency: 'BTC',
        thirdPartyIdacScore: Math.floor(Math.random() * 1000),
        usdAmount: tx.outputs.reduce((sum: number, output: any) => sum + output.value, 0) / 1e8,
        thirdPartyWallet: address.toLowerCase() === tx.inputs[0].addresses[0].toLowerCase() ? tx.outputs[0].addresses[0] : tx.inputs[0].addresses[0],
      }));

      return transactions;
    } else {
      console.error('Error fetching BlockCypher data:', btcData.error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching BlockCypher data:', error);
    return []; 
  }
};

export const generateOpenAIPrompt = (userAddress: string, otherAddress: string, transactions: Transaction[], generatedScore: number): string => {
  const transactionDetails = transactions.map((txn, index) => (
    `Transaction ${index + 1} - ${txn.type}: ${txn.usdAmount} USD involving ${txn.thirdPartyWallet}. iDAC Trust Score for ${txn.thirdPartyWallet}: ${txn.thirdPartyIdacScore}`
  )).join('\n');

  const iDACScoreCategories = `
    iDAC Scoring Logic:
    Excellent Score (Score >= 850),
    Good Score (740 <= Score < 850),
    Fair Score (670 <= Score < 740),
    Poor Score (580 <= Score < 670),
    Bad Actor Score (450 <= Score < 580),
    New/No Score (Score < 450)
  `;

  const prompt = `
    Analyze iDAC Trust Score for Ethereum address ${userAddress} to identify potential malicious activities.
    Provide insights for the relationship between addresses ${userAddress} and ${otherAddress}.
    iDAC Trust Score: ${generatedScore}.
    ${transactionDetails}
    ${iDACScoreCategories}
  `;

  console.log('Generated OpenAI Prompt:', prompt);

  return prompt;
};

export const generateInsights = async (userAddress: string, otherAddress: string, openAIPrompt: string, generatedScore: number | null): Promise<string | null> => {
  try {
    const payload = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: `Provide iDAC Trust Score ${generatedScore} for Ethereum address ${userAddress} to identify potential malicious activities. Consider data associated with ${otherAddress}` },
        { role: 'user', content: `Please provide additional insights into the transactions for relationship between Ethereum addresses ${userAddress} and ${otherAddress}.` },
        { role: 'assistant', content: openAIPrompt },
      ],
    };

    console.log('Request payload:', payload);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
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
        await storeJsonData({ insights: insightsText, timestamp: Date.now(), userAddress });
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

// Fetch data and metrics
export const fetchDataAndMetrics = async (address: string) => {
  try {
    const response = await fetch(`https://api.idef.ai/api/get_data_and_metrics?address=${address}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data and metrics:', error);
    return null;
  }
};
