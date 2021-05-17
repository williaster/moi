import React from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { StaticMap } from 'react-map-gl';
import toGeoJson from '@mapbox/togeojson';
import { interpolateRdPu as colorScale } from 'd3-scale-chromatic';

import Page from '../components/Page';
import useData from '../hooks/useData';
import getStaticUrl from '../utils/getStaticUrl';

// this is a public personal token
const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoiY2hyaXMtd2lsbGlhbXMiLCJhIjoiY2oxNGlhNXAyMDBkcjMybzdqam85azY0diJ9.pRLnr0VE84sg3JxjLhW78g';

// custom minimal map
const MAPBOX_STYLE_URL = 'mapbox://styles/chris-williams/ckmprvh7v006c17lgkkjc1388';

const sfCoords = {
  longitude: -122.45,
  latitude: 37.75,
  zoom: 14,
};

const initialViewState = {
  ...sfCoords,
  pitch: 0, //75,
  bearing: 0, //10,
};

export default function GPS() {
  const data = useData<string, object>({
    url: getStaticUrl('/static/data/1_000_hill_hairball.gpx'),
    responseType: 'text',
    parser: xmlString => {
      const linePathGeoJson = toGeoJson.gpx(new DOMParser().parseFromString(xmlString, 'text/xml'));
      const polygonGeoJson = {
        type: 'FeatureCollection',
        features: [],
      };

      const offset = 0.0001;
      const minIdx = 300;
      const maxIdx = linePathGeoJson.features[0].geometry.coordinates.length - 300;

      linePathGeoJson.features[0].geometry.coordinates.forEach(([x, y, z], i) => {
        if (i < minIdx || i > maxIdx) return;

        const [prevX = 0, prevY = 0] =
          linePathGeoJson.features[0].geometry.coordinates[i - 1] ?? [];
        const dx = x - prevX;
        const dy = y - prevY;
        const dxSign = dx > 0 ? 1 : -1;
        const dySign = dy > 0 ? 1 : -1;

        polygonGeoJson.features.push({
          type: 'Feature',
          properties: {
            elevation: z,
            heartRate: linePathGeoJson.features?.[0]?.properties?.heartRates?.[i],
            time: linePathGeoJson.features?.[0]?.properties?.coordTimes?.[i],
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [prevX, prevY],
                [x, y],

                // [x - offset, y - offset],
                // [x - offset, y + offset],
                // [x + offset, y + offset],
                // [x + offset, y - offset],
              ],
            ],
          },
        });
      });

      console.log({ polygonGeoJson, linePathGeoJson });

      return { polygonGeoJson, linePathGeoJson };
    },
  });

  if (data.loading) return 'Loading';
  if (data.error) {
    console.log(data.error);
    return 'Error';
  }

  console.log(data.data);

  return (
    <Page>
      <DeckGL
        controller
        initialViewState={initialViewState}
        layers={[
          new GeoJsonLayer({
            id: 'geojson-line',
            data: data.data.polygonGeoJson,
            pickable: false,
            // stroked: false,
            filled: true,
            extruded: true,
            lineWidthMinPixels: 1,
            getFillColor: d => {
              const hexString = colorScale(
                1 -
                  Math.min(
                    1,
                    d.properties.elevation / 300,
                    // d.properties.heartRate / 180,
                  ),
              );

              const rgbMatch = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexString);
              return rgbMatch
                ? [parseInt(rgbMatch[1], 16), parseInt(rgbMatch[2], 16), parseInt(rgbMatch[3], 16)]
                : hexString
                    .slice(4, -1)
                    .split(', ')
                    .map(Number);
            },
            getElevation: d => {
              return Math.max(0, d?.properties?.elevation - 50);
            },
            opacity: 1,
            elevationScale: 1.25,
          }),

          new GeoJsonLayer({
            id: 'geojson-line',
            data: data.data.linePathGeoJson,
            pickable: false,
            lineWidthMinPixels: 1,
            getLineColor: [100, 0, 80, 255],
          }),
        ]}
      >
        {/* <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} mapStyle={MAPBOX_STYLE_URL} /> */}
      </DeckGL>
    </Page>
  );
}
