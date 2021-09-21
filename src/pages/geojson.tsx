import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useResource, useFrame } from 'react-three-fiber';
import * as THREE from 'three';
import { OrbitControls, Reflector } from '@react-three/drei';
import { mesh as topojsonMesh } from 'topojson-client';

import Page from '../components/Page';
import getGraticules from '../utils/getGraticules';
import geoJsonToGeometry from '../utils/geoJsonToGeometry';
import useData from '../hooks/useData';

const background = '#222';

function Scene({ radius = 80 }) {
  const mesh = useRef();
  const graticules = useMemo(() => geoJsonToGeometry(getGraticules(), radius, false), []);
  const countries = useData<any, ReturnType<typeof geoJsonToGeometry>>({
    url: 'https://unpkg.com/world-atlas@1/world/50m.json',
    parser: topology => {
      const topoMesh = topojsonMesh(topology, topology.objects.land);
      console.log({ topoMesh });
      return geoJsonToGeometry(topoMesh, radius, false);
    },
  });

  useFrame(() => {
    if (!mesh.current) return;
    // mesh.current.rotation.x += 0.002;
    mesh.current.rotation.z += 0.001;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      {/* <pointLight intensity={0.5} color="#fff" position={[0, 0, 100]} /> */}

      {/* <lineSegments>
        <edgesGeometry attach="geometry" args={[graticules]} />
        <lineBasicMaterial color="red" attach="material" />
      </lineSegments> */}

      <mesh ref={mesh} position={[0, 0, 0]}>
        <primitive
          object={
            new THREE.LineSegments(graticules, new THREE.LineBasicMaterial({ color: '#a5a5a5' }))
          }
        />

        {countries.data && (
          <primitive
            object={
              //   new THREE.Mesh(countries.data, new THREE.MeshBasicMaterial({ color: '#003f36' }))
              new THREE.LineSegments(
                countries.data,
                new THREE.MeshBasicMaterial({ color: '#003f36' }),
              )
            }
          />
        )}
      </mesh>

      {/* <mesh position={[0, 0, -50]} receiveShadow>
        <planeBufferGeometry args={[100, 100, 1, 1]} />
        <meshPhongMaterial color="#ad93dd" reflectivity={0.2} side={THREE.DoubleSide} />
      </mesh> */}
    </>
  );
}

function GeoJson() {
  return (
    <>
      <Page centerContent={false} showNav={false} padding={false}>
        <div className="canvas">
          <Canvas
            shadowMap
            camera={{ position: [0, 0, 200], fov: 100 }}
            // onCreated={canvas => canvas.gl.setClearColor(background)}
          >
            <Scene />
            <OrbitControls listenToKeyEvents={false} />
          </Canvas>
        </div>
      </Page>

      <style global jsx>{`
        .main {
          overflow: hidden;
          background: ${background};
          justify-content: flex-start;
        }

        .canvas,
        canvas {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          overflow: hidden;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}

export default GeoJson;
