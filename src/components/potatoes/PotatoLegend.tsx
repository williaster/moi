import React from 'react';
import { Group } from '@visx/group';
import { MarkerArrow } from '@visx/marker';

const areaColor = '#8c7b4a';
const areaColorDark = '#5b502f';
const volumeColor = '#fff0c0';
const volumeColorDark = '#ae8d23';

export default function PotatoLegend() {
  const width = 200;
  const height = 120;
  const marginX = 16;
  const marginY = 16;
  const radiusInner = 10;
  const radiusOuter = 20;
  const xCircleOffset = radiusOuter;
  const yCircleOffset = radiusOuter + 6;
  const labelXOffset = xCircleOffset + 30;
  const ratioYOffset = 3 * yCircleOffset;

  return (
    <svg width={width} height={height}>
      <rect fill={'#fff'} x={0} y={0} width={width} height={height} rx={8} ry={8} />
      <Group left={marginX} top={1.5 * marginY}>
        <text fontWeight="bold" fontSize={11}>
          Interpretation
        </text>
        <MarkerArrow id="marker-arrow" stroke={'#222'} size={4} strokeWidth={1} />
        {[0, 1, 2, 3, 4].map(n => (
          <circle key={n} fill={areaColorDark} cy={ratioYOffset - n ** 2} cx={4 + n * 8} r={2} />
        ))}
        <line
          x1={labelXOffset}
          x2={labelXOffset}
          y1={ratioYOffset + 2}
          y2={ratioYOffset - 2 - 16}
          stroke={'#222'}
          markerEnd="url(#marker-arrow)"
        />
        <text
          x={labelXOffset}
          y={ratioYOffset - 8}
          dy="0.35em"
          dx="0.5em"
          fontSize={11}
          fill={'#222'}
        >
          Ratio (<tspan fill={areaColorDark}>fried</tspan> /{' '}
          <tspan fill={volumeColorDark}>unfried</tspan>)
        </text>

        <circle // outer
          cx={xCircleOffset}
          cy={yCircleOffset}
          fill={areaColor}
          fillOpacity={1}
          // stroke={'#222'}
          r={radiusOuter}
        />
        <circle // inner filled
          cx={xCircleOffset}
          cy={yCircleOffset}
          fill={volumeColor}
          stroke={'transparent'}
          r={radiusInner}
        />

        {/** annotation lines inner */}
        <line
          stroke={volumeColorDark}
          x1={xCircleOffset}
          x2={labelXOffset}
          y1={yCircleOffset}
          y2={yCircleOffset}
        />
        <text x={labelXOffset} y={yCircleOffset} dx="0.5em" fontSize={11} fill={volumeColorDark}>
          Unfried (volume)
        </text>

        {/** annotation lines outer */}
        <line // up-down
          stroke={areaColorDark}
          x1={xCircleOffset}
          x2={xCircleOffset}
          y1={yCircleOffset + radiusInner}
          y2={yCircleOffset + radiusOuter}
        />
        <line // top left-right
          stroke={areaColorDark}
          x1={xCircleOffset - 2}
          x2={xCircleOffset + 2}
          y1={yCircleOffset + radiusInner}
          y2={yCircleOffset + radiusInner}
        />
        <line // bottom left-right
          stroke={areaColorDark}
          x1={xCircleOffset - 2}
          x2={xCircleOffset + 2}
          y1={yCircleOffset + radiusOuter}
          y2={yCircleOffset + radiusOuter}
        />
        <line // annotation
          stroke={areaColorDark}
          x1={xCircleOffset}
          x2={labelXOffset}
          y1={yCircleOffset + radiusInner + (radiusOuter - radiusInner) * 0.5}
          y2={yCircleOffset + radiusInner + (radiusOuter - radiusInner) * 0.5}
        />
        <text
          x={labelXOffset}
          y={yCircleOffset + radiusInner + (radiusOuter - radiusInner) * 0.5}
          dx="0.5em"
          fontSize={11}
          fill={areaColorDark}
        >
          Fried (surface area)
        </text>
      </Group>
    </svg>
  );
}
