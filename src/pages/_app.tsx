import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import "../app/globals.css";
import Head from 'next/head';



function MyApp({ Component, pageProps }: AppProps) {

  return (
    <Component {...pageProps} />
  );
}

export default MyApp;