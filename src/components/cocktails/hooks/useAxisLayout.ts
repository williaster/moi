/* eslint-disable no-undef */
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { forceCollide, forceSimulation, forceX, forceY } from 'd3-force';
import getCocktailPack from '../parsers/getCocktailPack';
import getCocktailLookup from '../parsers/getCocktailLookup';
import { categoryColorScale } from '../colors';
import { AXIS_ANGLES, AXES } from '../constants';
import getCocktailEditDistance from '../parsers/getCocktailEditDistance';
import useStore, { AppState } from '../appStore';
import { CocktailHierarchy } from '../types';
import getRelatedCocktails from '../parsers/getRelatedCocktails';

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
  relatedCocktails: ReturnType<typeof getRelatedCocktails>;
  ringRadius: number;
}

interface CocktailXY {
  cocktail: string;
  color: string;
  x: number;
  y: number;
  r: number;
  coords: AxisCoord[];
  theta?: number;
}

export default function useAxisLayout({
  pack,
  lookup,
  relatedCocktails,
  ringRadius: distanceRingRadius,
}: AxisLayoutOptions) {
  const layoutInProgress = useRef(false);
  const {
    size: { width, height },
  } = useThree();

  const size = Math.min(width, height);
  const radius = 2 * size;
  const { selectedCocktail } = useStore();

  // x,y coordinates of each cocktail based on their AXIS values
  const cocktailCoords: CocktailXY[] = useMemo(() => {
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
        r: lookup[cocktail.data.name].r,
      };

      return coords;
    });

    return result;
  }, [lookup, pack.children, radius]);

  // use force simulation to compute layout from specific x/y coordinates
  const layout = useMemo(() => {
    layoutInProgress.current = !selectedCocktail;

    const simulation = forceSimulation(cocktailCoords)
      .force(
        'radius',
        forceCollide().radius((d: CocktailXY) => {
          const cocktail = lookup?.[d?.cocktail];
          return cocktail?.data.hidden ? 0 : (d?.r ?? 0) * RADIUS_MULTIPLE;
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
  }, [cocktailCoords, lookup, selectedCocktail]);

  const selectedCocktailLayout = useMemo(() => {
    if (!selectedCocktail) return null;

    layoutInProgress.current = false;

    const distances = Object.keys(relatedCocktails);
    const ringCount = distances.length;
    let minCocktailSize = Infinity;

    const relatedCocktailPositions = Object.entries(relatedCocktails).reduce(
      (result, [, cocktails], i) => {
        const cocktailCount = Object.keys(cocktails).length;
        const thetaStep = Math.PI / cocktailCount;

        // increase ring size as distance grows (generally will have more cocktails further out)
        const ringRadius = distanceRingRadius * ((i + 1) / ringCount);
        const ringLength = Math.PI * ringRadius; // half a circle
        const cocktailSize = Math.min(0.1, 0.9 * (ringLength / cocktailCount));

        Object.entries(cocktails).forEach(([name, cocktail], j) => {
          // @TODO build out from center not around the ring
          const theta = -Math.PI * 0.5 + thetaStep * (j + 0.5);
          const r = cocktailSize * size * distanceRingRadius;
          minCocktailSize = Math.min(minCocktailSize, r);

          result[name] = {
            coords: [],
            x: ringRadius * Math.cos(theta) * size,
            y: ringRadius + -ringRadius * Math.sin(theta) * size,
            r,
            cocktail: cocktail.data.name,
            theta,
            color: '#222',
          };
        });

        return result;
      },
      {} as { [cocktail: string]: CocktailXY },
    );

    const nodes = layout.nodes().map(node => {
      const cocktailName = node.cocktail;
      if (cocktailName.startsWith('6th street')) debugger;
      // hidden cocktail
      if (lookup[cocktailName].data.hidden)
        return {
          ...node,
          r: 0,
        };
      // selected cocktail
      if (selectedCocktail.data.name === cocktailName) {
        return {
          ...node,
          x: -0.3 * size,
          y: 0,
          r: lookup[node.cocktail].r * 13,
        };
      }
      // related cocktail
      return {
        ...node,
        ...relatedCocktailPositions[cocktailName],
        color: node.color,
        coords: node.coords,
        r: selectedCocktail == null ? node.r : minCocktailSize, // make all consistent.
      };
    });

    return {
      nodes: () => nodes,
      tick: () => {},
    };
  }, [selectedCocktail, relatedCocktails, layout, lookup]);

  // progress layout until it reaches equilibrium
  useFrame(() => {
    if (layoutInProgress.current && layout.alpha() >= layout.alphaMin()) {
      layout.tick(4);
    } else if (layoutInProgress.current) {
      layoutInProgress.current = false;
    }
  });
  return selectedCocktailLayout || layout;
  // return layout;
}
