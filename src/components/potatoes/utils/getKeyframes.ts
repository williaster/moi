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
type Step = number | number[] | [number | number[], EaseKind];

// returns a function which interpolates a given [0,1] value across 7 specified step values
export default function getKeyframes(
  steps: [Step, Step, Step, Step, Step, Step, Step],
  defaultEase: EaseKind = 'linear',
  blah?: boolean,
) {
  const stepCount = steps.length;
  // t represents [0-1], where 0=step 0, and 1=step 6
  return (t: number) => {
    const stepFloat = t * (stepCount - 1);
    let withinStep: number = stepFloat % 1;

    const step = Math.floor(stepFloat);
    const step0 = steps[step];
    const step1 = steps[step + 1];

    let step0Number: number = (typeof step0 === 'number'
      ? step0
      : typeof step0[0] === 'number'
      ? step0[0]
      : step0[0][step0[0].length - 1]) as number;

    let step1Number: number;
    if (typeof step1 === 'number') step1Number = step1;
    else if (typeof step1[0] === 'number') step1Number = step1[0];
    else {
      const subSteps: number[] = [step0Number, ...step1[0]];
      const subStepsCount = subSteps.length;
      const subStepFloat = withinStep * (subStepsCount - 1);
      const subStep = Math.floor(subStepFloat);
      const withinSubStep = subStepFloat % 1;

      step0Number = subSteps[subStep];
      step1Number = subSteps[subStep + 1];
      withinStep = withinSubStep;
    }

    const easeFunc = typeof step1 === 'number' ? defaultEase : (step1[1] as EaseKind);
    const easedWithinStep = Easing[easeFunc](withinStep);
    const result = step0Number + (step1Number - step0Number) * easedWithinStep;

    return result;
  };
}
