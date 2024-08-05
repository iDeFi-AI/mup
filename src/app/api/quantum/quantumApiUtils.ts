// quantumApiUtils.ts

import axios from 'axios';

const QUANTUM_API_BASE_URL = 'https://q.idefi.ai/api';

export const fetchQASMFiles = async () => {
  try {
    const response = await axios.get(`${QUANTUM_API_BASE_URL}/qasm_files`);
    return response.data.files;
  } catch (error) {
    console.error('Error fetching QASM files:', error);
    return null;
  }
};

export const compileAndRunQASM = async (filename: string, useIBMBackend: boolean = false) => {
  try {
    const response = await axios.post(`${QUANTUM_API_BASE_URL}/compile-and-run`, {
      filename,
      use_ibm_backend: useIBMBackend,
    });
    return response.data;
  } catch (error) {
    console.error('Error compiling and running QASM:', error);
    return null;
  }
};

export const generateExplanation = async (riskScores: any, histogramBase64: string, circuitBase64: string) => {
  try {
    const response = await axios.post(`${QUANTUM_API_BASE_URL}/generate-explanation`, {
      risk_scores: riskScores,
      histogram_base64: histogramBase64,
      circuit_base64: circuitBase64,
    });
    return response.data.explanation;
  } catch (error) {
    console.error('Error generating explanation:', error);
    return null;
  }
};

export const quantumRiskAnalysis = async (portfolio: any) => {
  try {
    const response = await axios.post(`${QUANTUM_API_BASE_URL}/quantum_risk_analysis`, { portfolio });
    return response.data.risk_analysis;
  } catch (error) {
    console.error('Error performing quantum risk analysis:', error);
    return null;
  }
};

export const portfolioOptimization = async (portfolio: any) => {
  try {
    const response = await axios.post(`${QUANTUM_API_BASE_URL}/portfolio_optimization`, { portfolio });
    return response.data.optimized_portfolio;
  } catch (error) {
    console.error('Error optimizing portfolio:', error);
    return null;
  }
};
