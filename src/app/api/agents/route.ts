import { NextResponse } from 'next/server';
import axios from 'axios';

const AGENTS_API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api' // Use the agent backend during development
    : 'https://agents.idefi.ai/api'; // Use production agent API

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agentName = searchParams.get('agentName');
  const action = searchParams.get('action');

  if (!agentName || !action) {
    return NextResponse.json({ error: 'Agent name and action are required' }, { status: 400 });
  }

  try {
    let response;
    switch (action) {
      case 'status':
        response = await axios.get(`${AGENTS_API_BASE_URL}/agents/status`, {
          params: { agent_name: agentName }
        });
        break;
      case 'get_agents_by_category':
        const category = searchParams.get('category');
        if (!category) {
          return NextResponse.json({ error: 'Category is required' }, { status: 400 });
        }
        response = await axios.get(`${AGENTS_API_BASE_URL}/agents/category/${category}`);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Error performing agent action ${action}:`, error);
    return NextResponse.json({ error: `Error performing agent action ${action}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const action = body.action;

  if (!action) {
    return NextResponse.json({ error: 'Action is required' }, { status: 400 });
  }

  try {
    let response;
    switch (action) {
      case 'create_agent':
        const { agentName } = body;
        if (!agentName) {
          return NextResponse.json({ error: 'Agent name is required' }, { status: 400 });
        }
        response = await axios.post(`${AGENTS_API_BASE_URL}/agents/create`, { agent_name: agentName });
        break;
      case 'assign_endpoints':
        const { agent_name, endpoints } = body;
        if (!agent_name || !endpoints) {
          return NextResponse.json({ error: 'Agent name and endpoints are required' }, { status: 400 });
        }
        response = await axios.post(`${AGENTS_API_BASE_URL}/agents/assign_endpoints`, { agent_name, endpoints });
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Error performing agent action ${action}:`, error);
    return NextResponse.json({ error: `Error performing agent action ${action}` }, { status: 500 });
  }
}
