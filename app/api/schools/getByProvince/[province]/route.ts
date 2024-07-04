
import { School } from '../../../../../database/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

    try {
      const schools = await School.find({ province: searchParams.get("province") });
      NextResponse.json(schools, {status: 200});
    } catch (error) {
      NextResponse.json({ error: 'Failed to fetch schools' }, {status: 500});
    }
}
