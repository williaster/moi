import React from 'react';
import Link from 'next/link';
import Page from '../components/Page';

export default function WebXR() {
  return (
    <Page showNav={false} centerContent>
      <h2>WebXR</h2>
      Note: these pages are intended to be accessed via a WebXR-ready device.
      <ul>
        <li>
          <Link href="/webxr/test">Test</Link>
        </li>
      </ul>
    </Page>
  );
}
