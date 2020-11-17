import React from 'react';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => {
  NProgress.done();
});
Router.events.on('routeChangeError', () => NProgress.done());

const Meta = ({ title = 'visualization components' }) => (
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <title>{`christopher card williams | ${title}`}</title>
      <link rel="shortcut icon" type="image/png" href="static/favicon.png" />
    </Head>
    <style jsx global>{`
      body {
        width: 100vw;
        overflow-x: hidden;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell',
          'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        background: #ffffff;
        display: flex;
        color: #161616;
        padding: 0;
        margin: 0;
        font-size: 20px;
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
      }

      .tilt {
        display: flex;
        flex: 1;
        min-width: 33%;
      }

      .page-left {
        display: flex;
        flex: 4;
        flex-direction: column;
        padding: 0 2rem 2rem;
        margin-bottom: 50px;
        margin-top: 140px;
      }

      .page-left h2:first-child {
        margin-top: 0;
        padding-top: 4px;
      }

      .page-right {
        display: flex;
        flex: 3;
        flex-direction: column;
        color: white;
        padding: 10px 2rem 2rem;
        margin-top: 140px;
      }

      .page-right > ul {
        display: flex;
        flex-direction: column;
        flex: 1;
        font-family: 'Karla';
        color: #000;
      }

      .page-right a {
        font-size: 14px;
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
        font-size: 54px;
        display: block;
        margin-bottom: 3rem;
      }

      h2 {
        font-size: 19px;
        margin-bottom: 0.2rem;
        margin-top: 2rem;
        display: block;
      }

      a {
        color: #272727;
        font-weight: 400;
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }

      @media (max-width: 600px) {
        .tilt {
          min-width: 100%;
        }
        #home {
          display: none;
        }
      }
    `}</style>
  </div>
);
export default Meta;
