import { TokenExpiredError } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse } from './types/api'
import { UserSession } from './types/auth'
import { User } from '../database/schema'
import { verifyToken } from './jwt'
import { AppMiddleware } from '../middlewares'

export type NextRequestWithUser = NextRequest & {
  user?: UserSession
}

export const checkIfAuthenticated:AppMiddleware = async <T extends ApiResponse<T>>(
  req: NextRequestWithUser,
  params: any,
  next?:  AppMiddleware
) => {
  // Look for access token inside cookies
  const token = req.cookies?.get('token')?.value.split(' ')[0] || null

  if (!token) {
    return NextResponse.json({
      success: false,
      message: 'Missing token',
    }, { status: 401 })
  }

  // Check if access token is valid
  try {
    const decoded = await verifyToken(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET as string
    )

    // Ensure that a user has done 2-factor authentication (if twoFactorToken is NULL)
    const user = await User.findById(decoded._id)

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Invalid token',
      }, { status: 401 })
    }

    // Add user to request
    req.user = decoded

    // Call next()
    if (next) return next(req, params)

    return NextResponse.json({success: false, error: 'No next middleware selected'})
  } catch (error) {
    // If token is just expired, try to refresh it
    if (error instanceof TokenExpiredError) {
      // Answer with a special error code
      return NextResponse.json({
        success: false,
        message: 'Token expired',
      }, { status: 498 })
    }

    console.error('AUTH ERROR:', error)
    return NextResponse.json({
      success: false,
      message: 'Invalid token',
    }, { status: 401 })
  }
}
