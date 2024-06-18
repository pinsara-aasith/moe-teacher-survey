import {
  Box,
  Divider,
  Typography,
  IconButton,
  Tooltip,
  Snackbar,
  SnackbarContent,
} from '@mui/material';
import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiRefreshCcw } from 'react-icons/fi';
import useSWR, { SWRConfig } from 'swr';
import CopyButton from '../components/CopyButton';
import Navbar from '../components/Navbar';
import NavbarProfile from '../components/NavbarProfile';
import { useAuth } from '../providers/auth/AuthProvider';

import fetcher from '../util/fetcher';
import withAuth from '../util/withAuth';
import { IPost, Post } from '../database/schema';
import { ApiResponse } from '../lib/types/api';


export type PostWithVote = IPost & {
  votes: any[]
}

export type PostsApiResponse = ApiResponse<{
  posts: PostWithVote[]
}>


export const getServerSideProps = (context: GetServerSidePropsContext) => withAuth(context, async () => {
  // `getStaticProps` is executed on the server side.
  const posts = await Post.find();
  // Little workaround to get NextJS to convert Dates into JSON
  const postsJson = JSON.parse(JSON.stringify(posts));

  const postsApiResponse: PostsApiResponse = {
    success: true,
    data: {
      posts: postsJson,
    },
  };

  return {
    props: {
      fallback: {
        '/api/posts': postsApiResponse, // Empty array if error while fetching data
      },
    },
  };
});

const HomePage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  const [isTokenRefreshing, setIsTokenRefreshing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const {
    currentUser,
    logOut,
    refreshSession,
    isAuthenticated,
    accessToken,
    refreshToken,
  } = useAuth();
  const router = useRouter();

  // Fetch posts using SWR
  const { data: posts, error, mutate } = useSWR<PostsApiResponse>('/api/posts', fetcher);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showToast = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <SWRConfig value={{ fallback }}>
      <Navbar
        homeURL="/"
        rightComponent={
          currentUser && [
            <NavbarProfile
              currentUser={currentUser}
              onLogOut={() => {
                // log out
                logOut();
                // redirect to home page
                router.push('/');
              }}
              key="avatar"
            />,
          ]
        }
      />
      <Box mt={8} p={3}>
        <Typography variant="h4">Your profile</Typography>
        <Divider sx={{ mb: 3 }} />
        {currentUser ? (
          <>
            <Box display="flex" alignItems="center">
              <Typography fontWeight="bold">User ID:</Typography>
              <Typography>{currentUser._id}</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography fontWeight="bold">Authenticated?</Typography>
              <Typography>{isAuthenticated ? 'Yes' : 'No'}</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography fontWeight="bold">Username:</Typography>
              <Typography>{currentUser.name} {currentUser.surname}</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography fontWeight="bold">Email:</Typography>
              <Typography>{currentUser.email}</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography fontWeight="bold">Admin:</Typography>
              <Typography>{currentUser.role == 'ADMIN' ? 'Yes' : 'No'}</Typography>
            </Box>
            <Typography variant="h5" mt={3}>JWT tokens:</Typography>
            <Divider sx={{ mb: 3 }} />
            <Box display="flex" alignItems="center" mt={3} gap={2}>
              <Typography fontWeight="bold">Access token:</Typography>
              <Typography sx={{ maxWidth: '60%' }}>{accessToken}</Typography>
              {accessToken && (
                <CopyButton
                  value={accessToken}
                  label={'Copy access token'}
                  onSuccessfulCopy={() => {
                    showToast('Copied access token', 'success');
                  }}
                  onFailedCopy={() => {
                    showToast('Failed to copy access token', 'error');
                  }}
                />
              )}

              <Tooltip title={'Refresh access token'}>
                <IconButton
                  aria-label="Refresh access token"
                  onClick={() => {
                    setIsTokenRefreshing(true);
                    refreshSession()
                      .then(() => {
                        showToast('Refreshed access token', 'success');
                      })
                      .catch(() => {
                        showToast('Failed to refresh access token', 'error');
                      })
                      .finally(() => setIsTokenRefreshing(false));
                  }}
                  disabled={isTokenRefreshing}
                >
                  <FiRefreshCcw />
                </IconButton>
              </Tooltip>
            </Box>
            <Box display="flex" alignItems="center" mt={3} gap={2}>
              <Typography fontWeight="bold">Refresh token:</Typography>
              <Typography sx={{ maxWidth: '60%' }}>{refreshToken}</Typography>

              {refreshToken && (
                <CopyButton
                  value={refreshToken}
                  label={'Copy refresh token'}
                  onSuccessfulCopy={() => {
                    showToast('Copied refresh token', 'success');
                  }}
                  onFailedCopy={() => {
                    showToast('Failed to copy refresh token', 'error');
                  }}
                />
              )}
            </Box>
          </>
        ) : (
          <Typography variant="h6">You are not logged in</Typography>
        )}

        <Typography variant="h5" mt={3}>Testing - Post voting</Typography>
        <Divider sx={{ mb: 3 }} />
        <Typography>
          Please, like or dislike the posts below. The data is persisted in the DB.
        </Typography>

        {/* show library of available posts */}
        <Box>

        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <SnackbarContent
          message={snackbarMessage}
          style={{
            backgroundColor: snackbarSeverity === 'success' ? '#43a047' : '#d32f2f',
          }}
        />
      </Snackbar>
    </SWRConfig>
  );
};

export default HomePage;
