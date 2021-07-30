import { utcDay, timeDay } from 'd3-time';

const s = utcDay.floor(new Date());

// adapted from https://unpkg.com/solar-calculator@0.1.0/index.js
const julian2000 = Date.UTC(2000, 0, 1, 12); // noon
const abs = Math.abs;
const acos = Math.acos;
const asin = Math.asin;
const cos = Math.cos;
const max = Math.max;
const min = Math.min;
const sin = Math.sin;
const tan = Math.tan;
const epsilon = 1e-6;
const pi = Math.PI;
const tau = 2 * pi;
const radians = pi / 180;
const degrees = 180 / pi;
const daysInYear = 365.25;
const minPerDay = 60 * 24;
const daysPerCentury = daysInYear * 100;
const minPerCentury = minPerDay * daysPerCentury;

// given a {long, lat}, returns functions for computing the solar { position, noon, sunrise }
export default function solarCalculator({
  longitude,
  latitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const minutesOffset = 720 - longitude * 4;
  const x = longitude * radians;
  const y = latitude * radians;
  const cy = cos(y);
  const sy = sin(y);

  function position(date: Date) {
    const numericDate = date.valueOf();
    const centuries = (numericDate - julian2000) / (864e5 * 36525);
    const theta = solarDeclination(centuries);
    const ctheta = cos(theta);
    const stheta = sin(theta);
    let azimuth =
      ((((numericDate - utcDay.floor(date).valueOf()) / 864e5) * tau +
        equationOfTime(centuries) +
        x) %
        tau) -
      pi;
    let zenith = acos(max(-1, min(1, sy * stheta + cy * ctheta * cos(azimuth))));

    const azimuthDenominator = cy * sin(zenith);

    if (azimuth < -pi) azimuth += tau;
    if (abs(azimuthDenominator) > epsilon)
      azimuth =
        (azimuth > 0 ? -1 : 1) *
        (pi - acos(max(-1, min(1, (sy * cos(zenith) - stheta) / azimuthDenominator))));
    if (azimuth < 0) azimuth += tau;

    // Correct for atmospheric refraction.
    const atmosphere = 90 - zenith * degrees;

    if (atmosphere <= 85) {
      const te = tan(atmosphere * radians);
      zenith -=
        ((atmosphere > 5
          ? 58.1 / te - 0.07 / (te * te * te) + 0.000086 / (te * te * te * te * te)
          : atmosphere > -0.575
          ? 1735 +
            atmosphere *
              (-518.2 + atmosphere * (103.4 + atmosphere * (-12.79 + atmosphere * 0.711)))
          : -20.774 / te) /
          3600) *
        radians;
    }

    //if zenith > 108°, it’s dark.
    return { azimuthDeg: azimuth * degrees, zenithDeg: 90 - zenith * degrees };
  }

  function noon(date: Date) {
    const centuries = (utcDay.floor(date).valueOf() - julian2000) / (864e5 * 36525);

    const partialCentury =
      (minutesOffset -
        equationOfTime(centuries - longitude / (360 * daysPerCentury)) * degrees * 4) /
      minPerCentury;

    let minutes =
      (minutesOffset -
        equationOfTime(centuries + partialCentury) * degrees * 4 -
        date.getTimezoneOffset()) %
      minPerDay;

    if (minutes < 0) minutes += minPerDay;

    return new Date(+timeDay.floor(date) + minutes * 60 * 1000);
  }

  function sunriseSunset(date: Date) {
    const centuries = (utcDay.floor(date).valueOf() - julian2000) / (864e5 * 36525);

    const partialCentury =
      (minutesOffset -
        equationOfTime(centuries - longitude / (360 * daysPerCentury)) * degrees * 4) /
      minPerCentury;

    let noonMinutes =
      (minutesOffset -
        equationOfTime(centuries + partialCentury) * degrees * 4 -
        date.getTimezoneOffset()) %
      minPerDay;

    if (noonMinutes < 0) noonMinutes += minPerDay;

    const decl = solarDeclination(centuries) * degrees;
    const hourAngle = Math.acos(
      cos(90.833) / (cos(latitude) * cos(decl)) - tan(latitude) * tan(decl),
    );

    const sunriseMinutes = noonMinutes - 4 * hourAngle;
    const sunsetMinutes = noonMinutes + 4 * hourAngle;
    const dayMinutes = +timeDay.floor(date);
    debugger;

    return {
      sunrise: new Date(dayMinutes + sunriseMinutes * 60 * 1000),
      sunset: new Date(dayMinutes + sunsetMinutes * 60 * 1000),
    };
  }

  return {
    position,
    noon,
    sunriseSunset,
  };
}

// return minutes
function equationOfTime(centuries: number) {
  const e = eccentricityEarthOrbit(centuries);
  const m = solarGeometricMeanAnomaly(centuries);
  const l = solarGeometricMeanLongitude(centuries);
  let y = tan(obliquityCorrection(centuries) / 2);
  y *= y;
  return (
    y * sin(2 * l) -
    2 * e * sin(m) +
    4 * e * y * sin(m) * cos(2 * l) -
    0.5 * y * y * sin(4 * l) -
    1.25 * e * e * sin(2 * m)
  );
}

function solarDeclination(centuries: number) {
  return asin(sin(obliquityCorrection(centuries)) * sin(solarApparentLongitude(centuries)));
}

function solarApparentLongitude(centuries: number) {
  return (
    solarTrueLongitude(centuries) -
    (0.00569 + 0.00478 * sin((125.04 - 1934.136 * centuries) * radians)) * radians
  );
}

function solarTrueLongitude(centuries: number) {
  return solarGeometricMeanLongitude(centuries) + solarEquationOfCenter(centuries);
}

function solarGeometricMeanAnomaly(centuries: number) {
  return (357.52911 + centuries * (35999.05029 - 0.0001537 * centuries)) * radians;
}

function solarGeometricMeanLongitude(centuries: number) {
  var l = (280.46646 + centuries * (36000.76983 + centuries * 0.0003032)) % 360;
  return ((l < 0 ? l + 360 : l) / 180) * pi;
}

function solarEquationOfCenter(centuries: number) {
  const m = solarGeometricMeanAnomaly(centuries);
  return (
    (sin(m) * (1.914602 - centuries * (0.004817 + 0.000014 * centuries)) +
      sin(m + m) * (0.019993 - 0.000101 * centuries) +
      sin(m + m + m) * 0.000289) *
    radians
  );
}

function obliquityCorrection(centuries: number) {
  return (
    meanObliquityOfEcliptic(centuries) +
    0.00256 * cos((125.04 - 1934.136 * centuries) * radians) * radians
  );
}

function meanObliquityOfEcliptic(centuries: number) {
  return (
    (23 +
      (26 + (21.448 - centuries * (46.815 + centuries * (0.00059 - centuries * 0.001813))) / 60) /
        60) *
    radians
  );
}

function eccentricityEarthOrbit(centuries: number) {
  return 0.016708634 - centuries * (0.000042037 + 0.0000001267 * centuries);
}
