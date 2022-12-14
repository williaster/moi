import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';

import Page from '../components/Page';
import { backgroundColor, textColor } from '../components/cocktails/colors';

function Scene() {
  return (
    <>
      <OrbitControls />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshNormalMaterial color="hotpink" />
      </mesh>
    </>
  );
}

export default function CocktailPage() {
  return (
    <>
      <Page
        title="Cocktails"
        description="Explore the world of cocktails."
        // previewImgUrl="https://raw.githubusercontent.com/williaster/moi/gh-pages/static/images/fry-universe/site-preview.png"
        previewImgDescription="Image of cocktails"
        centerContent={false}
        showNav={false}
      >
        <div className="canvas">
          <Canvas
            // camera={{ near: -300, far: 300, zoom: 3 }}
            gl={{ antialias: true }}
            dpr={Math.max(typeof window === 'undefined' ? 2 : window.devicePixelRatio, 2)}
          >
            <React.Suspense fallback={null}>
              <Scene />
            </React.Suspense>
            {typeof window !== 'undefined' && window.location.search.includes('stats') && (
              <Stats className="stats" />
            )}
          </Canvas>
        </div>
      </Page>
      <style global jsx>{`
        .main {
          height: 100%;
          width: 100%;
          background: ${backgroundColor};
          color: ${textColor};
          overflow: visible;
        }
        p {
          margin-top: 0.6em;
        }
        .page {
          padding: 0;
        }
        .canvas {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          overflow: hidden;
          z-index: 10;
        }
        .stats {
          top: initial !important;
          left: initial !important;
          bottom: 0;
          right: 0;
        }
      `}</style>
    </>
  );
}
