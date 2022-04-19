import type { AppProps } from "next/app";
import Head from "next/head";

import "antd/dist/antd.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>FIST Feedback</title>
        <link rel="icon" href="/favicon-32x32.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
