import React from 'react';
import ToonOutlineMesh from '../ToonOutlineMesh';
import { Vis as PotatoVis } from '../PotatoVis';
import potatoData from '../potatoData';
import { usePotatoPositioning } from '../Layout';
import HorizontalAxisLine from '../HorizontalAxisLine';
import Text from '../Text';
import { useWedgeModel } from '../useModel';

type WedgeProps = {
  stroke: string;
  fill: string;
  fontSize: number;
  labelColor: string;
};

function Wedge({ stroke, fill }: WedgeProps) {
  const wedgeGeometry = useWedgeModel();
  const {
    groupRef,
    labelRef,
    visRef,
    visMorphRef,
    modelRef,
    uniformsRef,
    lineRef,
  } = usePotatoPositioning('wedge');
  return (
    <group ref={groupRef}>
      <ToonOutlineMesh ref={modelRef} uniformsRef={uniformsRef} geometry={wedgeGeometry} />
      <PotatoVis
        ref={visRef}
        morphRef={visMorphRef}
        geometry={wedgeGeometry}
        stroke={stroke}
        fill={fill}
        datum={potatoData.wedge}
      />
      <HorizontalAxisLine ref={lineRef} />
      <Text ref={labelRef} anchorX="right">
        Potato wedge
      </Text>
    </group>
  );
}

export default Wedge;
