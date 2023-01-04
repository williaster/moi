export const { PI } = Math;
export const TWO_PI = 2 * Math.PI;
export const AXIS_ROTATION = -PI * 0.5;
export const AXIS_ANGLES = {
  alcohol: 0 + AXIS_ROTATION,
  acid: 0.33 * TWO_PI + AXIS_ROTATION,
  sweet: 0.667 * TWO_PI + AXIS_ROTATION,
};
export const AXES = Object.keys(AXIS_ANGLES);

export const AXIS_LABEL = {
  alcohol: 'alcoholic',
  acid: 'citrus-y',
  sweet: 'sweet',
};
