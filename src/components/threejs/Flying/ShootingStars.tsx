import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';

export default function ShootingStars({ count = 100, speed = 100, viewSize = 100 }) {
  const { starColor } = useControls({ starColor: '#dec068' });
  const meshRef = useRef<THREE.InstancedMesh>();
  const object3d = useMemo(() => new THREE.Object3D(), []);

  const stars = useMemo(() => {
    const result = [];
    for (let i = 0; i < count; i++) {
      const random = 20 + Math.random() * 100;
      const speedFactor = 0.01 + Math.random() / 200;
      const x = -50 + Math.random() * 100;
      const y = -50 + Math.random() * 100;
      const z = -50 + Math.random() * 100;
      result.push({ random, speedFactor, x, y, z });
    }
    return result;
  }, [count]);

  useFrame(state => {
    const { elapsedTime } = state.clock;
    stars.forEach((star, i) => {
      let { random, speedFactor, x, y, z } = star;

      const scale = Math.cos(random);
      const nextX = x + x * Math.cos(elapsedTime * speed * speedFactor) * 0.1;
      const nextY = y - elapsedTime * speed;
      // start particle from the top once it's out of view
      const nextYWrapped = (nextY % Math.max(1, viewSize)) + (speed > 0 ? viewSize / 2 : 0);

      // Update the dummy object
      object3d.position.set(nextX, nextYWrapped, z);
      object3d.scale.set(scale, scale, scale);
      object3d.rotation.set(0, (random / 100) * elapsedTime * 2 * Math.PI, 0);
      object3d.updateMatrix();

      // And apply the matrix to the instanced item
      meshRef.current.setMatrixAt(i, object3d.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <pointLight distance={40} intensity={8} color="lightblue" />
      <instancedMesh ref={meshRef} args={[null, null, count]}>
        <planeBufferGeometry args={[0.25, 10]} />
        <meshPhongMaterial color={starColor} side={THREE.DoubleSide} />
      </instancedMesh>
    </>
  );
}
