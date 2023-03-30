import { Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import React, { useMemo } from 'react';
import Text from '../fry-universe/Text';

import { categoryColorScale } from './colors';
import { AXES, AXIS_ANGLES, AXIS_LABEL, AXIS_LABEL_ANGLES } from './constants';
import Line from './Line';

interface BalanceAxesProps {
  radius: number;
}

export default function BalanceAxes({ radius }: BalanceAxesProps) {
  const {
    size: { width, height },
  } = useThree();

  const size = Math.min(width, height);
  const colors = useMemo(
    () => AXES.map(axis => new THREE.Color(categoryColorScale(axis)).offsetHSL(0, 0, -0.2)),
    [],
  );

  return (
    <group position={[0, 0, 0.01]}>
      {AXES.map((axis, i) => (
        <React.Fragment key={axis}>
          <Line
            start={[0, 0, 0]}
            end={[radius * Math.cos(AXIS_ANGLES[axis]), radius * -Math.sin(AXIS_ANGLES[axis]), 0]}
            color={colors[i]}
          />
          <Text
            scale={0.05}
            rotation={[0, 0, AXIS_LABEL_ANGLES[axis]]}
            color={colors[i]}
            outlineColor="#fff"
            outlineWidth={0.1}
            position={[
              (Math.cos(AXIS_ANGLES[axis]) * 0.5 * radius) / size,
              (-Math.sin(AXIS_ANGLES[axis]) * 0.5 * radius) / size,
              0,
            ]}
          >
            {AXIS_LABEL[axis]}
          </Text>
        </React.Fragment>
      ))}
    </group>
  );
}
