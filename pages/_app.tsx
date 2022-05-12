import '../styles/globals.css';
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
        <title>CityDAO Parcel-0 Claim Portal</title>
        <meta name="description" content="Read and approve the CityDAO Parcel-0 NFT Agreement" />
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
