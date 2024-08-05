import { NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = 'https://api.idef.ai/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/checkaddress`, {
      params: { address },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error checking flagged address:', error);
    return NextResponse.json({ error: 'Error checking flagged address' }, { status: 500 });
  }
}
