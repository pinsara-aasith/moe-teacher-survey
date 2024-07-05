
import { School, Teacher } from '../../../../../database/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params: { schoolCode } }: any) {
  try {
    const school = await School.findOne({ code: schoolCode });
    if (!school) {
      return NextResponse.json({ success: false, error: 'School not found' }, { status: 404 });
    }
    const { name, nic, gender } = await req.json();

    const teacher = new Teacher({ name, nic, gender, school: school._id })
    await teacher.save();
    return NextResponse.json({ success: true, data: teacher });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to insert teacher',
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params: { schoolCode } }: any) {
  try {
    const school = await School.findOne({ code: schoolCode });
    if (!school) {
      return NextResponse.json({ success: false, error: 'School not found' }, { status: 404 });
    }

    const teachers = await Teacher.find({ school: school._id })
    return NextResponse.json({ success: true, data: teachers });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch teachers',
    }, { status: 500 });
  }
}

