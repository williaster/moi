import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, extend } from 'react-three-fiber';
import { OrbitControls } from '@react-three/drei';
import { Leva, useControls } from 'leva';

import CanvasPage from './CanvasPage';

/**
 * Notes
 *
 */

function Scene() {
  const meshRef = useRef<THREE.Mesh>();
  const divisions = 32;
  //   const { clock } = useThree();
  //   const uTime = useRef({ value: 0 });
  //   useFrame(() => {
  //     uTime.current.value = clock.elapsedTime;
  //   });

  return (
    <>
      <ambientLight intensity={0.5} />
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeBufferGeometry args={[1, 1, divisions, divisions]} />
        <shaderMaterial
          key={Math.random()}
          side={THREE.DoubleSide}
          uniforms={{}}
          vertexShader={`
            uniform float uTime;

            varying vec2 vUv;

            void main() {
              vec4 modelPosition = modelMatrix * vec4(position, 1.0);
              //modelPosition.z += sin(modelPosition.x * 12.0 - uTime) * 0.1;
              //modelPosition.z += sin(modelPosition.y * 12.0 - uTime) * 0.1;
            
              vec4 viewPosition = viewMatrix * modelPosition;
              vec4 projectionPosition = projectionMatrix * viewPosition;
            
              gl_Position = projectionPosition;
              vUv = uv;
            }
          `}
          fragmentShader={`
            #define PI 3.14159265358
            
            // (0,0) bottom left to (1,1) upper-right
            varying vec2 vUv;

            float random(vec2 xy) {
              return fract(sin(dot(xy.xy, vec2(12.9898, 78.233))) * 43758.5453123); 
            }

            vec2 rotate(vec2 uv, float rotation, vec2 mid) {
              return vec2(
                cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
                cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
              );
            }

            //  Classic Perlin 2D Noise 
            //  by Stefan Gustavson
            //
            vec4 permute(vec4 x) {
              return mod(((x*34.0)+1.0)*x, 289.0);
            }
            
            vec2 fade(vec2 t) {
                return t*t*t*(t*(t*6.0-15.0)+10.0);
            }

            float cnoise(vec2 P) {
                vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
                vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
                Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
                vec4 ix = Pi.xzxz;
                vec4 iy = Pi.yyww;
                vec4 fx = Pf.xzxz;
                vec4 fy = Pf.yyww;
                vec4 i = permute(permute(ix) + iy);
                vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
                vec4 gy = abs(gx) - 0.5;
                vec4 tx = floor(gx + 0.5);
                gx = gx - tx;
                vec2 g00 = vec2(gx.x,gy.x);
                vec2 g10 = vec2(gx.y,gy.y);
                vec2 g01 = vec2(gx.z,gy.z);
                vec2 g11 = vec2(gx.w,gy.w);
                vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
                g00 *= norm.x;
                g01 *= norm.y;
                g10 *= norm.z;
                g11 *= norm.w;
                float n00 = dot(g00, vec2(fx.x, fy.x));
                float n10 = dot(g10, vec2(fx.y, fy.y));
                float n01 = dot(g01, vec2(fx.z, fy.z));
                float n11 = dot(g11, vec2(fx.w, fy.w));
                vec2 fade_xy = fade(Pf.xy);
                vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
                float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
                return 2.3 * n_xy;
            }

            

            void main () {
              // blue/green/red/white gradient
              // gl_FragColor = vec4(vUv, 1.0, 1.0);

              // black/green/red/yellow gradient
              // gl_FragColor = vec4(vUv, 0.0, 1.0);

              // black to gray (left to right)
              // gl_FragColor = vec4(vUv.x, vUv.x, vUv.x, 1.0);

              // black to gray (top to bottom)
              //float strength = 1.0 - vUv.y;
              //gl_FragColor = vec4(vec3(strength), 1.0);

              // fast change
              //float strength = vUv.y * 10.0;
              //gl_FragColor = vec4(vec3(strength), 1.0);

              // steps
              //float strength = mod(vUv.y * 10.0, 2.0);
              //gl_FragColor = vec4(vec3(strength), 1.0);

              // zebra -- if/else bad for perf
              //float strength = mod(vUv.x * 10.0, 1.0);
              
              // or strength = strength < 0.5 ? 0.0 : 1.0;
              //if (strength < 0.5) {
              //  strength = 0.0;
              //} else {
              //  strength = 1.0;
              //}
              //strength = step(0.8, strength);

              // hash lines / boxes
              //float modX = mod(vUv.x * 10.0, 1.0);
              //float modY = mod(vUv.y * 10.0, 1.0);
              //float strength = step(0.8, modX) + step(0.8, modY);

              // dots (multiply = see where lines cross)
              //float modX = mod(vUv.x * 10.0, 1.0);
              //float modY = mod(vUv.y * 10.0, 1.0);
              //float strength = step(0.8, modX) * step(0.8, modY);

              // dashes
              //float modX = mod(vUv.x * 10.0, 1.0);
              //float modY = mod(vUv.y * 10.0, 1.0);
              // or could do modX*modY and use 0.4 step
              //float strength = step(0.8, modY) - step(0.8, modX);

              // arrows
              //float modX = mod(vUv.x * 10.0, 1.0);
              //float modY = mod(vUv.y * 10.0, 1.0);
              //float strength = 
              //  step(0.8, modY) * step(0.4, modX) + 
              //  step(0.8, modX) * step(0.4, modY);

              // pluses (just offset x + y); 0.2 works because thickness is 0.4 
              //float strength = 
              //  step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0)) * step(0.4, mod(vUv.x * 10.0, 1.0)) + 
              //  step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));

              // diamonds
              //float strength = min(
              //  abs(vUv.x - 0.5), // shift 0-1 to -0.5-0.5, then take abs
              //  abs(vUv.y - 0.5)
              //);

              // diamonds 2
              //float strength = max(
              //  abs(vUv.x - 0.5), // shift 0-1 to -0.5-0.5, then take abs
              //  abs(vUv.y - 0.5)
              //);

              // stepped diamond = square
              //float strength = step(
              //    0.4, // bigger = bigger black hole
              //    max(
              //    abs(vUv.x - 0.5), // shift 0-1 to -0.5-0.5, then take abs
              //    abs(vUv.y - 0.5)
              //  )
              //);

              // stepped gradient (x)
              //float strength = ceil(vUv.x * 10.0) / 10.0;

              // stepped gradient (xy)
              //float strength = ceil(vUv.x * 10.0) / 10.0 * ceil(vUv.y * 10.0) / 10.0;

              // bucketed noise (custom random)
              //vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5, 0.5));
              //float strength = random(vec2(ceil(rotatedUv.x * 10.0) / 10.0, ceil(rotatedUv.y * 10.0) / 10.0));

              // skewed bucketed noise
              //vec2 grid = vec2(
              //  ceil(vUv.x * 10.0) / 10.0, 
              //  ceil((vUv.y + vUv.x * 0.5) * 10.0) / 10.0 // offset y based on x
              //);
              //float strength = random(grid);

              // increase along x+y; length is sqrt(x[0]**2 + x[1]**2 + ...) 
              //float strength = length(vUv);

              // increase outward circle
              //float strength = distance(vUv, vec2(0.5)); // or length(vUv - 0.5); because we are offsetting

              // decrease outward circle
              //float strength = 1.0 - distance(vUv, vec2(0.5));
              //float strength = 0.025 / distance(vUv, vec2(0.5)); // more concentrated
              
              // ellipse
              //vec2 newUv = vec2(vUv.x * 0.2 + 0.4, vUv.y);
              //float strength = 0.025 / distance(newUv, vec2(0.5));

              // 2x ellipse = star, rotated
              //vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5, 0.5));
              //vec2 beamX = vec2(rotatedUv.x * 0.2 + 0.4, rotatedUv.y);
              //vec2 beamY = vec2(rotatedUv.x, rotatedUv.y * 0.2 + 0.4);
              //float lightX = 0.025 / distance(beamX, vec2(0.5));
              //float lightY = 0.025 / distance(beamY, vec2(0.5));
              //float strength = lightX * lightY;

              // black step circle
              //float strength = step(0.2, distance(vUv, vec2(0.5, 0.5)));

              // double circle
              //float strength = abs(distance(vUv, vec2(0.5, 0.5)) - 0.25);

              // white with black circle stroke
              //float strength = step(0.01, abs(distance(vUv, vec2(0.5, 0.5)) - 0.35));
              
              // black with white circle stroke
              //float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5, 0.5)) - 0.35)); 

              // white circle stroke with wave
              //vec2 waveUv = vec2(vUv.x, sin(vUv.x * 100.0) * 0.1 + vUv.y);
              //float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5, 0.5)) - 0.35));

              // same with varying x also (change frequency)
              //vec2 waveUv = vec2(sin(vUv.y * 30.0) * 0.1 + vUv.x, sin(vUv.x * 30.0) * 0.1 + vUv.y);
              //float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5, 0.5)) - 0.35));

              // angle
              //float angle = atan(vUv.y, vUv.x);
              //float strength = angle;

              // view full angle
              //float angle = atan(vUv.y, vUv.x); // value [-PI, PI]
              //float strength = angle / (0.5 * PI); // force it to be 0-1 over 90• [PI/2, PI]
              //float angle = atan(vUv.y - 0.5, vUv.x - 0.5); // value [-PI, PI] but centered at [0.5, 0.5] not [1, 0]
              //float strength = angle / (2.0 * PI) + 0.5; // /2PI gives -0.5-0.5, add 0.5 to get to 0-1

              // zebra angle
              float angle = atan(vUv.y - 0.5, vUv.x - 0.5) / (2.0 * PI) + 0.5;
                // float strength = ceil(angle * 20.0) / 20.0; // stepped gradient
              float strength = mod(angle * 20.0, 1.0);

              // sin angle
              //float angle = atan(vUv.y - 0.5, vUv.x - 0.5) / (2.0 * PI) + 0.5;
              //float strength = sin(angle * 100.0);

              // better wave circle
              //float angle = atan(vUv.y - 0.5, vUv.x - 0.5) / (2.0 * PI) + 0.5;
              //float radius = 0.25 + sin(angle * 100.0) * 0.02; // radius based on angle
              //float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5, 0.5)) - radius)); 

              // stepped perlin noise
              //float strength = step(0.0, cnoise(vUv * 10.0));

              // outlined perlin noise
              //float strength = 1.0 - abs(cnoise(vUv * 10.0));

              // contours
            //   float strength = step(0.9, sin(abs(cnoise(vUv * 7.0)) * 20.0));

              // colored
              vec3 blackColor = vec3(0.0, 0.0, 0.0);
              vec3 uvColor = vec3(1.0, vUv);
              vec3 mixedColor = mix(blackColor, uvColor, strength);
              gl_FragColor = vec4(mixedColor, 1.0);

              // black and white
              //gl_FragColor = vec4(vec3(strength), 1.0);
              //gl_FragColor = vec4(cos(abs(cnoise(vUv * 25.0)) * 40.0), cos(abs(cnoise(vUv * 25.0)) * 10.0), cos(abs(cnoise(vUv * 25.0)) * 10.0), 1.0);
            }
          `}
        />
      </mesh>
    </>
  );
}

export default function ShaderPatterns() {
  return (
    <CanvasPage background="#222">
      <Canvas shadowMap camera={{ fov: 60 }}>
        <React.Suspense fallback={null}>
          <Scene />
          <OrbitControls listenToKeyEvents={false} />
        </React.Suspense>
      </Canvas>
      <Leva titleBar={false} />
    </CanvasPage>
  );
}
