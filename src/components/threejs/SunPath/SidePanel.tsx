import React, { useMemo } from 'react';
import { XYChart, Axis, LineSeries } from '@visx/xychart';
import solarCalculator from './solarCalculations';
import getSunPosition from './getSunPosition';
import { getPosition, getTimes } from './solarCalculations-2';

const dates = [
  new Date('2020-01-01'),
  new Date('2020-02-01'),
  new Date('2020-03-01'),
  new Date('2020-04-01'),
  new Date('2020-05-01'),
  new Date('2020-06-01'),
  new Date('2020-07-01'),
  new Date('2020-08-01'),
  new Date('2020-09-01'),
  new Date('2020-10-01'),
  new Date('2020-11-01'),
  new Date('2020-12-01'),
];

function SidePanel({ width = 500, height = 250, latitude, longitude }) {
  const data = useMemo(() => {
    return dates.map(d => {
      const times = getTimes(d, latitude, longitude, 0, [[-0.833, 'sunrise', 'sunset']]);
      const dMs = +d;
      return {
        x: d,
        sunrise: (times.sunrise - dMs) / 1000,
        sunset: (times.sunset - dMs) / 1000,
        noon: (times.solarNoon - dMs) / 1000,
      };
    });
  }, [latitude, longitude]);

  // console.log({ latitude, longitude }, data[0]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width, height, background: '#fff' }}>
      <XYChart
        key={Math.random()}
        width={width}
        height={height}
        xScale={{ type: 'time' }}
        yScale={{ type: 'linear' }}
      >
        <Axis orientation="bottom" />
        <Axis orientation="left" numTicks={3} />
        <LineSeries
          dataKey="sunrise"
          data={data}
          xAccessor={d => d.x}
          // yAccessor={d => d.sunrise}
          yAccessor={d => (24 * d.sunrise) / 1440}
        />
        <LineSeries
          dataKey="sunset"
          data={data}
          xAccessor={d => d.x}
          // yAccessor={d => d.sunset}
          yAccessor={d => (24 * d.sunset) / 1440}
        />
        <LineSeries
          dataKey="noon"
          data={data}
          xAccessor={d => d.x}
          // yAccessor={d => d.noon}
          yAccessor={d => 24 * (d.noon / 1440)}
        />
      </XYChart>
    </div>
  );
}

export default React.memo(SidePanel);
