import { useThree } from '@react-three/fiber';
import React, { forwardRef, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { highlightColor, textColorDarker } from './colors';
import { useAxisPositioning } from './Layout';
import { Text } from './Text';

const axisHeight = 0.015;

export default function FriedAxis() {
  const { groupRef, axisRef, axisWidth, label1 } = useAxisPositioning();
  const viewport = useThree(state => state.viewport);
  const triangleGeometry = useMemo(() => {
    const triangleShape = new THREE.Shape();
    triangleShape.moveTo(0, 0);
    triangleShape.lineTo(viewport.width * axisWidth, 0);
    triangleShape.lineTo(viewport.width * axisWidth, viewport.height * axisHeight);
    triangleShape.lineTo(0, 0);
    return new THREE.ShapeGeometry(triangleShape);
  }, [viewport.width, viewport.height]);

  return (
    <group ref={groupRef}>
      <mesh ref={axisRef} geometry={triangleGeometry}>
        <meshBasicMaterial color={highlightColor} />
      </mesh>
      <group position={[0, 10, 0]}>
        <Text fontSize={5} anchorX="left" color={textColorDarker}>
          {label1}
        </Text>
        <Text
          fontSize={5}
          anchorX="right"
          position={[viewport.width * axisWidth, 0, 0]}
          color={textColorDarker}
        >
          Better
        </Text>
      </group>
    </group>
  );
}
