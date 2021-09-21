import { range } from 'd3-array';

// See https://github.com/d3/d3-geo/issues/95
export default function getGraticules() {
  let epsilon = 1e-6,
    x1 = 180,
    x0 = -x1,
    y1 = 80,
    y0 = -y1,
    dx = 10,
    dy = 10,
    X1 = 180,
    X0 = -X1,
    Y1 = 90,
    Y0 = -Y1,
    DX = 90,
    DY = 360,
    x = graticuleX(y0, y1, 2.5),
    y = graticuleY(x0, x1, 2.5),
    X = graticuleX(Y0, Y1, 2.5),
    Y = graticuleY(X0, X1, 2.5);

  function graticuleX(y0: number, y1: number, dy: number) {
    var y = range(y0, y1 - epsilon, dy).concat(y1);
    return function(x) {
      return y.map(function(y) {
        return [x, y];
      });
    };
  }

  function graticuleY(x0: number, x1: number, dx: number) {
    var x = range(x0, x1 - epsilon, dx).concat(x1);
    return function(y) {
      return x.map(function(x) {
        return [x, y];
      });
    };
  }

  return {
    type: 'MultiLineString',
    coordinates: range(Math.ceil(X0 / DX) * DX, X1, DX)
      .map(X)
      .concat(range(Math.ceil(Y0 / DY) * DY, Y1, DY).map(Y))
      .concat(
        range(Math.ceil(x0 / dx) * dx, x1, dx)
          .filter(function(x) {
            return Math.abs(x % DX) > epsilon;
          })
          .map(x),
      )
      .concat(
        range(Math.ceil(y0 / dy) * dy, y1 + epsilon, dy)
          .filter((y: number) => Math.abs(y % DY) > epsilon)
          .map(y),
      ),
  };
}
