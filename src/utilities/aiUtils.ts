import { openaiApiKey } from '@/constants/env';
import { storeJsonData } from './firebaseClient';
import { fetchEtherscanData } from './apiUtils';

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }

  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };

  var webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };

  interface SpeechRecognition {
    start(): void;
    stop(): void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
  }
}

// Voice-to-Text and Text-to-Voice Setup
let speechSynthesis = typeof window !== 'undefined' && window.speechSynthesis;
let recognition: SpeechRecognition | null = null;

if (typeof window !== 'undefined') {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = SpeechRecognition ? new SpeechRecognition() : null;
}

// Interface for a transaction
interface Transaction {
  timestamp: string;
  type: 'Sent' | 'Received';
  cryptocurrency: string;
  usdAmount: number;
  thirdPartyWallet: string;
  flagged: boolean;
}

// Function to fetch cryptocurrency data for a given address
export const fetchData = async (address: string, cryptocurrency: string): Promise<Transaction[] | null> => {
  try {
    switch (cryptocurrency.toLowerCase()) {
      case 'eth':
        return fetchEtherscanData(address);
      default:
        console.error('Unsupported cryptocurrency');
        return null;
    }
  } catch (error) {
    console.error('Error fetching transaction data:', error);
    return null;
  }
};

// Function to convert text to voice (Text-to-Speech)
export const textToVoice = (text: string) => {
  if (!speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.1; // Speed of the speech
  speechSynthesis.speak(utterance);
};

// Function to start listening (Voice-to-Text)
export const startListening = (onResult: (transcript: string) => void) => {
  if (!recognition) return;

  recognition.start();
  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };
  
  recognition.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error);
  };
};

// Generate OpenAI prompt for analyzing cryptocurrency transactions
export const generateOpenAIPrompt = (
  userAddress: string,
  transactions: Transaction[],
  status: string // Pass, Fail, or Warning
): string => {
  const limitedTransactions = transactions.slice(0, 10); // Limit transactions for API
  const transactionDetails = limitedTransactions
    .map((txn, index) => `Transaction ${index + 1}: ${txn.type} of ${txn.usdAmount} USD with ${txn.thirdPartyWallet}. Status: ${txn.flagged ? 'Flagged' : 'Safe'}.`)
    .join('\n');

  return `
    You are analyzing the Ethereum address: ${userAddress}.
    Here are key areas to focus on:

    1. **Security Check**: Look for malicious activities.
    2. **Financial Roadmap**: Analyze transaction history for trends.
    3. **Financial Health**: Evaluate holdings and suggest diversification.
    4. **Wallet Visualization**: Create a conceptual wallet overview.

    **Transaction Details**:
    ${transactionDetails}
  `;
};

// Function to call OpenAI with a structured payload
export const callOpenAI = async (prompt: string): Promise<string | null> => {
  const payload = {
    model: 'gpt-4', // Switch to different models if necessary
    messages: [
      {
        role: 'system',
        content: 'You are a crypto asset expert providing analysis.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    if (responseData.choices && responseData.choices.length > 0) {
      return responseData.choices[0]?.message?.content || null;
    } else {
      console.error('No response from OpenAI.');
      return null;
    }
  } catch (error) {
    console.error('Error in OpenAI API call:', error);
    return null;
  }
};

// Generate insights based on transaction analysis
export const generateInsights = async (
  userAddress: string,
  transactions: Transaction[],
  status: string
): Promise<string | null> => {
  const prompt = generateOpenAIPrompt(userAddress, transactions, status);
  const insights = await callOpenAI(prompt);

  if (insights) {
    // Store insights in Firebase
    await storeJsonData({
      insights,
      timestamp: Date.now(),
      userAddress,
    });
  }

  return insights;
};

// Handle voice commands to interact with OpenAI
export const handleVoiceCommand = async (transcript: string): Promise<void> => {
  const prompt = `Analyze this voice command: ${transcript}`;
  const response = await callOpenAI(prompt);

  if (response) {
    textToVoice(response);
  }
};

// Listen to a voice command, convert it to text, and process it with OpenAI
export const listenAndProcess = async () => {
  startListening(async (transcript: string) => {
    console.log('Heard:', transcript);
    await handleVoiceCommand(transcript);
  });
};

// Fetch data and metrics for a given Ethereum address
export const fetchDataAndMetrics = async (address: string) => {
  try {
    const response = await fetch(`https://api.idef.ai/api/get_data_and_metrics?address=${address}`);
    if (!response.ok) throw new Error('Failed to fetch metrics');
    return await response.json();
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return null;
  }
};

// Utility function for OpenAI calls with better error handling
export const handleOpenAIInteraction = async (
  prompt: string
): Promise<string | null> => {
  const openAIResponse = await callOpenAI(prompt);

  if (!openAIResponse) {
    console.error('Failed to get response from OpenAI');
    return null;
  }

  // Optionally convert response to speech
  textToVoice(openAIResponse);

  return openAIResponse;
};
