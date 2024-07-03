import type { NextApiRequest, NextApiResponse } from 'next'
import { withMiddlewares } from '../../middlewares'

import * as auth from '../../lib/auth'
import { UserSession } from '../../lib/types/auth'
import { User } from '../../database/schema'
import { cookies } from 'next/headers'

const loginRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method != 'POST') return res.status(405).json({
    message: 'Unsupported operation',
  });

  const { schoolCode, email, password, role } = req.body as { schoolCode?: string; email?: string, password: string, role: string }

  if (!(role) ||
    !(role == 'school-admin' || role == 'system-admin')) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user type',
    })
  }

  if (!(schoolCode || email) || !password) {
    return res.status(400).json({
      success: false,
      message: 'Missing email/schoolcode or password',
    })
  }

  let user;
  let errorMessage = null;

  if (role == 'school-admin') {
    user = await User.findOne({ schoolCode, role: 'school-admin' })
    console.log(req.body)
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
    return res.status(401).json({
      success: false,
      message: errorMessage || 'Invalid credentials!',
    })
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


    // return access and refresh token
    return res.status(200).json({
      success: true,
      data: {
        token,
        refreshToken,
        session,
      },
    })
  } else {
    return res.status(401).json({
      success: false,
      message: 'Invalid password!',
    })
  }

}

export default withMiddlewares(loginRoute)
