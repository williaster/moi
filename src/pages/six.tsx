import React from 'react';
import { csvParse } from 'd3-dsv';
import { scaleOrdinal } from '@visx/scale';

import Page from '../components/Page';
import useData from '../hooks/useData';
import getStaticUrl from '../utils/getStaticUrl';

const BACKGROUND_SIZE = 800;

type RawDatum = { name: string; type: string; date: string; dttm: string; notes: string };
type Datum = { name: string; type: string; date: string; dttm: number; notes: string };

const spiralArc = (
  fromRadius: number,
  toRadius: number,
  width: number,
  fromAngle: number,
  toAngle: number,
) => {
  const x1 = fromRadius * Math.sin(fromAngle);
  const y1 = fromRadius * -Math.cos(fromAngle);
  const x2 = (fromRadius + width) * Math.sin(fromAngle);
  const y2 = (fromRadius + width) * -Math.cos(fromAngle);
  const x3 = toRadius * Math.sin(toAngle);
  const y3 = toRadius * -Math.cos(toAngle);
  const x4 = (toRadius + width) * Math.sin(toAngle);
  const y4 = (toRadius + width) * -Math.cos(toAngle);
  return `
      M ${x1},${y1} 
      L ${x2},${y2} 
      A ${fromRadius},${fromRadius} 1 0 1 ${x4},${y4} 
      L ${x3},${y3}
      A ${fromRadius},${fromRadius} 0 0 0 ${x1},${y1}`;
};

const years = [
  '2016-08-29',
  '2017-08-29',
  '2018-08-29',
  '2019-08-29',
  '2020-08-29',
  '2021-09-01', // include seattle trip
];

const colors = [
  // ['home', '#46216F'],
  // ['job', '#6F37AB'],
  // ['item', '#D8DAEA'],
  // ['place', '#D38242'],
  // ['food', '#EFD27C'],
  // ['drinks', '#EAECB0'],
  // ['event', '#5DFFBD'],
  // ['concert', '#4AB77F'],

  // ['home', '#25345D'],
  // ['job', '#5790E3'],
  // ['place', '#5B827F'],
  // ['event', '#91C7A3'],
  // ['concert', '#BEDD93'],
  // ['food', '#D4A850'],
  // ['drinks', '#CA8752'],
  // ['item', '#AB573A'],

  // ['place', '#25345D'],
  // ['event', '#5790E3'],
  // ['concert', '#5B827F'],
  // ['food', '#91C7A3'],
  // ['drinks', '#BEDD93'],
  // ['item', '#D4A850'],
  // ['home', '#CA8752'],
  // ['job', '#AB573A'],

  // ['place', '#003F5C'],
  // ['event', '#2F4B7C'],
  // ['concert', '#665191'],
  // ['food', '#A05195'],
  // ['drinks', '#D45087'],
  // ['item', '#F95D6A'],
  // ['home', '#FF7C43'],
  // ['job', '#FFA600'],

  ['home', '#003F5C'],
  ['job', '#2F4B7C'],
  ['place', '#665191'],
  ['event', '#A05195'],
  ['concert', '#D45087'],
  ['food', '#F95D6A'],
  ['drinks', '#FF7C43'],
  ['item', '#FFA600'],

  // ['home', '#5B827F'],
  // ['job', '#91C7A3'],
  // ['place', '#BEDD93'],
  // ['event', '#EAECB0'],
  // ['concert', '#EFD27C'],
  // ['food', '#D4A850'],
  // ['drinks', '#AB573A'],
  // ['item', '#665191'],
  // ['job', '#5B827F'],
  // ['place', '#91C7A3'],
  // ['event', '#BEDD93'],
  // ['concert', '#EAECB0'],
  // ['food', '#EFD27C'],
  // ['drinks', '#D4A850'],
  // ['item', '#AB573A'],
  // ['home', '#665191'],
];

const colorScale = scaleOrdinal({
  domain: colors.map(d => d[0]),
  range: colors.map(d => d[1]),
});

function splitByYear(data: Datum[]) {
  const byYear: Datum[][] = [[]];

  let yearIdx: number = 0;
  let year: Date = new Date(years[yearIdx]);

  data.forEach(d => {
    const date = new Date(d.date);
    if (date < year) {
      byYear[yearIdx].push(d);
    } else {
      yearIdx += 1;
      year = new Date(years[yearIdx]);
      byYear.push([d]);
    }
  });

  return byYear;
}

