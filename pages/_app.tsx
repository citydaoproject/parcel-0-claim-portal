import "../styles/globals.css";
import { AppProps } from "next/app";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>CityDAO Parcel-0 Claim Portal</title>
        <meta
          name="description"
          content="Read and approve the CityDAO Parcel-0 NFT Agreement"
        />
        <link rel="icon" href="/logo.jpeg" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
