import { Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import React from 'react';

import { categoryColorScale } from './colors';
import { AXES, AXIS_ANGLES, AXIS_LABEL } from './constants';
import Line from './Line';

interface BalanceAxesProps {
  radius: number;
}

export default function BalanceAxes({ radius }: BalanceAxesProps) {
  const {
    size: { width, height },
  } = useThree();

  const size = Math.min(width, height);

  return (
    <>
      {AXES.map(axis => (
        <React.Fragment key={axis}>
          <Line
            start={[0, 0, 0]}
            end={[radius * Math.cos(AXIS_ANGLES[axis]), radius * -Math.sin(AXIS_ANGLES[axis]), 0]}
          />
          <mesh
            position={[
              (Math.cos(AXIS_ANGLES[axis]) * 0.2 * radius) / size,
              (-Math.sin(AXIS_ANGLES[axis]) * 0.2 * radius) / size,
              0,
            ]}
          >
            <sphereGeometry args={[0.008, 1, 1]} />
            <meshBasicMaterial transparent opacity={0} />

            <Html
              center
              distanceFactor={20}
              style={{
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                color: categoryColorScale(axis),
                background: axis === 'sweet' ? 'rgba(0,0,0,.5)' : 'rgba(255,255,255,0.5)',
              }}
            >
              {AXIS_LABEL[axis]}
            </Html>
          </mesh>
        </React.Fragment>
      ))}
    </>
  );
}
