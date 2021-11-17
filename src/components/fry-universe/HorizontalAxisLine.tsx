import React, { forwardRef, useMemo } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { highlightColor } from './colors';
import { axisWidth } from './Layout';
import getViewportWidth from './utils/getViewportWidth';

const HorizontalAxisLine = forwardRef((_, ref) => {
  const viewport = useThree(state => state.viewport);
  const viewportWidth = getViewportWidth(viewport.width, viewport.dpr);
  const geometry = useMemo(() => {
    const triangleShape = new THREE.Shape();
    triangleShape.moveTo(0, 0);
    triangleShape.lineTo(viewportWidth * axisWidth, 0);
    triangleShape.lineTo(viewportWidth * axisWidth, 0.3);
    triangleShape.lineTo(0, 0.3);
    triangleShape.lineTo(0, 0);
    return new THREE.ShapeGeometry(triangleShape);
  }, [viewportWidth]);
  return (
    // set z behind models
    <mesh ref={ref} position={[0, 0, -100]} geometry={geometry}>
      <meshBasicMaterial color={highlightColor} />
    </mesh>
  );
});

export default HorizontalAxisLine;
