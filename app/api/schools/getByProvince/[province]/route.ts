
import { School } from '../../../../../database/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, {params: {province}}: any) {

    try {
      const schools = await School.find({ province });
      return NextResponse.json(schools, {status: 200});
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch schools' }, {status: 500});
    }
}
