import { useThree } from '@react-three/fiber';
import React, { forwardRef, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { highlightColor, highlightColorDark, textColorDarker } from './colors';
import { useAxisPositioning } from './Layout';
import { Text } from './Text';

const axisHeight = 0.015;
const fontSize = 0.03;

export default function FriedAxis() {
  const { groupRef, axisRef, axisWidth } = useAxisPositioning();
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
      <group position={[0, 6, 0]}>
        <Text
          anchorY="bottom"
          color={highlightColorDark}
          fontSize={fontSize * viewport.width}
          anchorX="left"
        >
          Less fried
        </Text>
        <Text
          color={highlightColorDark}
          fontSize={fontSize * viewport.width}
          anchorY="bottom"
          anchorX="right"
          position={[viewport.width * axisWidth, 0, 0]}
        >
          More fried
        </Text>
      </group>
    </group>
  );
}
