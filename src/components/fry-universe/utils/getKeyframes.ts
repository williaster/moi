import easingFunctions from './easingFunctions';

type EaseKind = keyof typeof easingFunctions;

// each keyframe can be a
//   number
//   array of numbers (control points within that keyframe)
//   or either with a specified easing function
type Step = number | { step: number; ease: EaseKind } | { steps: number[]; ease: EaseKind };

export default function getKeyframes(
  steps: [Step, Step, Step, Step, Step, Step, Step, Step],
  defaultEase: EaseKind = 'easeInOutQuad',
) {
  const stepCount = 8;
  // t represents [0-1], where 0=step #0, and 1=step #`stepCount`
  return (t: number) => {
    const stepFloat = t * (stepCount - 1);
    let withinStep: number = stepFloat % 1;

    const step = Math.floor(stepFloat);
    if (step > stepCount - 1) {
      console.warn('encountered step outside of specified keyframes');
      return t;
    }

    const step0 = steps[step];
    const step1 = steps[step + 1] ?? steps[step];

    let step0Number: number = 0;
    if (typeof step0 === 'number') {
      step0Number = step0; // simple number keyframe
    } else if ('step' in step0 && step0.step != null) {
      step0Number = step0.step; // single keyframe with ease func
    } else if ('steps' in step0 && step0.steps != null) {
      // multiple control points, take the last since this is prev step
      step0Number = step0.steps[step0.steps.length - 1];
    }

    let step1Number: number = 0;
    if (typeof step1 === 'number') {
      step1Number = step1; // simple number keyframe
    } else if ('step' in step1 && step1.step != null) {
      step1Number = step1.step; // single keyframe with ease func
    } else if ('steps' in step1 && step1.steps != null) {
      // multiple control points

      const subSteps: number[] = [step0Number, ...step1.steps];
      const subStepsCount = subSteps.length;
      const subStepFloat = withinStep * (subStepsCount - 1);
      const subStep = Math.floor(subStepFloat);
      const withinSubStep = subStepFloat % 1;

      step0Number = subSteps[subStep];
      step1Number = subSteps[subStep + 1];
      withinStep = withinSubStep;
    }

    const easeFunc = typeof step1 === 'object' && 'ease' in step1 ? step1.ease : defaultEase;
    const easedWithinStep = easingFunctions[easeFunc](withinStep);
    const result = step0Number + (step1Number - step0Number) * easedWithinStep;

    return result;
  };
}
