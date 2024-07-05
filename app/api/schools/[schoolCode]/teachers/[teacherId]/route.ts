
import { School, Teacher } from '../../../../../../database/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, { params: { schoolCode, teacherId } }: any) {
  try {
    const school = await School.findOne({ code: schoolCode });
    if (!school) {
      return NextResponse.json({ success: false, error: 'School not found' }, { status: 404 });
    }

    const teacher = await Teacher.findOneAndDelete({ _id: teacherId, school: school._id });
    if (!teacher) {
      return NextResponse.json({ success: false, error: 'Teacher not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Teacher deleted successfully' });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to delete teacher',
    }, { status: 500 });
  }
}

