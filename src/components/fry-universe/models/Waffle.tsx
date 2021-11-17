import React from 'react';
import ToonOutlineMesh from '../ToonOutlineMesh';
import { Vis as PotatoVis } from '../PotatoVis';
import potatoData from '../potatoData';
import { usePotatoPositioning } from '../Layout';
import HorizontalAxisLine from '../HorizontalAxisLine';
import Text from '../Text';
import { useWaffleModel } from '../useModel';

type WaffleProps = {
  stroke: string;
  fill: string;
  fontSize: number;
  labelColor: string;
};

function Waffle({ stroke, fill }: WaffleProps) {
  const waffleModel = useWaffleModel();
  const {
    groupRef,
    labelRef,
    visRef,
    visMorphRef,
    modelRef,
    uniformsRef,
    lineRef,
  } = usePotatoPositioning('waffle');
  return (
    <group ref={groupRef}>
      <ToonOutlineMesh ref={modelRef} uniformsRef={uniformsRef} geometry={waffleModel} />
      <PotatoVis
        ref={visRef}
        morphRef={visMorphRef}
        geometry={waffleModel}
        stroke={stroke}
        fill={fill}
        datum={potatoData.waffle}
      />
      <HorizontalAxisLine ref={lineRef} />
      <Text ref={labelRef} anchorX="right">
        Waffle fry
      </Text>
    </group>
  );
}

export default Waffle;
