import Head from 'next/head';
import PropTypes from 'prop-types';
import React from 'react';

import Analytics from './Analytics';

function Meta({ title }) {
  return (
    <div>
      <Analytics />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@hshoff" />
        <meta name="twitter:title" content="chris card williams | data visualization designer" />
        <meta name="twitter:description" content="data visualization designer" />
        {/* <meta
        name="twitter:image"
        content="https://raw.githubusercontent.com/..."
      /> */}
        <title>{`vx | ${title}`}</title>
        <link rel="shortcut icon" type="image/png" href="static/favicon.ico" />
        <link rel="stylesheet" href="static/prism/prism-funky.css" />
        <link rel="stylesheet" href="static/prism/prism-line-numbers.css" />
        <link href="https://fonts.googleapis.com/css?family=Montserrat:800" rel="stylesheet" />
      </Head>
      <style jsx global>
        {`
          body {
            width: 100vw;
            overflow-x: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen', 'Ubuntu',
              'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            background: #ffffff;
            display: flex;
            color: white;
            padding: 0;
            margin: 0;
            font-size: 18px;
            line-height: 1.8em;
          }
        `}
      </style>
    </div>
  );
}

Meta.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Meta;
