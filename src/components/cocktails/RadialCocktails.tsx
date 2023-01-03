/* eslint-disable no-undef */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

import { background, blue, categoryColorScale, ingredientColorScale } from './colors';
import { CocktailHierarchy, IngredientHierarchy } from './types';

import getCocktailEditDistance from './parsers/getCocktailEditDistance';
import getCocktailPack from './parsers/getCocktailPack';
import getCocktailLookup from './parsers/getCocktailLookup';
import { forceCollide, forceSimulation, forceX, forceY } from 'd3-force';
import useStore from './appStore';
import useUrlCocktail from './useUrlCocktail';

type RadialCocktailsProps = {
  pack: ReturnType<typeof getCocktailPack>;
  lookup: ReturnType<typeof getCocktailLookup>;
};

interface AxisCoord {
  axis: string;
  x: number;
  y: number;
  value: number;
  scaledValue: number;
}

const PI = Math.PI;
const TWO_PI = 2 * Math.PI;
const AXIS_ROTATION = -PI * 0.5;
const AXIS_ANGLES = {
  alcohol: 0 + AXIS_ROTATION,
  acid: 0.33 * TWO_PI + AXIS_ROTATION,
  sweet: 0.667 * TWO_PI + AXIS_ROTATION,
};
const AXIS_LABEL = {
  alcohol: 'alcoholic',
  acid: 'citrus-y',
  sweet: 'sweet',
};
const AXES = Object.keys(AXIS_ANGLES);
const RADIUS_MULTIPLE = 1.5;

export default function RadialCocktails({ pack, lookup }: RadialCocktailsProps) {
  const {
    size: { width, height },
  } = useThree();

  const size = Math.min(width, height);
  const radius = 2 * size;
  const layoutInProgress = useRef(false);

  const cocktailXY = useMemo(() => {
    layoutInProgress.current = true;
    const result: {
      [cocktail: string]: {
        cocktail: string;
        color: string;
        x: number;
        y: number;
        coords: AxisCoord[];
        isMarker?: boolean;
      };
    } = {};

    // compute extent of each axis
    const axisExtents: Record<keyof typeof AXIS_ANGLES, [number, number]> = {
      alcohol: [0, 1], //[Infinity, -Infinity],
      acid: [0, 1], //[Infinity, -Infinity],
      sweet: [0, 1], //[Infinity, -Infinity],
    };

    // pack.children.forEach(cocktail => {
    //   AXES.forEach(axis => {
    //     const value = cocktail.data.balance[axis];
    //     axisExtents[axis][0] = Math.min(axisExtents[axis][0], value);
    //     axisExtents[axis][1] = Math.max(axisExtents[axis][1], value);
    //   });
    // });

    pack.children.forEach(cocktail => {
      const axisCoords: AxisCoord[] = [];

      AXES.forEach(axis => {
        const angle = AXIS_ANGLES[axis];
        const value = cocktail.data.balance[axis];
        const [min, max] = axisExtents[axis];
        const scaledValue = (value - min) / (max - min);

        axisCoords.push({
          axis,
          scaledValue,
          value,
          x: Math.cos(angle) * scaledValue * radius,
          y: -Math.sin(angle) * scaledValue * radius,
        });
      });

      // compute overall x,y as the mean of individual axes
      const colors = axisCoords.map(c => new THREE.Color(categoryColorScale(c.axis)));
      const color = new THREE.Color();
      axisCoords.forEach((c, i) => color.lerp(colors[i], c.scaledValue));
      result[cocktail.data.name] = {
        cocktail: cocktail.data.name,
        coords: axisCoords,
        color: `#${color.getHexString()}`,
        x: axisCoords.reduce((x, coord) => x + coord.x, 0) / axisCoords.length,
        y: axisCoords.reduce((y, coord) => y + coord.y, 0) / axisCoords.length,
      };
    });

    // visual markers
    // AXES.forEach(axis => {
    //   result[axis] = {
    //     cocktail: AXIS_LABEL[axis],
    //     color: 'white',
    //     isMarker: true,
    //     coords: [],
    //     x: Math.cos(AXIS_ANGLES[axis]) * axisExtents[axis][1] * 0.2 * radius,
    //     y: -Math.sin(AXIS_ANGLES[axis]) * axisExtents[axis][1] * 0.2 * radius,
    //   };

    //   // fix these in the simulation
    //   result[axis].fx = result[axis].x;
    //   result[axis].fy = result[axis].y;
    // });

    console.log(result);
    return result;
  }, [pack, radius]);

  // simulation
  const layout = useMemo(() => {
    const simulation = forceSimulation(Object.values(cocktailXY))
      .force(
        'radius',
        forceCollide().radius(d => {
          const r = lookup?.[d?.cocktail]?.r ?? 0;
          return r * (RADIUS_MULTIPLE * 1.1);
        }),
      )
      .force(
        'x',
        forceX().x(d => d.x),
      )
      .force(
        'y',
        forceY().y(d => d.y),
      )
      .stop();
    return simulation;
  }, [cocktailXY]);

  // const [, forceUpdate] = useState(0);

  // progress layout
  useFrame(() => {
    if (layoutInProgress.current && layout.alpha() >= layout.alphaMin()) {
      layout.tick(10);
      //   forceUpdate(Math.random());
      //   console.log('update');
    } else if (layoutInProgress.current) {
      layoutInProgress.current = false;
      // forceUpdate(Math.random());
    }
  });

  return (
    <group position={[0, -0.1, 0]}>
      {/** axis lines */}
      {AXES.map(axis => (
        <React.Fragment key={axis}>
          <Line
            key={axis}
            start={[0, 0, 0]}
            end={[radius * Math.cos(AXIS_ANGLES[axis]), radius * -Math.sin(AXIS_ANGLES[axis]), 0]}
          />
          <mesh
            position={[
              (Math.cos(AXIS_ANGLES[axis]) * 0.2 * radius) / size,
              (-Math.sin(AXIS_ANGLES[axis]) * 0.2 * radius) / size,
              0,
            ]}
          >
            <sphereGeometry args={[0.008, 1, 1]} />
            <meshBasicMaterial transparent opacity={0} />

            <Html
              center
              distanceFactor={20}
              style={{
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                color: categoryColorScale(axis),
                background: axis === 'sweet' ? 'rgba(0,0,0,.5)' : 'rgba(255,255,255,0.5)',
              }}
            >
              {AXIS_LABEL[axis]}
            </Html>
          </mesh>
        </React.Fragment>
      ))}

      {layout.nodes().map(d => {
        const { cocktail: name, color } = d;
        const cocktail = lookup[name];

        return <Cocktail key={name} cocktail={cocktail} layout={d} color={color} ingredients />;
      })}
    </group>
  );
}

