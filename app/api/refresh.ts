// app/api/refresh/route.ts


import { NextResponse } from 'next/server'
import { verifyToken } from '../../lib/jwt'
import { User } from '../../database/schema'
import { generateAccessToken } from '../../lib/auth'

export async function POST(req: Request) {
  try {
    const { refreshToken } = await req.json()

    if (!refreshToken) {
      return NextResponse.json({
        success: false,
        message: 'Missing refresh token',
      }, { status: 400 })
    }

    const decoded = await verifyToken(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET as string
    )

    if (decoded) {
      const user = await User.findOne({
        _id: decoded._id,
        email: decoded.email,
      })

      if (!user) {
        return NextResponse.json({
          success: false,
          message: 'Invalid refresh token',
        }, { status: 401 })
      } else if (user.refreshToken !== refreshToken) {
        return NextResponse.json({
          success: false,
          message: 'Refresh token mismatch',
        }, { status: 401 })
      } else {
        const session = {
          _id: user.id,
          school: user.school,
          email: user.email,
          role: user.role,
          name: user.name,
        }

        const token = generateAccessToken(session)

        return NextResponse.json({
          success: true,
          data: {
            token,
          },
        }, { status: 200 })
      }
    } else {
      throw new Error('Invalid refresh token')
    }
  } catch (e) {
    console.log(e)
    return NextResponse.json({
      success: false,
      message: 'Invalid refresh token',
    }, { status: 401 })
  }
}
