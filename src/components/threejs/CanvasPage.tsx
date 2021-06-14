import React from 'react';

export default function CanvasPage({
  children,
  background = '#fff',
}: {
  children: React.ReactNode;
  background?: string;
}) {
  return (
    <>
      <div className="canvas">{children}</div>
      <style>{`
        .canvas,
        canvas {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          overflow: hidden;
          background: ${background};
        }
    `}</style>
    </>
  );
}
