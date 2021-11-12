import React from 'react';
import ToonOutlineMesh from '../ToonOutlineMesh';
import { Vis as PotatoVis } from '../PotatoVis';
import potatoData from '../potatoData';
import { usePotatoPositioning } from '../Layout';
import HorizontalAxisLine from '../HorizontalAxisLine';
import Text from '../Text';
import { usePotatoModel } from '../useModel';

type PotatoProps = {
  stroke: string;
  fill: string;
  fontSize: number;
  labelColor: string;
};

function Potato({ stroke, fill }: PotatoProps) {
  const potatoGeometry = usePotatoModel();
  const {
    groupRef,
    labelRef,
    visRef,
    visMorphRef,
    modelRef,
    uniformsRef,
    lineRef,
  } = usePotatoPositioning('potato');
  return (
    <group ref={groupRef}>
      <ToonOutlineMesh ref={modelRef} uniformsRef={uniformsRef} geometry={potatoGeometry} />
      <PotatoVis
        ref={visRef}
        morphRef={visMorphRef}
        geometry={potatoGeometry}
        stroke={stroke}
        fill={fill}
        datum={potatoData.potato}
      />
      <HorizontalAxisLine ref={lineRef} />
      <Text ref={labelRef} anchorX="right">
        Potato
      </Text>
    </group>
  );
}

export default Potato;
