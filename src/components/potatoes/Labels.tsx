import { useThree } from '@react-three/fiber';
import React from 'react';
import * as colors from './colors';
import { useLabelPositioning } from './Layout';
import Text from './Text';

const fontSize = 0.05;

export default function Labels() {
  const { betterRef, worseRef, friedUnfriedRef } = useLabelPositioning();
  const viewport = useThree(state => state.viewport);

  const scaledFontSize = fontSize * Math.min(viewport.height, viewport.width);
  const scaledFontSizeSmall = scaledFontSize * 0.8;
  const scaledFontSizeSmaller = scaledFontSizeSmall * 0.8;

  return (
    <>
      <group ref={betterRef}>
        <Text color={colors.textColorDarker} fontSize={scaledFontSize} anchorX="right">
          Better
        </Text>
        <Text
          position-x={3}
          color={colors.textColorDarker}
          fontSize={scaledFontSizeSmaller * 0.8}
          anchorX="left"
        >
          ( in my opinion )
        </Text>
      </group>
      <Text
        ref={worseRef}
        color={colors.textColorDarker}
        fontSize={scaledFontSize}
        anchorX="center"
      >
        Worse
      </Text>
      <group ref={friedUnfriedRef}>
        <Text color={colors.textColorDarker} fontSize={scaledFontSizeSmall} anchorX="right">
          Fried
        </Text>
        <Text
          position-x={3}
          color={colors.textColorDarker}
          fontSize={scaledFontSizeSmaller}
          anchorX="left"
        >
          (surface area)
        </Text>

        <Text
          position-y={-scaledFontSizeSmaller * 1.1}
          color={colors.textColorDark}
          fontSize={scaledFontSizeSmall}
          anchorX="right"
        >
          Unfried
        </Text>
        <Text
          position-x={3}
          position-y={-scaledFontSizeSmaller * 1.1}
          color={colors.textColorDark}
          fontSize={scaledFontSizeSmaller}
          anchorX="left"
        >
          (volume)
        </Text>
      </group>
    </>
  );
}
