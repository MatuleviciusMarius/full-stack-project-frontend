import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import Head from 'next/head';

import React from 'react';

export default function Failure() {
  return (
    <>
      <Head>
        <title>My Dream World</title>
      </Head>
      <Header />
      Nepavyko
      <Footer />
    </>
  );
}
