import { Alert, AlertTitle, Box, Typography } from '@mui/material';
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { useRouter } from 'next/router';
import { verifyTwoFactorToken } from '../lib/auth';
import { User } from '../database/schema';
import withAuth from '../util/withAuth';

type AvailableStatus = 'success' | 'error' | 'info';

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => withAuth(context, async () => {
  if (!context.query.token) {
    return {
      props: {
        validationState: 'info',
      },
    };
  } else {
    try {
      const decoded = await verifyTwoFactorToken(context.query.token as string);
      const user = await User.findById(decoded._id);

      if (user && user.twoFactorToken === (context.query.token as string)) {
        await User.findByIdAndUpdate(
          decoded._id,
          { $set: { twoFactorToken: null } },
          { new: true }
        );

        return {
          props: {
            validationState: 'success' as AvailableStatus,
          },
        };
      } else {
        return {
          props: {
            validationState: 'error' as AvailableStatus,
          },
        };
      }
    } catch (error) {
      return {
        props: {
          validationState: 'error' as AvailableStatus,
        },
      };
    }
  }
});

const TwoFactor: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ validationState }) => {
  const router = useRouter();

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Alert severity={validationState as any} sx={{ maxWidth: '400px' }}>
        <AlertTitle>Two Factor Authentication</AlertTitle>
        <Typography variant="body1">
          {validationState === 'info' && (
            <>
              Please, check your email for the two-factor authentication link
              and click on it. You can close this page now.
              <br />
              <br />
              If you haven&apos;t received the email, please check your spam
              folder.
            </>
          )}
          {validationState === 'success' && (
            <>
              You have been successfully authenticated. You will be redirected
              to the home page in a few seconds.
            </>
          )}
          {validationState === 'error' && (
            <>
              {validationState === 'error' && (
                <>
                  This link is invalid or has expired. Please, log in again to
                  get a new link.
                </>
              )}
              {validationState === 'error' && (
                <>Wrong response from the server. Please, try again.</>
              )}
            </>
          )}
        </Typography>
      </Alert>
    </Box>
  );
};

export default TwoFactor;
