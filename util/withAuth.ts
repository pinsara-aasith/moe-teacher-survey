import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { verifyAccessToken } from '../lib/auth'
import { School, User } from '../database/schema'
import { User as IUser } from '../lib/types/auth'

export type AuthOptions = {
  redirectTo?: string
}

// Create a getServerSideProps utility function called "withAuth" to check user
const withAuth = async <T extends Object = any>(
  { req }: GetServerSidePropsContext,
  onSuccess: (user: IUser) => Promise<GetServerSidePropsResult<T>>,
  _options: AuthOptions = {
    redirectTo: '/school-admin/login',
  }
): Promise<GetServerSidePropsResult<T>> => {
  // Get the user's session based on the request
  if (!req.cookies.token) {
    return {
      redirect: {
        destination: '/school-admin/login',
        permanent: false,
      },
    }
  }

  const token = req.cookies.token.split(' ')[0]

  return verifyAccessToken(token)
    .then(async decoded => {
      // Now, check if user has done 2 factor authentication
      const user = await User.findById(decoded._id).lean()

      if (user.schoolCode) {
        user.school = await School.find({ schoolCode: decoded.schoolCode })
      }

      if (!user) {
        return {
          redirect: {
            destination: `/${decoded.role || 'school-admin'}/login`,
            permanent: false,
          },
        }
      } else {
        return onSuccess(user)
      }
    })
    .catch(err => {
      console.log(err)
      return {
        redirect: {
          destination: '/school-admin/login',
          permanent: false,
        },
      }
    })

}

export default withAuth
