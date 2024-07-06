import '../styles/globals.css'
import type { AppProps } from 'next/app'
import AllProviders from '../providers'

import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '../theme';
import { SnackbarProvider } from 'notistack';
import { ConfirmProvider } from 'material-ui-confirm';
import { appWithTranslation } from 'next-i18next'
import createCache from '@emotion/cache';
import { EmotionCache } from '@emotion/react';

const createEmotionCache = () => {
  return createCache({ key: 'css' });
};

const clientSideEmotionCache = createEmotionCache();

function App(props: AppProps & { emotionCache: EmotionCache }) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;


  const getLayout = (Component as any).getLayout ?? ((page: React.ReactElement) => page);

  const theme = createTheme();

  return (
    <AllProviders>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>
            MOE Teacher Survey
          </title>
          <link rel="icon" type="image/png" href="./favicon.png" />
          <meta
            name="viewport"
            content="initial-scale=1, width=device-width"
          />
        </Head>
        <ConfirmProvider>
          <SnackbarProvider>
            <LocalizationProvider>

              <ThemeProvider theme={theme}>
                <CssBaseline />
                {getLayout(<Component {...pageProps} />)}
              </ThemeProvider>
            </LocalizationProvider>
          </SnackbarProvider>
        </ConfirmProvider>
      </CacheProvider>
    </AllProviders>
  );
};

export default appWithTranslation(App);

