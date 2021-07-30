// adapted from https://github.com/mourner/suncalc (BSD-2)

const PI = Math.PI;
const sin = Math.sin;
const cos = Math.cos;
const tan = Math.tan;
const asin = Math.asin;
const atan = Math.atan2;
const acos = Math.acos;
const rad = PI / 180;
const sqrt = Math.sqrt;

// sun calculations are based on http://aa.quae.nl/en/reken/zonpositie.html formulas

// date/time constants and conversions

const dayMs = 1000 * 60 * 60 * 24;
const Julian1970 = 2440588;
const Julian2000 = 2451545;

const toJulian = (date: Date) => date.valueOf() / dayMs - 0.5 + Julian1970;
const fromJulian = (j: number) => new Date((j + 0.5 - Julian1970) * dayMs);
const toDays = (date: Date) => toJulian(date) - Julian2000;

// general calculations for position

var e = rad * 23.4397; // obliquity of the Earth

const rightAscension = (l: number, b: number) => atan(sin(l) * cos(e) - tan(b) * sin(e), cos(l));

const declination = (l: number, b: number) => asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l));

const azimuth = (H: number, phi: number, dec: number) =>
  atan(sin(H), cos(H) * sin(phi) - tan(dec) * cos(phi));

const altitude = (H: number, phi: number, dec: number) =>
  asin(sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H));

const siderealTime = (d: number, lw: number) => rad * (280.16 + 360.9856235 * d) - lw;

// general sun calculations

function solarMeanAnomaly(d: number) {
  return rad * (357.5291 + 0.98560028 * d);
}

function eclipticLongitude(M: number) {
  var C = rad * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M)), // equation of center
    P = rad * 102.9372; // perihelion of the Earth

  return M + C + P + PI;
}

function sunCoords(d: number) {
  const M = solarMeanAnomaly(d);
  const L = eclipticLongitude(M);

  return {
    dec: declination(L, 0),
    ra: rightAscension(L, 0),
  };
}

// calculations for sun times
var J0 = 0.0009;

const julianCycle = (d: number, lw: number) => Math.round(d - J0 - lw / (2 * PI));

const approxTransit = (Ht: number, lw: number, n: number) => J0 + (Ht + lw) / (2 * PI) + n;

const solarTransitJ = (ds: number, M: number, L: number) =>
  Julian2000 + ds + 0.0053 * sin(M) - 0.0069 * sin(2 * L);

const hourAngle = (h: number, phi: number, d: number) =>
  acos((sin(h) - sin(phi) * sin(d)) / (cos(phi) * cos(d)));

const observerAngle = (height: number) => (-2.076 * sqrt(height)) / 60;

// returns set time for the given sun altitude
function getSetJ(h: number, lw: number, phi: number, dec: number, n: number, M: number, L: number) {
  const w = hourAngle(h, phi, dec);
  const a = approxTransit(w, lw, n);
  return solarTransitJ(a, M, L);
}

// --------- exports

// calculates sun position for a given date and latitude/longitude
export function getPosition(date: Date, lat: number, lng: number) {
  const lw = rad * -lng;
  const phi = rad * lat;
  const d = toDays(date);
  const c = sunCoords(d);
  const H = siderealTime(d, lw) - c.ra;

  return {
    azimuth: azimuth(H, phi, c.dec),
    altitude: altitude(H, phi, c.dec),
  };
}

// hrs [0, 24]
export function getPositionDaysHours(date: Date, hours: number, lat: number, lng: number) {
  const lw = rad * -lng;
  const phi = rad * lat;
  const d = toDays(date) + hours / 24;
  const c = sunCoords(d);
  const H = siderealTime(d, lw) - c.ra;

  return {
    azimuth: azimuth(H, phi, c.dec),
    altitude: altitude(H, phi, c.dec),
  };
}

// calculates sun times for a given date, latitude/longitude, and, optionally,
// the observer height (in meters) relative to the horizon
export function getTimes(
  date: Date,
  lat: number,
  lng: number,
  height: number = 0,
  times: [number, string, string][] = [
    [-0.833, 'sunrise', 'sunset'],
    [-0.3, 'sunriseEnd', 'sunsetStart'],
    [-6, 'dawn', 'dusk'],
    [-12, 'nauticalDawn', 'nauticalDusk'],
    [-18, 'nightEnd', 'night'],
    [6, 'goldenHourEnd', 'goldenHour'],
  ],
) {
  const lw = rad * -lng;
  const phi = rad * lat;
  const dh = observerAngle(height);
  const d = toDays(date);
  const n = julianCycle(d, lw);
  const ds = approxTransit(0, lw, n);
  const M = solarMeanAnomaly(ds);
  const L = eclipticLongitude(M);
  const dec = declination(L, 0);
  const Jnoon = solarTransitJ(ds, M, L);

  const result = {
    solarNoon: fromJulian(Jnoon),
    nadir: fromJulian(Jnoon - 0.5),
  };

  for (let i = 0, len = times.length; i < len; i += 1) {
    const time = times[i];
    const h0 = (time[0] + dh) * rad;

    const Jset = getSetJ(h0, lw, phi, dec, n, M, L);
    const Jrise = Jnoon - (Jset - Jnoon);

    result[time[1]] = fromJulian(Jrise);
    result[time[2]] = fromJulian(Jset);
  }

  return result;
}
