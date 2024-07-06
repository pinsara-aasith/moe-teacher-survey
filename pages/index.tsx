import React, { useState } from 'react';
import Head from 'next/head';
import { Box, Card, CardContent, Container, Paper, Grid, Stack, Typography, Link, Button } from '@mui/material';
import Image from 'next/image';
import NextLink from 'next/link';

interface Language {
  id: string;
  name: string;
  image: string;
}

const Page: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
  };

  return (
    <>
      <Head>
        <title>
          පාසල් සංගණනය - 2024
        </title>
      </Head>

      <Grid
        container
        sx={{
          display: 'flex',
          flex: '1 1 auto', flexDirection: 'column',
          alignItems: 'center',
          background: 'radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)',
        }}
      >
        <Grid
          item={true}
          xl={7}
          xs={12}
          lg={7}
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

                  <Typography variant="body1" sx={{ margin: '20px', fontWeight: 'bold' }}>
                    Please select a language
                  </Typography>

                  <Stack spacing={2} sx={{ alignItems: 'center' }}>
                    <Grid container spacing={2} justifyContent="center">
                      {languages.map((language) => (
                        <Grid item xs={6} key={language.id}>
                          <Link
                            href={`${language.id}/survey`}
                            component={NextLink}
                            underline="hover"
                            locale={language.id}
                          >
                            <Paper
                              elevation={3}
                              onClick={() => handleLanguageSelect(language)}
                              style={{
                                backgroundColor:
                                  selectedLanguage && selectedLanguage.id === language.id
                                    ? '#f0f0f0'
                                    : 'inherit',
                                padding: '20px'
                              }}
                            >
                              <Image
                                width={65}
                                height={65}
                                alt={language.name}
                                src={language.image}
                              />
                              <Typography variant="h6">{language.name}</Typography>
                            </Paper>
                          </Link>
                        </Grid>
                      ))}
                    </Grid>
                  </Stack>
                  <Button
                    sx={{ mt: 2 }}
                    type="submit"
                    variant="outlined"
                    color="primary"
                    fullWidth
                    href={`school-admin/login`}
                    LinkComponent={NextLink}>
                    Go to the login for school admins
                  </Button>

                </CardContent>
              </Card>
              <Typography sx={{ marginTop: '10px' }} variant="body2" color="text.secondary" align="center">
                {'Copyright © 2024 Statistic Branch, Ministry of Education. All Rights Reserved.'}
              </Typography>
            </Container>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

const languages: Language[] = [
  { id: 'si', name: 'Sinhala', image: '/static/images/sinhala.png' },
  { id: 'ta', name: 'Tamil', image: '/static/images/tamil.jpeg' },
];

export default Page;
