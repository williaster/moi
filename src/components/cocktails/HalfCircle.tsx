import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface HalfCircleProps {
  radius: number;
  start?: number;
  total?: number;
  segmentCount?: number;
  color?: string;
}

export default function HalfCircle({
  color = '#aaa',
  start = -Math.PI * 0.5,
  total = Math.PI,
  radius,
  segmentCount = 64,
}: HalfCircleProps) {
  const vertices = useMemo(() => {
    const points = [];
    for (let i = 1; i <= segmentCount; i += 1) {
      const theta = start + (i / segmentCount) * total;
      points.push(new THREE.Vector3(radius * Math.cos(theta), radius * Math.sin(theta), 0));
    }
    return points;
  }, [radius, segmentCount, start, total]);

  return <Line points={vertices} color={color} lineWidth={0.5} />;
}
