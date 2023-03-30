/* eslint-disable no-undef */
import React, { useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

import { background, blue, ingredientColorScale, text } from './colors';

import getIngredientPack from './parsers/getIngredientPack';

export default function IngredientPack({
  ingredientPack,
}: {
  ingredientPack: ReturnType<typeof getIngredientPack>;
}) {
  const {
    size: { width, height },
  } = useThree();
  const size = Math.min(width, height);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <>
      {ingredientPack.children.map(category => {
        const showCategoryLabel = true;

        return (
          <group
            key={category.data.name}
            position={[category.x / size - 1, category.y / size - 1, 0]}
          >
            <mesh>
              <sphereGeometry args={[category.r / size, 15, 20]} />
              <meshBasicMaterial color={'white'} transparent opacity={0.2} />
              {showCategoryLabel && (
                <Html
                  center
                  distanceFactor={10}
                  style={{
                    pointerEvents: 'none',
                    color: '#222',
                    fontWeight: 'bold',
                    transform: `translate(-${0.8 * category.r}px, -${0.8 * category.r}px)`,
                  }}
                >
                  {category.data.name}
                </Html>
              )}
            </mesh>

            {category.children.map(simple => {
              const simpleColor = ingredientColorScale(simple.data.name);
              const showSimpleLabel =
                !hovered || simple.children?.every(verb => verb.data.name !== hovered);
              return (
                <group
                  key={simple.data.name}
                  position={[
                    (simple.x - simple.parent.x) / size,
                    (simple.y - simple.parent.y) / size,
                    0,
                  ]}
                >
                  {showSimpleLabel && (
                    <Html
                      center
                      distanceFactor={5}
                      style={{ pointerEvents: 'none', color: '#222' }}
                    >
                      {simple.data.name}
                    </Html>
                  )}

                  {simple.children.map(verbose => {
                    const showVerboseLabel = hovered === verbose.data.name;
                    return (
                      <group
                        key={verbose.data.name}
                        position={[
                          (verbose.x - verbose.parent.x) / size,
                          (verbose.y - verbose.parent.y) / size,
                          0,
                        ]}
                      >
                        <mesh
                          onPointerOver={e => {
                            e.stopPropagation(); // don't trigger hover on other cocktails
                            setHovered(verbose.data.name);
                          }}
                          onPointerOut={() => setHovered(null)}
                        >
                          <sphereGeometry args={[verbose.r / size, 15, 20]} />
                          <meshPhongMaterial color={simpleColor} shininess={50} />
                          {showVerboseLabel && (
                            <Html
                              center
                              distanceFactor={5}
                              style={{ pointerEvents: 'none', color: '#222', whiteSpace: 'nowrap' }}
                            >
                              {verbose.data.name}
                            </Html>
                          )}
                        </mesh>
                      </group>
                    );
                  })}
                </group>
              );
            })}
          </group>
        );
      })}
    </>
  );
}
