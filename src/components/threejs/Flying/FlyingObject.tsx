import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { Matrix4, Quaternion, Vector3 } from 'three';

export default function FlyingObject({ speed = 100 }) {
  const {
    smokeDensity,
    smokeSpread,
    smokeLength,
    smokeColor,
    smokeOpacity,
    smokeSize,
    smokeGrowthRate,
  } = useControls({
    smokeDensity: { value: 50, min: 0, max: 1000, step: 1 },
    smokeSpread: { value: 1, min: 0, max: 10, step: 0.5 },
    smokeLength: { value: 15, min: 10, max: 100, step: 1 },
    smokeColor: '#fff',
    smokeOpacity: { value: 0.5, min: 0, max: 1, step: 0.05 },
    smokeSize: { value: 10, min: 1, max: 100, step: 1 },
    smokeGrowthRate: { value: 0.2, min: 0.1, max: 1.5, step: 0.05 },
  });
  return (
    <group position={[0, 0, 0]}>
      <mesh rotation={[0, 0, 0]}>
        <coneBufferGeometry args={[2, 5, 10]} />
        <meshStandardMaterial color="#ff8474" />
      </mesh>
      <Smoke
        color={smokeColor}
        speed={speed}
        count={smokeDensity}
        tailSize={smokeLength}
        cloudSpread={smokeSpread}
        opacity={smokeOpacity}
        growthRate={smokeGrowthRate}
        smokeMaxSize={smokeSize}
      />
    </group>
  );
}

function Smoke({
  color = '#fff',
  count = 30,
  opacity = 0.3,
  particleSize = 0.1,
  cloudSpread = 1,
  tailSize = 15,
  speed = 100,
  smokeMaxSize = 10,
  growthRate = 0.3,
}) {
  const meshRef = useRef<THREE.InstancedMesh>();
  const object3d = useMemo(() => new THREE.Object3D(), []);
  const initialY = 0;

  const particles = useMemo(() => {
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push({
        random: THREE.MathUtils.randFloatSpread(cloudSpread),
        speedVariation: 0.01 + Math.random() * 0.5,
        y: initialY + Math.random() * tailSize,
        mx: THREE.MathUtils.randFloatSpread(cloudSpread),
        mz: THREE.MathUtils.randFloatSpread(cloudSpread),
      });
    }
    return result;
  }, [count, cloudSpread, tailSize]);

  useFrame(state => {
    const { elapsedTime } = state.clock;

    particles.forEach((particle, i) => {
      let { random, speedVariation, y, mx, mz } = particle;

      const offset = elapsedTime * speed * speedVariation;
      const nextY = (y - offset) % Math.max(1, tailSize);
      const fractionY = nextY / tailSize;
      const nextX = mx * fractionY + Math.sin(mx * elapsedTime) * cloudSpread * fractionY;
      const nextZ = mz * fractionY + Math.sin(mz * elapsedTime) * cloudSpread * fractionY;
      const scale = Math.min(0.5 * Math.pow(2, Math.abs(nextY * growthRate)), smokeMaxSize);

      // Update the dummy object
      object3d.position.set(nextX, nextY, nextZ);
      object3d.scale.set(scale, scale, scale);
      object3d.rotation.set(0, 0, 0);
      object3d.updateMatrix();

      // And apply the matrix to the instanced item
      meshRef.current.setMatrixAt(i, object3d.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} position={[0, -1, 0]}>
      <sphereGeometry args={[particleSize, 10, 10]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </instancedMesh>
  );
}
