
import { School } from '../../../../../database/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const zone = req.nextUrl.searchParams.get("zone");

  if (req.method === 'GET') {
    try {
      const schools = await School.find({ zone });
      NextResponse.json(schools, {status: 200});
    } catch (error) {
      NextResponse.json({ error: 'Failed to fetch schools' }, {status: 500});
    }
  }
}

