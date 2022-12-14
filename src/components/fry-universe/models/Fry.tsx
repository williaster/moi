import React from 'react';
import ToonOutlineMesh from '../ToonOutlineMesh';
import { Vis as PotatoVis } from '../PotatoVis';
import potatoData from '../potatoData';
import { usePotatoPositioning } from '../Layout';
import HorizontalAxisLine from '../HorizontalAxisLine';
import Text from '../Text';
import { useFryModel } from '../useModel';

type FryProps = {
  stroke: string;
  fill: string;
  fontSize: number;
  labelColor: string;
};

function Fry({ stroke, fill }: FryProps) {
  const fryGeometry = useFryModel();
  const {
    groupRef,
    labelRef,
    visRef,
    visMorphRef,
    modelRef,
    uniformsRef,
    lineRef,
  } = usePotatoPositioning('fry');
  return (
    <group ref={groupRef}>
      <ToonOutlineMesh ref={modelRef} uniformsRef={uniformsRef} geometry={fryGeometry} />
      <PotatoVis
        ref={visRef}
        morphRef={visMorphRef}
        geometry={fryGeometry}
        stroke={stroke}
        fill={fill}
        datum={potatoData.fry}
      />
      <HorizontalAxisLine ref={lineRef} />
      <Text ref={labelRef} anchorX="right">
        Fry
      </Text>
    </group>
  );
}

export default Fry;
