import * as auth from '../../../lib/auth'
import { UserSession } from '../../../lib/types/auth'
import { User } from '../../../database/schema'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'


export async function POST(req: NextRequest) {
  const { schoolCode, email, password, role } = await req.json() as { schoolCode?: string; email?: string, password: string, role: string }

  if (!(role) ||
    !(role == 'school-admin' || role == 'system-admin')) {
    return NextResponse.json({
      success: false,
      message: 'Invalid user type',
    }, { status: 400 });

  }

  if (!(schoolCode || email) || !password) {
    return NextResponse.json({
      success: false,
      message: 'Missing email/schoolcode or password',
    }, { status: 400 });
  }

  let user;
  let errorMessage = null;

  if (role == 'school-admin') {
    user = await User.findOne({ schoolCode, role: 'school-admin' })
    if (!user) {
      errorMessage = 'Invalid school code or password!'
    }
  } else if (role == 'system-admin') {
    user = await User.findOne({ email, roleF: 'school-admin' })

    if (!user) {
      errorMessage = 'Invalid email or password!'
    }
  }

  if (!user) {
    return NextResponse.json({
      success: false,
      message: errorMessage || 'Invalid credentials!',
    }, { status: 401 });
  }

  // If user does not exist, return a 401 response

  if (await auth.verifyPassword(password, user.password)) {
    const session: UserSession = {
      _id: user._id as string,
      schoolCode: schoolCode,
      email: user.email,
      name: user.name,
      role: user.role,
    }

    // generate access + refresh token + email token for 2 factor authentication
    const token = auth.generateAccessToken(session)
    const refreshToken = auth.generateRefreshToken(session)

    // save refresh token + second factor auth to database
    User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          refreshToken,
        }
      }
    );

    cookies().set("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60,
      sameSite: "strict"
    });


    return NextResponse.json({
      success: true,
      data: {
        token,
        refreshToken,
        session,
      },
    }, { status: 200 })
  } else {
    return NextResponse.json({
      success: false,
      message: 'Invalid password!',
    }, { status: 401 });
  }

}