function Line({ start, end, color = 'darkgreen' }) {
  const ref = useRef<THREE.Line>();
  useEffect(() => {
    ref.current.geometry.setFromPoints([start, end].map(point => new THREE.Vector3(...point)));
  }, [start, end]);

  return (
    <line ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color={color} />
    </line>
  );
}

interface CocktailProps {
  cocktail: CocktailHierarchy;
  layout: { x: number; y: number };
  color?: string;
  ingredients?: boolean;
}

const HOVER_SCALE = 5;

function Cocktail({
  cocktail,
  layout,
  // passed color
  color,
  ingredients,
}: CocktailProps) {
  const {
    size: { width, height },
  } = useThree();
  //   const color = '#fff';
  const groupRef = useRef<THREE.Group>();
  const [isHovered, setIsHovered] = useState(false);
  const { setCocktail } = useStore();

  const multiplier = RADIUS_MULTIPLE;
  const size = Math.min(width, height);
  const r = cocktail.r / size;
  const positionVec3 = useMemo(() => new THREE.Vector3(), []);
  const nextScale = useMemo(
    () =>
      new THREE.Vector3(
        isHovered ? HOVER_SCALE : 1,
        isHovered ? HOVER_SCALE : 1,
        isHovered ? HOVER_SCALE : 1,
      ),
    [isHovered],
  );

  useFrame(() => {
    // update position + scale
    if (groupRef?.current) {
      const currPosition = groupRef.current.position;
      if (
        Math.abs(currPosition.x - layout.x) > 0.01 ||
        Math.abs(currPosition.y - layout.y) > 0.01
      ) {
        positionVec3.setZ(0);
        positionVec3.setX(layout.x / size);
        positionVec3.setY(layout.y / size);
        currPosition.lerp(positionVec3, 0.1);
      }

      const currScale = groupRef.current.scale;
      if (Math.abs(currScale.x - nextScale.x) > 0.01) {
        currScale.lerp(nextScale, 0.2);
        positionVec3.setZ(2 * r);
        currPosition.lerp(positionVec3, 0.1);
      }
    }
  });

  const setCocktailUrl = useUrlCocktail();

  return (
    <group ref={groupRef}>
      <mesh
        onPointerOver={e => {
          e.stopPropagation(); // don't trigger hover on other cocktails
          setIsHovered(true);
        }}
        onPointerOut={() => setIsHovered(false)}
        onClick={() => {
          console.log(cocktail);
          setCocktail(cocktail);
          setCocktailUrl(cocktail.data.name);
        }}
      >
        <sphereGeometry args={[r * multiplier, 8, isHovered ? 30 : 10]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isHovered ? 0.7 : 0.5}
          side={THREE.BackSide}
        />

        {isHovered && (
          <Html
            distanceFactor={10}
            style={{
              pointerEvents: 'none',
              transform: `translate(-50%, -${HOVER_SCALE * multiplier * r * size}px)`, // @TODO not perfect but r not good
              whiteSpace: 'nowrap',
              color: '#222',
              background: 'rgba(255,255,255,0.5)',
            }}
          >
            {cocktail.data.name}
          </Html>
        )}
      </mesh>

      {ingredients &&
        cocktail.children.map(ingredient => (
          <Ingredient
            key={ingredient.data.verbose_ingredient}
            ingredient={ingredient}
            r={(multiplier * ingredient.r) / size}
            position={[
              (multiplier * (ingredient.x - ingredient.parent.x)) / size,
              (multiplier * (ingredient.y - ingredient.parent.y)) / size,
              0,
            ]}
            showLabel={isHovered}
            color={
              false
                ? ingredientColorScale(ingredient.data.simple_ingredient)
                : categoryColorScale(ingredient.data.category)
            }
          />
        ))}
    </group>
  );
}

function Ingredient({
  ingredient,
  r,
  showLabel,
  color,
  ...meshProps
}: {
  ingredient: IngredientHierarchy;
  r: number;
  showLabel?: boolean;
  color?: string;
}) {
  return (
    <mesh {...meshProps}>
      <sphereGeometry args={[r, 10, 20]} />
      {/* <meshBasicMaterial color={color} /> */}
      <meshPhongMaterial shininess={20} color={color} />

      {showLabel && (
        <Html
          center
          distanceFactor={5}
          style={{
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            color: '#222',
            background: 'rgba(255,255,255,0.5)',
          }}
        >
          {ingredient.data.simple_ingredient}
        </Html>
      )}
    </mesh>
  );
}
