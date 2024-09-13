import { NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001/api'
    : 'https://api.idefi.ai/api';


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  const address = searchParams.get('address');
  const filename = searchParams.get('filename');

  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 });
  }

  try {
    let response;
    switch (endpoint) {
      case 'checkaddress':
        if (!address) {
          return NextResponse.json({ error: 'Address is required' }, { status: 400 });
        }
        response = await axios.get(`${API_BASE_URL}/checkaddress`, { params: { address } });
        break;
      case 'get_data_and_metrics':
        if (!address) {
          return NextResponse.json({ error: 'Address is required' }, { status: 400 });
        }
        response = await axios.get(`${API_BASE_URL}/get_data_and_metrics`, { params: { address } });
        break;
      case 'download':
        if (!filename) {
          return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
        }
        response = await axios.get(`${API_BASE_URL}/download/${filename}`, { responseType: 'blob' });
        const headers = new Headers();
        headers.append('Content-Type', 'application/octet-stream');
        return new Response(response.data, { headers, status: 200 });
      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return NextResponse.json({ error: `Error fetching data from ${endpoint}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const endpoint = body.endpoint;

  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 });
  }

  try {
    let response;
    switch (endpoint) {
      case 'analyze_transactions':
        const { address, transactions } = body;
        if (!address || !transactions) {
          return NextResponse.json({ error: 'Address and transactions are required' }, { status: 400 });
        }
        response = await axios.post(`${API_BASE_URL}/analyze_transactions`, { address, transactions });
        break;
      case 'check_multiple_addresses':
        const { addresses } = body;
        if (!addresses || !Array.isArray(addresses) || addresses.length === 0) {
          return NextResponse.json({ error: 'A non-empty array of addresses is required' }, { status: 400 });
        }
        response = await axios.post(`${API_BASE_URL}/check_multiple_addresses`, { addresses });
        break;
      case 'transaction_summary':
        const summaryAddress = body.address;
        if (!summaryAddress) {
          return NextResponse.json({ error: 'Address is required' }, { status: 400 });
        }
        response = await axios.post(`${API_BASE_URL}/transaction_summary`, null, { params: { address: summaryAddress } });
        break;
      case 'visualize_dataset':  // New case for visualizing dataset
        const { source_type, filename, max_nodes } = body;
        const visualizeAddress = body.address;

        if (!visualizeAddress && !filename) {
          return NextResponse.json({ error: 'Either an address or a filename is required' }, { status: 400 });
        }

        response = await axios.post(`${API_BASE_URL}/visualize_dataset`, {
          source_type,
          address: visualizeAddress,
          filename,
          max_nodes,
        });
        break;
      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Error executing ${endpoint}:`, error);
    return NextResponse.json({ error: `Error executing ${endpoint}` }, { status: 500 });
  }
}
