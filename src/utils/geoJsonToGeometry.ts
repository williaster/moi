import * as THREE from 'three';
import { pairs } from 'd3-array';
import getGraticules from './getGraticules';
import earcut from 'earcut';

// Converts a point [longitude, latitude] in degrees to a THREE.Vector3.
function vertex(point: [number, number], radius: number) {
  const lambda = (point[0] * Math.PI) / 180;
  const phi = (point[1] * Math.PI) / 180;
  const cosPhi = Math.cos(phi);
  return new THREE.Vector3(
    radius * cosPhi * Math.cos(lambda),
    radius * cosPhi * Math.sin(lambda),
    radius * Math.sin(phi),
  );
}

// converts a multiline string GeoJson object to a THREE Geometry
export default function geoJsonToGeometry(
  multilinestring: ReturnType<typeof getGraticules>,
  radius: number = 200,
  filled = false,
) {
  const geometry = new THREE.Geometry();
  multilinestring.coordinates.forEach((line, lineIndex) => {
    // if (lineIndex > 10) return;
    const vertices = [];
    pairs(
      line.map(point => vertex(point, radius)),
      (a, b) => {
        vertices.push(a, b);
      },
    );
    for (let v = 0; v < vertices.length; v++) {
      geometry.vertices.push(vertices[v]);
    }
    if (filled) {
      const data = [];
      vertices.forEach(v => {
        data.push(v.x);
        data.push(v.y);
        data.push(v.z);
      });

      // if (lineIndex > 50) return;
      const triangles = earcut(data, null, 3);
      if (lineIndex < 10) console.log({ data, triangles });
      // console.log({
      //   lineIdx: i,
      //   deviation: earcut.deviation(data.vertices, data.holes, data.dimensions, triangles),
      // });
      // if (triangles.length < 100) return;
      for (let t = 0; t < triangles.length; t += 3) {
        // if (lineIndex < 10) console.log(triangles[t], triangles[t + 1], triangles[t + 2]);
        geometry.faces.push(new THREE.Face3(triangles[t], triangles[t + 1], triangles[t + 2]));
      }
    }
  });
  return geometry;
}
