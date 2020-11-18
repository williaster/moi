import React from 'react';
import Page from '../components/Page';

function HomePage() {
  return (
    <Page className="home">
      Welcome to moi.
      <style jsx global>{`
        .home {
          background-color: #d5fdff;
          background-image: radial-gradient(#ac73ff 1px, #d5fdff 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </Page>
  );
}

export default HomePage;
