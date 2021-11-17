export default function getViewportWidth(viewportWidth: number, dpr: number) {
  return Math.min((viewportWidth / dpr) * 2, 600);
}
