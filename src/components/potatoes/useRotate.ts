import { Ref, RefObject } from 'react';
import { useFrame } from '@react-three/fiber';

export default function useRotate(ref: RefObject<THREE.Mesh | THREE.Group>) {
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.005 % (Math.PI * 2);
    }
  });
}
