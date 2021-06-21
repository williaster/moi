import React, { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import { OrbitControls } from '@react-three/drei';
import { Leva } from 'leva';
import CANNON from 'cannon';

import CanvasPage from './CanvasPage';

export default function Particles() {
  return (
    <CanvasPage background="#080024">
      <Canvas shadowMap camera={{ fov: 40 }}>
        <React.Suspense fallback={null}>
          <Scene />
          <OrbitControls listenToKeyEvents={false} />
        </React.Suspense>
      </Canvas>
      <Leva titleBar={false} />
    </CanvasPage>
  );
}

function Scene() {
  const pointLightRef = useRef<THREE.PointLight>();
  const cameraAngle = useRef(0);

  const { camera } = useThree();
  useFrame(() => {
    camera.position.x = 30 * Math.cos(cameraAngle.current);
    camera.position.z = 30 * Math.sin(cameraAngle.current);
    cameraAngle.current += 0.005;
  });

  useEffect(() => {
    camera.position.set(-30, 20, 30);

    if (pointLightRef.current) {
      pointLightRef.current.shadow.mapSize.width = 2048;
      pointLightRef.current.shadow.mapSize.height = 2048;
      pointLightRef.current.shadow.camera.near = 1;
      pointLightRef.current.shadow.camera.far = 100;
    }
  }, [pointLightRef.current]);

  const ref = useCannon();

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight castShadow intensity={0.5} color="#0ff" position={[5, 5, -5]} />
      {/* {pointLightRef.current && <pointLightHelper args={[pointLightRef.current]} />} */}
      <pointLight
        ref={pointLightRef}
        castShadow
        intensity={1}
        color="#ffff8f"
        position={[15, 15, -25]}
      />

      <mesh receiveShadow position={[0, 0, 0]} rotation={[Math.PI * 0.5, 0, 0]}>
        <planeBufferGeometry args={[150, 150]} />
        <meshPhongMaterial side={THREE.BackSide} color="#6c6c6c" reflectivity={1} />
      </mesh>

      <mesh ref={ref} receiveShadow castShadow position={[0, 10, -0.5]}>
        <sphereBufferGeometry args={[0.5, 50, 30]} />
        <meshPhongMaterial side={THREE.DoubleSide} color="#fff58a" reflectivity={0.4} />
      </mesh>

      <mesh
        ref={ref}
        receiveShadow
        castShadow
        position={[-5, 20, -0.5]}
        rotation={[Math.PI * 0.5, Math.PI, Math.PI * 0.5]}
      >
        <boxBufferGeometry args={[1, 1, 1]} />
        <meshPhongMaterial color="#e9b1b1" reflectivity={0.4} />
      </mesh>

      <mesh
        ref={ref}
        receiveShadow
        castShadow
        position={[5, 25, 5]}
        rotation={[0, Math.PI * 0.5, Math.PI]}
      >
        <boxBufferGeometry args={[1, 1, 1]} />
        <meshPhongMaterial color="#eab8ed" reflectivity={1} />
      </mesh>

      <mesh
        ref={ref}
        receiveShadow
        castShadow
        position={[-3, 25, -0.5]}
        rotation={[Math.PI * 0.5, Math.PI, 0]}
      >
        <boxBufferGeometry args={[1, 1, 1]} />
        <meshPhongMaterial color="#90e6d6" reflectivity={0.4} />
      </mesh>
    </>
  );
}

const cannon = {
  world: new CANNON.World(),
  floor: new CANNON.Body({
    mass: 0, // won't move
    shape: new CANNON.Plane(), // infinite size
  }),
};

cannon.world.gravity.set(0, -9.82, 0);
cannon.world.allowSleep = true;

// materials
const defaultMaterial = new CANNON.Material('default'); // can have multiple eg concrete/plastic
const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
  friction: 0.1,
  restitution: 0.6,
});
cannon.world.addContactMaterial(defaultContactMaterial);
cannon.world.defaultContactMaterial = defaultContactMaterial;
cannon.world.broadphase = new CANNON.SAPBroadphase(cannon.world); // naive collision

// rotate (through quaternion)
cannon.floor.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
cannon.world.addBody(cannon.floor);

function useCannon() {
  const allObjects = useRef<{ mesh: THREE.Mesh; body: CANNON.Body }[]>([]);

  useEffect(() => {}, []);

  const ref = useCallback(
    (mesh: THREE.Mesh<THREE.SphereBufferGeometry | THREE.BoxBufferGeometry>) => {
      if (!mesh || !mesh.geometry) return null;

      const { type, parameters } = mesh.geometry;
      if (type === 'SphereBufferGeometry') {
        const body = new CANNON.Body({
          mass: 0.5,
          position: new CANNON.Vec3(mesh.position.x, mesh.position.y, mesh.position.z),
          shape: new CANNON.Sphere('radius' in parameters ? parameters.radius : 1),
        });

        cannon.world.addBody(body);
        allObjects.current.push({ mesh, body });
      } else {
        const body = new CANNON.Body({
          mass: 0.5,
          position: new CANNON.Vec3(mesh.position.x, mesh.position.y, mesh.position.z),
          shape: new CANNON.Box(
            new CANNON.Vec3(
              'width' in parameters ? parameters.width * 0.5 : 1,
              'height' in parameters ? parameters.height * 0.5 : 1,
              'depth' in parameters ? parameters.depth * 0.5 : 1,
            ),
          ),
          quaternion: new CANNON.Quaternion(
            mesh.quaternion.x,
            mesh.quaternion.y,
            mesh.quaternion.z,
          ),
        });

        // body.quaternion.copy();
        cannon.world.addBody(body);
        allObjects.current.push({ mesh, body });
      }
    },
    [],
  );

  const { clock } = useThree();

  useFrame(() => {
    // step physics world and update sphere position to match
    cannon.world.step(1 / 60, clock.getDelta(), 3);

    allObjects.current.forEach(({ body, mesh }) => {
      mesh.position.copy((body.position as unknown) as THREE.Vector3);
      mesh.quaternion.copy((body.quaternion as unknown) as THREE.Quaternion);
    });

    // apply force to sphere
    // cannon.current.sphere.applyForce(new CANNON.Vec3(-0.5, 0, 0), cannon.current.sphere.position);
  });

  return ref;
}
