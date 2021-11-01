import { useThree } from '@react-three/fiber';
import React, { useMemo } from 'react';
import * as THREE from 'three';
import * as colors from './colors';
import { useLabelPositioning } from './Layout';
import { Text } from './Text';

const fontSize = 0.05;

export default function Labels() {
  const { betterRef, worseRef, friedUnfriedRef } = useLabelPositioning();
  const viewport = useThree(state => state.viewport);

  const scaledFontSize = fontSize * Math.min(viewport.height, viewport.width);

  return (
    <>
      <Text
        ref={betterRef}
        color={colors.textColorDarker}
        fontSize={scaledFontSize}
        anchorX="center"
      >
        Better
      </Text>
      <Text
        ref={worseRef}
        color={colors.textColorDarker}
        fontSize={scaledFontSize}
        anchorX="center"
      >
        Worse
      </Text>
      {/* <group ref={friedUnfriedRef}>
        <Text color={colors.textColorDarker} fontSize={scaledFontSize} anchorX="right">
          Fried
        </Text>
        <Text
          position-y={scaledFontSize * 1.1}
          color={colors.textColorDark}
          fontSize={scaledFontSize}
          anchorX="right"
        >
          Unfried
        </Text>
      </group> */}
    </>
  );
}
