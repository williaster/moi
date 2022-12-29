import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import Page from '../components/Page';
import { background, text } from '../components/cocktails/colors';
import CocktailScene from '../components/cocktails/CocktailScene';

export default function CocktailPage() {
  const stats = typeof window !== 'undefined' && window.location.search.includes('stats');
  const orbit = typeof window !== 'undefined' && window.location.search.includes('orbit');
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
            camera={{ zoom: 10 }}
            gl={{ antialias: true }}
            dpr={Math.max(typeof window === 'undefined' ? 2 : window.devicePixelRatio, 2)}
          >
            <React.Suspense fallback={null}>
              <CocktailScene />
            </React.Suspense>
            <ambientLight intensity={0.5} />
            <directionalLight intensity={0.5} />

            {stats && <Stats className="stats" />}
            {orbit && <OrbitControls />}
          </Canvas>
        </div>
      </Page>
      <style global jsx>{`
        .main {
          height: 100%;
          width: 100%;
          background: ${background};
          color: ${text};
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
