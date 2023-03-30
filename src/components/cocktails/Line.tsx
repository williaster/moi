import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface LineProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
}

export default function Line({ start, end, color = 'darkgreen' }: LineProps) {
  const ref = useRef<THREE.Line>();
  useEffect(() => {
    ref.current.geometry.setFromPoints([start, end].map(point => new THREE.Vector3(...point)));
  }, [start, end]);

  return (
    <line ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color={color} />
    </line>
  );
}
