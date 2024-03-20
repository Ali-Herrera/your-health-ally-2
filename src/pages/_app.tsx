import { type AppType } from 'next/app';
import { Inter } from 'next/font/google';
// import { ClerkProvider } from '@clerk/nextjs';

import { api } from '~/utils/api';
import '@mantine/core/styles.css';

import '~/styles/globals.css';
import { createTheme, MantineProvider } from '@mantine/core';

const inter = Inter({
  subsets: ['latin'],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      {/* <ClerkProvider> */}
      <MantineProvider>
        <main className={inter.className}>
          <Component {...pageProps} />
        </main>
      </MantineProvider>
      {/* </ClerkProvider> */}
    </>
  );
};

export default api.withTRPC(MyApp);
