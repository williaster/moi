import React from 'react';
import ToonOutlineMesh from '../ToonOutlineMesh';
import { Vis as PotatoVis } from '../PotatoVis';
import potatoData from '../potatoData';
import { usePotatoPositioning } from '../Layout';
import HorizontalAxisLine from '../HorizontalAxisLine';
import Text from '../Text';
import { useRidgedModel } from '../useModel';

type RidgedProps = {
  stroke: string;
  fill: string;
  fontSize: number;
  labelColor: string;
};

function Ridged({ stroke, fill }: RidgedProps) {
  const ridgedGeometry = useRidgedModel();

  const {
    groupRef,
    labelRef,
    visRef,
    visMorphRef,
    modelRef,
    uniformsRef,
    lineRef,
  } = usePotatoPositioning('ridged');
  return (
    <group ref={groupRef}>
      <ToonOutlineMesh ref={modelRef} uniformsRef={uniformsRef} geometry={ridgedGeometry} />
      <PotatoVis
        ref={visRef}
        morphRef={visMorphRef}
        geometry={ridgedGeometry}
        stroke={stroke}
        fill={fill}
        datum={potatoData.ridged}
      />
      <HorizontalAxisLine ref={lineRef} />
      <Text ref={labelRef} anchorX="right">
        Ridged chip
      </Text>
    </group>
  );
}

export default Ridged;
