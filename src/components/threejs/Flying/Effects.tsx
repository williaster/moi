import React from 'react';
import { useControls } from 'leva';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

export default function Effects() {
  const { intensity, threshold, opacity } = useControls({
    intensity: { value: 2, min: 0.5, max: 5, step: 0.01 },
    threshold: { value: 0.5, min: 0, max: 1, step: 0.01 },
    opacity: { value: 0.9, min: 0, max: 1, step: 0.05 },
  });
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={threshold}
        intensity={intensity}
        luminanceSmoothing={0}
        opacity={opacity}
      />
    </EffectComposer>
  );
}
