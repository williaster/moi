import * as THREE from 'three';
import React from 'react';
import ToonOutlineMesh from '../ToonOutlineMesh';
import { Vis as PotatoVis } from '../PotatoVis';
import potatoData from '../potatoData';
import { usePotatoPositioning } from '../Layout';
import HorizontalAxisLine from '../HorizontalAxisLine';
import Text from '../Text';
import { useCurlyModel } from '../useModel';

type CurlyProps = {
  stroke: string;
  fill: string;
  fontSize: number;
  labelColor: string;
};

function Curly({ stroke, fill }: CurlyProps) {
  const curlyGeometry = useCurlyModel();
  const {
    groupRef,
    labelRef,
    visRef,
    visMorphRef,
    modelRef,
    uniformsRef,
    lineRef,
  } = usePotatoPositioning('curly');
  return (
    <group ref={groupRef}>
      <ToonOutlineMesh ref={modelRef} uniformsRef={uniformsRef} geometry={curlyGeometry} />
      <PotatoVis
        ref={visRef}
        morphRef={visMorphRef}
        geometry={curlyGeometry}
        stroke={stroke}
        fill={fill}
        datum={potatoData.curly}
      />
      <HorizontalAxisLine ref={lineRef} />
      <Text ref={labelRef} anchorX="right">
        Curly fry
      </Text>
    </group>
  );
}

export default Curly;
