import React from 'react';
import Link from 'next/link';
import Page from '../components/Page';

export default function ThreeJs() {
  return (
    <Page showNav={false} centerContent>
      <h2>Three-JS Journey</h2>
      <ul>
        <li>
          <Link href="/threejs/basics">Basics</Link>
        </li>
        <li>
          <Link href="/threejs/particles">Particles</Link>
        </li>
        <li>
          <Link href="/threejs/galaxy">Galaxy</Link>
        </li>
        <li>
          <Link href="/threejs/physics">Physics</Link>
        </li>
        <li>
          <Link href="/threejs/models">Models</Link>
        </li>
        <li>
          <Link href="/threejs/realistic-render">Realistic render</Link>
        </li>
        <li>
          <Link href="/threejs/shaders">Shaders</Link>
        </li>
        <li>
          <Link href="/threejs/shader-patterns">Shader patterns</Link>
        </li>
        <li>
          <Link href="/threejs/raging-sea">Raging sea</Link>
        </li>
        <li>
          <Link href="/threejs/animated-galaxy">Animated galaxy</Link>
        </li>
      </ul>

      <h2>Experiments</h2>
      <ul>
        <li>
          <Link href="/threejs/flying">Flying</Link>
        </li>
        <li>
          <Link href="/threejs/valley">Valley</Link>
        </li>
      </ul>
    </Page>
  );
}
