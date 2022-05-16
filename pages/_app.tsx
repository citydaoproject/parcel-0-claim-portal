import '../styles/globals.scss';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { AppProvider } from '../context/StateProvider';
import { ModalProvider } from '../context/ModalContext';
import Modal from 'react-modal';
Modal.setAppElement('#__next');

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>CityDAO Parcel 0 NFT Claim Portal</title>
        <meta
          name="description"
          content="Claim and mint a Parcel 0 NFT for eligible CityDAO Citizen NFT holders. Mint closes Friday, July 1st, 12:00pm MDT (GMT -6)"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CityDAO" />
        <meta name="twitter:title" content="CityDAO Parcel 0 NFT Claim Portal" />
        <meta
          name="twitter:description"
          content="Claim and mint a Parcel 0 NFT for eligible CityDAO Citizen NFT holders. Mint closes Friday, July 1st, 12:00pm MDT (GMT -6)"
        />
        <meta name="twitter:image" content="https://parcel-0-test.vercel.app/twitter-card-citydao-parcel0.png" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://parcel-0.citydao.io/" />
        <meta property="og:title" content="CityDAO Parcel 0 NFT Claim Portal" />
        <meta
          property="og:description"
          content="Claim and mint a Parcel 0 NFT for eligible CityDAO Citizen NFT holders. Mint closes Friday, July 1st, 12:00pm MDT (GMT -6)"
        />
        <meta property="og:image" content="https://parcel-0-test.vercel.app/twitter-card-citydao-parcel0.png" />

        <link rel="icon" href="/logo.jpeg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@600&family=Inter&display=swap"
          rel="stylesheet"
        />
      </Head>
      <AppProvider>
        <ModalProvider>
          <Component {...pageProps} />
        </ModalProvider>
      </AppProvider>
    </>
  );
}

export default MyApp;
