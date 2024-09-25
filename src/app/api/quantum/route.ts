import { NextResponse } from 'next/server';
import axios from 'axios';

const QUANTUM_API_BASE_URL = 'https://q.idefi.ai/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const portfolio = searchParams.get('portfolio'); // Assuming portfolio is passed as a stringified JSON
  const filename = searchParams.get('filename');
  const useIBMBackend = searchParams.get('useIBMBackend') === 'true';
  const state = searchParams.get('state');

  if (!action) {
    return NextResponse.json({ error: 'Action is required' }, { status: 400 });
  }

  try {
    let response;
    switch (action) {
      case 'quantumRiskAnalysis':
        if (!portfolio) {
          return NextResponse.json({ error: 'Portfolio is required for risk analysis' }, { status: 400 });
        }
        response = await axios.post(`${QUANTUM_API_BASE_URL}/quantum_risk_analysis`, {
          portfolio: JSON.parse(portfolio),
        });
        break;
      case 'portfolioOptimization':
        if (!portfolio) {
          return NextResponse.json({ error: 'Portfolio is required for optimization' }, { status: 400 });
        }
        response = await axios.post(`${QUANTUM_API_BASE_URL}/portfolio_optimization`, {
          portfolio: JSON.parse(portfolio),
        });
        break;
      case 'compileAndRunQASM':
        if (!filename) {
          return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
        }
        response = await axios.post(`${QUANTUM_API_BASE_URL}/compile-and-run`, {
          filename,
          use_ibm_backend: useIBMBackend,
        });
        break;
      case 'initializeQuantumMemory':
        response = await axios.post(`${QUANTUM_API_BASE_URL}/initialize_memory`);
        break;
      case 'storeQuantumStateInMemory':
        if (!state) {
          return NextResponse.json({ error: 'State is required' }, { status: 400 });
        }
        response = await axios.post(`${QUANTUM_API_BASE_URL}/store_in_memory`, {
          state,
        });
        break;
      case 'retrieveQuantumStateFromMemory':
        response = await axios.post(`${QUANTUM_API_BASE_URL}/retrieve_from_memory`);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Error executing ${action}:`, error);
    return NextResponse.json({ error: `Error executing ${action}` }, { status: 500 });
  }
}
