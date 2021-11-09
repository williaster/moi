/*
 * inspired from http://gizma.com/easing/
 * t value mapping from [0, 1] => [0, 1]
 */
const Easing = {
  // no easing, no acceleration
  linear: (t: number) => t,
  // accelerating from zero velocity
  easeInQuad: (t: number) => t * t,
  // decelerating to zero velocity
  easeOutQuad: (t: number) => t * (2 - t),
  // acceleration until halfway, then deceleration
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  // accelerating from zero velocity
  easeInCubic: (t: number) => t * t * t,
  // decelerating to zero velocity
  easeOutCubic: (t: number) => --t * t * t + 1,
  // acceleration until halfway, then deceleration
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  // accelerating from zero velocity
  easeInQuart: (t: number) => t * t * t * t,
  // decelerating to zero velocity
  easeOutQuart: (t: number) => 1 - --t * t * t * t,
  // acceleration until halfway, then deceleration
  easeInOutQuart: (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
  // accelerating from zero velocity
  easeInQuint: (t: number) => t * t * t * t * t,
  // decelerating to zero velocity
  easeOutQuint: (t: number) => 1 + --t * t * t * t * t,
  // acceleration until halfway, then deceleration
  easeInOutQuint: (t: number) => (t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t),
};

type EaseKind = keyof typeof Easing;
type Step = number | [number, EaseKind];

// returns a function which interpolates a given [0,1] value across 7 specified step values
export default function getKeyframes(
  steps: [Step, Step, Step, Step, Step, Step, Step],
  defaultEase: EaseKind = 'linear',
) {
  // t represents [0-1], where 0=step 0, and 1=step 6
  return (t: number) => {
    const stepFloat = t * 6;
    const step = Math.floor(stepFloat);
    const step0 = steps[step];
    const step1 = steps[step + 1];

    const step0Number = typeof step0 === 'number' ? step0 : step0[0];
    const step1Number = typeof step1 === 'number' ? step1 : step1[0];
    const easeFunc: EaseKind = typeof step1 === 'number' ? defaultEase : step1[1];
    const withinStep = stepFloat % 1;
    const easedWithinStep = Easing[easeFunc](withinStep);
    const result = step0Number + (step1Number - step0Number) * easedWithinStep;

    return result;
  };
}
