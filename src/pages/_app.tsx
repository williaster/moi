import React from 'react';
import { AppProps } from 'next/app';

function MoiApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MoiApp;
