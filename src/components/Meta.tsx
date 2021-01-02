import React from 'react';
import Head from 'next/head';
import { linearGradient, linearGradientBlue } from '../theme';

const Meta = ({ title = 'chris williams' }) => (
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Hind:300,400,500,600,700"
      ></link>
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
        background: #fff;
        display: flex;
        color: #222;
        padding: 0;
        margin: 0;
        font-size: 22px;
        line-height: 1.5em;
        font-weight: 300;
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
        padding-left: 16px;
        border-left: 4px solid #ccc;
        font-style: oblique;
        color: #888;
      }

      li {
        list-style-type: none;
      }

      p {
        font-weight: 300;
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
        font-weight: 700;
        line-height: 1.2em;
        display: block;
        margin-bottom: 3rem;
        color: transparent;
        background: ${linearGradient};
        background-clip: text;
        -webkit-background-clip: text;
      }

      h2 {
        font-size: 2em;
        font-weight: 600;
        line-height: 1.2em;
        margin-bottom: 1em;
        margin-top: 1em;
        display: block;
        color: transparent;
        background: ${linearGradient};
        background-clip: text;
        -webkit-background-clip: text;
      }

      h3 {
        font-size: 1.5em;
        font-weight: 500;
        line-height: 1.2em;
        margin-bottom: 0.2rem;
        margin-top: 1rem;
        display: block;
        color: transparent;
        background: ${linearGradient};
        background-clip: text;
        -webkit-background-clip: text;
      }

      a {
        color: transparent;
        background: ${linearGradientBlue};
        background-clip: text;
        -webkit-background-clip: text;
        font-weight: 600;
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }
    `}</style>
  </div>
);
export default Meta;
