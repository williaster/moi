import * as THREE from 'three';
import React from 'react';
import ToonOutlineMesh from '../ToonOutlineMesh';
import { Vis as PotatoVis } from '../PotatoVis';
import potatoData from '../potatoData';
import { usePotatoPositioning } from '../Layout';
import HorizontalAxisLine from '../HorizontalAxisLine';
import Text from '../Text';

type TotProps = {
  stroke: string;
  fill: string;
  fontSize: number;
  labelColor: string;
};

const geometry = new THREE.CylinderBufferGeometry(1.5, 1.5, 3.5, 20, 1, false);

// while there is a model, might as well just use a cylinder...
function Tot({ stroke, fill }: TotProps) {
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
      <ToonOutlineMesh
        ref={modelRef}
        uniformsRef={uniformsRef}
        rotation-x={Math.PI * 0.05}
        rotation-y={Math.PI * 0.05}
        rotation-z={Math.PI * 0.05}
        geometry={geometry}
      />
      <PotatoVis
        ref={visRef}
        morphRef={visMorphRef}
        geometry={geometry}
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
