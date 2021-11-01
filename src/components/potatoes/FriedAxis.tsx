import { useThree } from '@react-three/fiber';
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { highlightColor, highlightColorDark } from './colors';
import { useAxisPositioning } from './Layout';
import { Text } from './Text';

const axisHeight = 0.015;
const fontSize = 0.021;
const color = highlightColor;
const fontColor = highlightColorDark;

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
  const scaledFontSize = fontSize * Math.min(viewport.height, viewport.width);
  return (
    <group ref={groupRef}>
      <mesh ref={axisRef} geometry={triangleGeometry}>
        <meshBasicMaterial color={color} />
      </mesh>
      <group position={[0, 10, 0]}>
        <Text anchorY="bottom" color={fontColor} fontSize={scaledFontSize} anchorX="left">
          Less fried
        </Text>
        <Text
          color={fontColor}
          fontSize={scaledFontSize}
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
