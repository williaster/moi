/* eslint-disable no-undef */
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { forceCollide, forceSimulation, forceX, forceY } from 'd3-force';
import getCocktailPack from '../parsers/getCocktailPack';
import getCocktailLookup from '../parsers/getCocktailLookup';
import { categoryColorScale } from '../colors';
import { AXIS_ANGLES, AXES } from '../constants';

interface AxisCoord {
  axis: string;
  x: number;
  y: number;
  value: number;
  scaledValue: number;
}

// Note: using constant extents preserves layout during filtering
// updating based on filtered cocktails doesn't have a great UX
const axisExtents: Record<typeof AXES, [number, number]> = {
  alcohol: [0, 1],
  acid: [0, 1],
  sweet: [0, 1],
};

const RADIUS_MULTIPLE = 1.4;

interface AxisLayoutOptions {
  pack: ReturnType<typeof getCocktailPack>;
  lookup: ReturnType<typeof getCocktailLookup>;
}

interface CocktailXY {
  cocktail: string;
  color: string;
  x: number;
  y: number;
  coords: AxisCoord[];
  isMarker?: boolean;
}

export default function useAxisLayout({ pack, lookup }: AxisLayoutOptions) {
  const layoutInProgress = useRef(false);
  const {
    size: { width, height },
  } = useThree();

  const size = Math.min(width, height);
  const radius = 2 * size;

  // x,y coordinates of each cocktail based on their AXIS values
  const cocktailCoords: CocktailXY[] = useMemo(() => {
    layoutInProgress.current = true;

    const result = pack.children.map(cocktail => {
      // axis coords of each cocktail
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

      // blend the color of each axis color into a single color
      axisCoords.forEach((c, i) => color.lerp(colors[i], c.scaledValue));

      const coords: CocktailXY = {
        cocktail: cocktail.data.name,
        coords: axisCoords,
        color: `#${color.getHexString()}`,
        // x,y are the average x,y across all axes
        x: axisCoords.reduce((x, coord) => x + coord.x, 0) / axisCoords.length,
        y: axisCoords.reduce((y, coord) => y + coord.y, 0) / axisCoords.length,
      };

      return coords;
    });

    return result;
  }, [pack, radius]);

  // use force simulation to compute layout from specific x/y coordinates
  const layout = useMemo(() => {
    const simulation = forceSimulation(cocktailCoords)
      .force(
        'radius',
        forceCollide().radius((d: CocktailXY) => {
          const cocktail = lookup?.[d?.cocktail];
          const r = cocktail?.r ?? 0;
          return cocktail?.data.hidden ? 0 : r * RADIUS_MULTIPLE;
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
  }, [cocktailCoords, lookup]);

  // progress layout until it reaches equilibrium
  useFrame(() => {
    if (layoutInProgress.current && layout.alpha() >= layout.alphaMin()) {
      layout.tick(4);
    } else if (layoutInProgress.current) {
      layoutInProgress.current = false;
    }
  });

  return layout;
}
