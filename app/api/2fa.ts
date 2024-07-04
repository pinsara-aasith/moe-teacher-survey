// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withMiddlewares } from '../../middlewares'

import {
  authMiddleware,
  NextRequestWithUser,
} from '../../middlewares/auth-middleware'
import { User } from '../../database/schema'
import { NextApiRequest } from 'next'

const twoFactorAuthRoute = async (
  req: NextRequestWithUser,
  res: NextApiRequest
) => {
  // Extract email and password from request body
  const { token } = req.body as { token: string }

  // If email or password is not present, return a 400 response
  // if (!token) {
  //   return res.status(400).json({
  //     success: false,
  //     message: 'Missing email or password',
  //   })
  // }

  // Now, look for user in db
  const user = await User.findById(req.user._id)

  // If user does not exist, return a 401 response
  // if (!user) {
  //   return res.status(401).json({
  //     success: false,
  //     message: 'Invalid refresh token',
  //   })
  // }

  // if (user.twoFactorToken == token) {
  //   // token is valid, clear twoFactorToken
  //   await User.findByIdAndUpdate(
  //     user._id,
  //     { $set: { twoFactorToken: null } },
  //     { new: true } // To return the updated document
  //   );

  //   // return success
  //   return res.status(200).json({
  //     success: true,
  //     message: 'Two factor authentication successful',
  //   })
  // } else {
  //   return res.status(401).json({
  //     success: false,
  //     message: 'Invalid two factor token',
  //   })
  // }
}

export default withMiddlewares(authMiddleware, twoFactorAuthRoute)
