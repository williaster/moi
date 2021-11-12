import React from 'react';
import ToonOutlineMesh from '../ToonOutlineMesh';
import { Vis as PotatoVis } from '../PotatoVis';
import potatoData from '../potatoData';
import { usePotatoPositioning } from '../Layout';
import HorizontalAxisLine from '../HorizontalAxisLine';
import Text from '../Text';
import { useTotModel } from '../useModel';

type TotProps = {
  stroke: string;
  fill: string;
  fontSize: number;
  labelColor: string;
};

function Tot({ stroke, fill }: TotProps) {
  const totGeometry = useTotModel();
  const {
    groupRef,
    labelRef,
    visRef,
    visMorphRef,
    modelRef,
    uniformsRef,
    lineRef,
  } = usePotatoPositioning('tot');
  return (
    <group ref={groupRef}>
      <ToonOutlineMesh ref={modelRef} uniformsRef={uniformsRef} geometry={totGeometry} />
      <PotatoVis
        ref={visRef}
        morphRef={visMorphRef}
        geometry={totGeometry}
        stroke={stroke}
        fill={fill}
        datum={potatoData.tot}
      />
      <HorizontalAxisLine ref={lineRef} />
      <Text ref={labelRef} anchorX="right">
        Tater tot
      </Text>
    </group>
  );
}

export default Tot;
