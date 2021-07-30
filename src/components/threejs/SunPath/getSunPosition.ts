type SunPositionArgs = {
  latitude: number;
  longitude: number;
  day: number;
  hour: number;
  minute?: number;
  second?: number;
};

const pi = Math.PI;
const radians = pi / 180;
const degrees = 180 / pi;
const cos = Math.cos;
const acos = Math.acos;
const sin = Math.sin;
const tau = 2 * pi;
const daysPerYear = 365.25;

export default function getSunPosition({
  latitude, // +N, -S
  longitude, // -W, +E
  day, // [1, 365]
  hour, // [0, 23]
  minute = 0, // [0, 59]
  second = 0,
}: SunPositionArgs) {
  // https://gml.noaa.gov/grad/solcalc/solareqns.PDF
  const fractYear = (tau / daysPerYear) * (day - 1 + hour / 23);

  const equationOfTimeMin =
    229.18 *
    (0.000075 +
      0.001868 * cos(fractYear) -
      0.032077 * sin(fractYear) -
      0.014615 * cos(2 * fractYear) -
      0.040849 * sin(2 * fractYear));

  const solarDeclinationAngleRad =
    0.006918 -
    0.399912 * cos(fractYear) +
    0.070257 * sin(fractYear) -
    0.006758 * cos(2 * fractYear) +
    0.000907 * sin(2 * fractYear) -
    0.002697 * cos(3 * fractYear) +
    0.00148 * sin(3 * fractYear);

  // const solarDeclinationAngleDegrees = solarDeclinationAngleRadians * degrees;
  const timezoneHrs = getTimezoneHrDeltaFromUTCFromLongitude(longitude); // offset from UTC, US Mtn Std Time = -7
  const timezoneMin = timezoneHrs * 60;
  const timeOffsetMin = equationOfTimeMin + 4 * longitude - timezoneMin;
  const trueSolarTimeMin = hour * 60 + minute + second / 60 + timeOffsetMin;

  const solarHourAngleRad = radians * (trueSolarTimeMin / 4 - 180);

  const solarZenithAngleRad = acos(
    sin(latitude * radians) * sin(solarDeclinationAngleRad) +
      cos(latitude * radians) * cos(solarDeclinationAngleRad) * cos(solarHourAngleRad),
  );

  const solarAzimuthDeg = // deg clockwise from N
    acos(
      ((sin(latitude * radians) * cos(solarZenithAngleRad) - sin(solarDeclinationAngleRad)) /
        cos(latitude * radians)) *
        sin(solarZenithAngleRad),
    ) *
      degrees +
    180;

  const solarNoonMin = 720 - 4 * longitude - equationOfTimeMin;
  const sunsetMin = 720 - 4 * (longitude - solarHourAngleRad * degrees) - equationOfTimeMin;
  const sunriseMin = 720 - 4 * (longitude + solarHourAngleRad * degrees) - equationOfTimeMin;

  // polar coords: (radius, polar angle, azimuth from N)
  return {
    zenith: solarZenithAngleRad,
    azimuth: solarAzimuthDeg * radians,
    sunrise: sunriseMin,
    sunset: sunsetMin,
    noon: solarNoonMin,
  };
}

// http://www.cs4fn.org/mobile/owntimezone.php
// 1 deg long = 4min
function getTimezoneHrDeltaFromUTCFromLongitude(longitude: number) {
  return Math.round((longitude * 4) / 60);
}

export function polarToCartesian({
  radius: r,
  thetaAzimuth: theta,
  phiZenith: phi,
}: {
  radius: number;
  thetaAzimuth: number;
  phiZenith: number;
}) {
  return {
    x: r * cos(phi) * sin(theta),
    y: r * sin(phi) * cos(theta),
    z: r * cos(theta),
  };
}
