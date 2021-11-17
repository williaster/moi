export default function getViewportWidth(viewportWidth: number, dpr: number) {
  const effectiveSize = viewportWidth * dpr;
  return effectiveSize > 600 ? 600 / dpr : viewportWidth;
}
