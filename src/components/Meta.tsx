import React from 'react';
import Head from 'next/head';

const Meta = ({ title = 'christopher card williams' }) => (
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Hind"></link>
      <title>{title}</title>
      <link rel="shortcut icon" type="image/png" href="static/favicon.png" />
    </Head>
    <style jsx global>{`
      html,
      body {
        width: 100vw;
        height: 100%;
        overflow-x: hidden;
        font-family: 'Hind', -apple-system, BlinkMacSystemFont, sans-serif;
        background: #f0f5f9;
        display: flex;
        color: #384259;
        padding: 0;
        margin: 0;
        font-size: 18px;
        line-height: 1.5em;
      }

      #__next,
      .wrapper {
        position: relative;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        max-width: 105rem;
        margin: 0 auto;
        height: 100%;
        width: 100%;
      }

      ol,
      ul {
        padding-left: 0;
      }

      blockquote {
        margin-left: 0;
      }

      li {
        list-style-type: none;
      }

      p {
        margin: 1rem 0;
      }

      code {
        font-family: 'Menlo', monospace;
        font-weight: bold;
        padding: 0.2rem 0.3rem;
        background-color: #ebebeb;
        line-height: 1.8em;
        font-size: 14px;
      }

      h1 {
        font-size: 3em;
        line-height: 1em;
        display: block;
        margin-bottom: 3rem;
      }

      h2 {
        font-size: 2.5em;
        line-height: 1em;
        margin-bottom: 0.2rem;
        margin-top: 1rem;
        display: block;
      }

      a {
        color: #1e2022;
        font-weight: 400;
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }
    `}</style>
  </div>
);
export default Meta;
