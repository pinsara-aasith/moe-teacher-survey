import {
  Box,
  Typography,
  InputAdornment,
  IconButton,
  Button,
  TextField,
  FormControl,
  Snackbar,
  Alert,
  Card,
  Container,
  CardContent,
  Stack,
  Grid,
} from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../../providers/auth/AuthProvider';
import Image from 'next/image';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const router = useRouter();
  const { logIn } = useAuth();

  // React hook form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SchoolAdminLoginData>();

  const onSubmit = async (data: SchoolAdminLoginData) => {
    await logIn(data)
      .then(() => {
        showSnackbar('You have successfully logged in', 'success');
        // Redirect to home page
        router.push('/two-factor');
      })
      .catch(err => {
        showSnackbar(err.message, 'error');
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Grid
      container={true}
      item={true}
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)',
      }}
    >
      <Grid
        item={true}
        xl={9}
        xs={12}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 4
          }}
        >
          <Container maxWidth="xl">

            <Card sx={{ overflow: 'visible', textAlign: 'center' }}>

              <CardContent>
                <Stack spacing={2} sx={{ alignItems: 'center' }}>
                  <Typography variant="h5">
                    පාසල් සංගණනය - 2024 | பள்ளிக் கணக்கெடுப்பு - 2024
                  </Typography>

                  <Typography variant="body2">
                    ගුරු විදුහල්පති තොරතුරු ආකෘති පත්‍රය (2024) | ஆசிரியர் முதன்மை தகவல் படிவம் (2024)
                  </Typography>
                  <Typography variant="body2">
                    අධ්‍යාපන අමාත්‍යාංශය | கல்வி அமைச்சு
                  </Typography>
                  <Image
                    width={40}
                    height={55}
                    alt={'srilanka emblem'}
                    src={"/static/images/srilanka-emblem.png"}
                  />
                </Stack>

                <Typography variant="h5" component="h5" sx={{ my: 4 }} gutterBottom>
                  Login For School Admins
                </Typography>

                <form
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit(onSubmit)}
                >

                  <FormControl sx={{ mt: 2 }} fullWidth error={!!errors.schoolCode}>
                    <TextField
                      id="schoolCode"
                      label="School Code | පාසලේ සංගණන අංකය | பள்ளியின் குறியீடு"
                      variant="outlined"
                      {...register('schoolCode', {
                        required: 'School code is required',
                      })}

                      sx={{ width: '100%' }}
                      name="schoolCode"
                      helperText={errors.schoolCode?.message}
                    />
                    
                  </FormControl>

                  <FormControl sx={{ mt: 2 }} fullWidth error={!!errors.password}>
                    <TextField
                      sx={{ width: '100%' }}
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      label="Password | මුරපදය | கடவுச்சொல்"
                      variant="outlined"
                      {...register('password', {
                        required: 'Password is required',
                      })}
                      name="password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <FiEyeOff /> : <FiEye />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      helperText={errors.password?.message}
                    />
                  </FormControl>

                  <Button sx={{ mt: 2 }} type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
                    {isSubmitting ? 'Logging In...' : 'Log In'}
                  </Button>
                </form>
                
                <Snackbar
                  open={snackbarOpen}
                  autoHideDuration={6000}
                  onClose={handleCloseSnackbar}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                  </Alert>
                </Snackbar>
              </CardContent>
            </Card>

            <Typography sx={{ marginTop: '10px' }} variant="body2" color="text.secondary" align="center">
              {'Copyright © 2024 Statistic Branch, Ministry of Education. All Rights Reserved.'}
            </Typography>
          </Container>
        </Box>
      </Grid>
    </Grid >
    // </Box>
  );
};

export default LoginPage;
