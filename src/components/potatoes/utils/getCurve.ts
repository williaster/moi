const easeInOut = (t: number, inOrOut?: 'in' | 'out') => {
  if (!inOrOut) return t;
  return inOrOut === 'in' ? 1 - (1 - t) * (1 - t) : 1 - Math.pow(1 - t, 10);
};

// returns a function which interpolates a given [0,1] value across 7 specified step values
export default function getStepCurve(
  steps: [number, number, number, number, number, number, number],
  ease?: 'in' | 'out',
) {
  // t represents [0-1], where 0=step 0, and 1=step 6
  return (t: number) => {
    const stepFloat = t * 6;
    const step = Math.floor(stepFloat);
    const withinStep = easeInOut(stepFloat % 1, ease);
    const step0 = steps[step];
    const step1 = steps[step + 1];
    const result = step0 + (step1 - step0) * withinStep;
    return result;
  };
}
