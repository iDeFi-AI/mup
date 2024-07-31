import { NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = 'https://api.idef.ai';

export async function POST(request: Request) {
  const body = await request.json();
  const { address, transactions } = body;

  if (!address || !transactions) {
    return NextResponse.json({ error: 'Address and transactions are required' }, { status: 400 });
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/analyze_transactions`, {
      address,
      transactions,
    });
    return NextResponse.json(response.data.ai_insights);
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return NextResponse.json({ error: 'Error generating AI insights' }, { status: 500 });
  }
}
