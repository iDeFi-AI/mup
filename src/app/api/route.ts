import { NextResponse } from 'next/server';
import axios from 'axios';

// Define Base URLs for APIs
const AGENTS_API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : 'https://agents.idefi.ai';
const ENDPOINTS_API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : 'https://api.idefi.ai';
const QUANTUM_API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : 'https://q.idefi.ai';

// Define reusable API function to handle GET and POST requests
const performAPIRequest = async (url: string, method = 'GET', data: any = null) => {
  try {
    const response = method === 'GET'
      ? await axios.get(url, { params: data })
      : await axios.post(url, data);

    return response.data;
  } catch (error: any) {
    console.error(`API request error: ${error.message}`);
    throw new Error(`Failed to perform API request: ${url}`);
  }
};

// Main GET handler for fetching data from external APIs
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const agentName = searchParams.get('agentName') || null;
  const address = searchParams.get('address') || null;

  if (!action) {
    return NextResponse.json({ error: 'Action is required' }, { status: 400 });
  }

  try {
    let response;
    switch (action) {
      // Fetch agents status
      case 'agents_status':
        response = await performAPIRequest(
          `${AGENTS_API_BASE_URL}/api/agents_status`,
          'GET',
          agentName ? { agent_name: agentName } : null
        );
        break;

      // Fetch agents tracking
      case 'agents_tracking':
        response = await performAPIRequest(`${AGENTS_API_BASE_URL}/api/agents_tracking`, 'GET');
        break;

      // Fetch data and metrics from Endpoints API
      case 'data_and_metrics':
        if (!address) return NextResponse.json({ error: 'Address is required' }, { status: 400 });
        response = await performAPIRequest(`${ENDPOINTS_API_BASE_URL}/api/endpoints`, 'GET', { address });
        break;

      // Quantum-related API: Quantum Risk Analysis
      case 'quantumRiskAnalysis':
        const portfolio = searchParams.get('portfolio');
        if (!portfolio) return NextResponse.json({ error: 'Portfolio is required' }, { status: 400 });
        response = await performAPIRequest(`${QUANTUM_API_BASE_URL}/api/quantum_risk_analysis`, 'POST', { portfolio });
        break;

      // Quantum-related API: Portfolio Optimization
      case 'portfolioOptimization':
        const optimizationPortfolio = searchParams.get('portfolio');
        if (!optimizationPortfolio) return NextResponse.json({ error: 'Portfolio is required' }, { status: 400 });
        response = await performAPIRequest(`${QUANTUM_API_BASE_URL}/api/portfolio_optimization`, 'POST', { portfolio: optimizationPortfolio });
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Main POST handler for posting data to external APIs
export async function POST(request: Request) {
  const body = await request.json();
  const action = body.action;

  if (!action) {
    return NextResponse.json({ error: 'Action is required' }, { status: 400 });
  }

  try {
    let response;
    switch (action) {
      // Create an agent
      case 'create_agent':
        if (!body.agentName) return NextResponse.json({ error: 'Agent name is required' }, { status: 400 });
        response = await performAPIRequest(`${AGENTS_API_BASE_URL}/api/agents_create`, 'POST', { agent_name: body.agentName });
        break;

      // Assign endpoints to an agent
      case 'assign_endpoints':
        if (!body.agent_name || !body.endpoints) return NextResponse.json({ error: 'Agent name and endpoints are required' }, { status: 400 });
        response = await performAPIRequest(`${AGENTS_API_BASE_URL}/api/agents_assign_endpoints`, 'POST', { agent_name: body.agent_name, endpoints: body.endpoints });
        break;

      // Trigger a task for an agent
      case 'trigger_task':
        if (!body.agent_name) return NextResponse.json({ error: 'Agent name is required' }, { status: 400 });
        response = await performAPIRequest(`${AGENTS_API_BASE_URL}/api/agents`, 'POST', { agent_name: body.agent_name });
        break;

      // Configure beneficiary wallet and address
      case 'configure_beneficiary':
        if (!body.walletAddress || !body.beneficiaryAddress) return NextResponse.json({ error: 'Wallet address and beneficiary address are required' }, { status: 400 });
        response = await performAPIRequest(`${ENDPOINTS_API_BASE_URL}/api/endpoints`, 'POST', { walletAddress: body.walletAddress, beneficiaryAddress: body.beneficiaryAddress });
        break;

      // Quantum APIs: Compile and run QASM file
      case 'compileAndRunQASM':
        if (!body.filename || typeof body.useIBMBackend === 'undefined') return NextResponse.json({ error: 'Filename and useIBMBackend flag are required' }, { status: 400 });
        response = await performAPIRequest(`${QUANTUM_API_BASE_URL}/api/compile_and_run`, 'POST', { filename: body.filename, useIBMBackend: body.useIBMBackend });
        break;

      // Quantum APIs: Store quantum state in memory
      case 'storeQuantumStateInMemory':
        if (!body.state) return NextResponse.json({ error: 'State is required' }, { status: 400 });
        response = await performAPIRequest(`${QUANTUM_API_BASE_URL}/api/store_in_memory`, 'POST', { state: body.state });
        break;

      // Quantum APIs: Retrieve quantum state from memory
      case 'retrieveQuantumStateFromMemory':
        response = await performAPIRequest(`${QUANTUM_API_BASE_URL}/api/retrieve_from_memory`, 'POST');
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
