import type { NextApiRequest, NextApiResponse } from 'next'
import { withMiddlewares } from '../../middlewares'

import * as auth from '../../lib/auth'
import { UserSession } from '../../lib/types/auth'
import { sendEmail } from '../../lib/mail'
import { User } from '../../database/schema'

const loginRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { schoolCode, email, password, userType } = req.body as { schoolCode?: string; email?: string, password: string, userType: string }


  if (!(userType) ||
    !(userType == 'school-admin' || userType == 'system-admin')) {
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

  const user = await User.findOne({ schoolCode, userType })

  // If user does not exist, return a 401 response
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email/schoolcode or password',
    })
  } else {
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
        message: 'Invalid email/schoolcode or password',
      })
    }
  }
}

export default withMiddlewares(loginRoute)
