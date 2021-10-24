import React, { useMemo } from 'react';
import Arc from '@visx/shape/lib/shapes/Arc';
import { scaleLinear, scaleBand } from '@visx/scale';
import { Group } from '@visx/group';

const defaultMargin = { top: 50, right: 40, bottom: 100, left: 40 };

export type PieProps = {
  width: number;
  height: number;
  margin?: typeof defaultMargin;
  animate?: boolean;
};

const data = [
  { type: 'potato', area: 1952359.443, volume: 233582898.8 },
  { type: 'wedge', area: 477981.7359, volume: 49774108.75 },
  { type: 'tot', area: 551572, volume: 30896527.08 },
  { type: 'fry', area: 423490.2936, volume: 10668073.71 },
  { type: 'curly fry', area: 915541.4873, volume: 15819711.12 },
  { type: 'waffle fry', area: 592132.7579, volume: 5401277.157 },
  { type: 'ridged chip', area: 622033.1102, volume: 3557216.657 },
];

type Datum = typeof data[number];

const volume = (d: Datum) => Math.sqrt(d.volume);
const area = (d: Datum) => Math.sqrt(d.area);

const volumeScale = scaleLinear({
  domain: [Math.min(...data.map(volume)), Math.max(...data.map(volume))],
  range: [3, 100],
});

const bgColor = '#333';
const areaColor = '#8c7b4a';
const areaColorDark = '#5b502f';
const volumeColor = '#fff0c0';
const volumeColorDark = '#ae8d23';

export default function PotatoVis({
  width,
  height,
  margin = defaultMargin,
  potatoMargin,
}: PieProps) {
  let offset = 0;
  const ratioScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, 0.2],
        range: [height - margin.bottom - 50, margin.top],
      }),
    [height, margin.bottom, margin.top],
  );
  const xScale = useMemo(
    () => scaleBand({ domain: data.map(d => d.type), range: [margin.left, width - margin.right] }),
    [width, margin.left, margin.right],
  );
  return (
    <svg width={width} height={height}>
      <rect rx={14} width={width} height={height} fill={bgColor} />

      <Group top={0} left={margin.left}>
        {data.map(d => {
          const gap = 0;
          const v = volume(d);
          const a = area(d);
          const volumeRadius = volumeScale(v);
          const areaRadius = Math.sqrt((a + Math.PI * volumeRadius * volumeRadius) / Math.PI);
          const ratioPosition = ratioScale(d.area / d.volume);
          const textPosition = -ratioPosition + height - margin.top + 0;

          offset += areaRadius;
          const currOffset = offset;
          offset += areaRadius + potatoMargin;

          return (
            <Group key={d.type} left={currOffset} top={ratioPosition}>
              <line
                stroke={areaColor}
                strokeWidth={1}
                strokeOpacity={1}
                x1={0}
                x2={0}
                y1={0}
                y2={textPosition - 4}
              />
              <circle
                key={d.type}
                cy={0}
                cx={0}
                r={volumeRadius}
                fill={volumeColor}
                fillOpacity={1}
              />
              <Arc
                startAngle={0}
                endAngle={2 * Math.PI}
                innerRadius={volumeRadius + gap}
                outerRadius={areaRadius}
                fill={areaColor}
                fillOpacity={1}
              />
              <text
                fontSize={14}
                fill={areaColorDark}
                textAnchor="middle"
                width={100}
                y={textPosition}
              >
                {d.type}
              </text>
            </Group>
          );
        })}
      </Group>
    </svg>
  );
}
