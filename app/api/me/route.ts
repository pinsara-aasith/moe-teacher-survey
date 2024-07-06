import { ApiResponse } from '../../../lib/types/api'
import { UserSession } from '../../../lib/types/auth'
import { ApiHandler } from '../../../middlewares'
import {
  checkIfAuthenticated,
  NextRequestWithUser,
} from '../../../lib/checkIfAuthenticated'
import { NextResponse } from 'next/server'

export type UserApiResponse = ApiResponse<UserSession>

const getCurrentUserRoute = async (req: NextRequestWithUser, params: any) => {

  return NextResponse.json({
    success: true,
    data: req.user,
  });
}


export const GET: ApiHandler = (req, params) => checkIfAuthenticated(req, params, getCurrentUserRoute);