const HomePage = () => {
  const { loading, error, data } = useData<string, Datum[][]>({
    url: getStaticUrl('/static/data/six.csv'),
    responseType: 'text',
    parser: csv => {
      const asJson = csvParse(csv).map((d: RawDatum) => ({ ...d, dttm: parseInt(d.dttm, 10) }));
      return splitByYear(asJson);
    },
  });
  if (error) return <>Error</>;
  if (loading) return <>Loading</>;

  const numCircles = data.length;
  const width = 1332;
  const height = width;
  const circleDiameter = width / numCircles;
  const glyphWidth = 6;
  const baseRadius = 25;
  const angle = (Math.PI * 2) / baseRadius;
  // const flat = data.flatMap(d => d);
  // let total = 0;
  const textPerColumn = 8;
  const textRowHeight = 150;
  const textLineHeight = 12;
  const textColumnWidth = 200;
  const textLegendSize = 4;
  return (
    <>
      <Page showNav={false} padding={false}>
        <svg width={width} height={height}>
          {/* {data.map((currYear, yearIdx) => (
            <g key={`${yearIdx}`} transform={`translate(${0},${yearIdx * textRowHeight + 20})`}>
              {currYear.map((d, i) => (
                <g
                  key={i}
                  transform={`translate(${Math.floor(i / textPerColumn) * textColumnWidth},${(i %
                    textPerColumn) *
                    textLineHeight})`}
                >
                  <rect
                    x={0}
                    y={-Math.floor(textLegendSize) - 1}
                    width={textLegendSize}
                    height={textLegendSize}
                    rx={1}
                    ry={1}
                    fill={colorScale(d.type)}
                  />
                  <text fontSize={10} x={textLegendSize + 4} y={0} fill={colorScale(d.type)}>
                    {d.name}
                  </text>
                </g>
              ))}
            </g>
          ))} */}

          {data.map((currYear, yearIdx) => (
            <g
              key={`${yearIdx}`}
              transform={`translate(${circleDiameter * (yearIdx + 0.5)},${circleDiameter *
                (yearIdx + 0.5)})`}
            >
              {currYear.map((d, i) => {
                const fromAngle = angle * i;
                const toAngle = angle * (i + 1);
                const radius = baseRadius + 0.5 * i;
                return [0].map(level => {
                  const fromRadius = radius + i * 2 + glyphWidth * level;
                  const toRadius = radius + (i + 6) * 2 + glyphWidth * level;
                  const path = spiralArc(fromRadius, toRadius, glyphWidth, fromAngle, toAngle);
                  const color = colorScale(d.type);

                  return (
                    <path
                      key={`${i}-${level}`}
                      d={path}
                      fill={color}
                      stroke="white"
                      paintOrder="stroke"
                      strokeWidth={0}
                    />
                  );
                });
              })}
            </g>
          ))}

          {/* <g transform={`translate(${width * 0.5},${height * 0.5})`}>
            {data.map((currYear, yearIdx) => {
              total += 1;
              return (
                <React.Fragment key={yearIdx}>
                  {currYear.map((d, i) => {
                    const idx = total;
                    total += 1;
                    const fromAngle = angle * idx;
                    const toAngle = angle * (idx + 1);

                    return [0].map(level => {
                      const fromRadius = baseRadius + idx * 2 + glyphWidth * level;
                      const toRadius = baseRadius + (idx + 1) * 2 + glyphWidth * level;
                      const path = spiralArc(fromRadius, toRadius, glyphWidth, fromAngle, toAngle);
                      const color = colorScale(d.type);

                      return (
                        <path
                          key={`${idx}-${level}`}
                          d={path}
                          fill={color}
                          stroke="#fff"
                          paintOrder="stroke"
                          strokeWidth="2"
                        />
                      );
                    });
                  })}
                </React.Fragment>
              );
            })}
          </g> */}
        </svg>
      </Page>
      <style jsx>{`
        .home {
          height: 100%;
          width: 100%;
          font-size: 0.8rem;
        }
        .content {
          position: relative;
          max-width: ${Math.floor(BACKGROUND_SIZE * 0.64)}px;
          padding: 100px 40px;
          z-index: 1;
        }
        p {
          font-size: 1.25em;
          font-weight: 100;
        }
      `}</style>
    </>
  );
};

export default HomePage;
