import * as THREE from 'three';
import * as ReactDOM from 'react-dom';
import { createContext, useState, useContext, useEffect, useRef, useMemo } from 'react';
import { context as fiberContext, useFrame, useThree } from '@react-three/fiber';

interface Context {
  el: HTMLDivElement;
  eps: number;
  fill: HTMLDivElement;
  fixed: HTMLDivElement;
  horizontal: boolean;
  damping: number;
  offset: number;
  delta: number;
  pages: number;
  range: (start: number, end: number) => number;
  visible: (start: number, end: number) => boolean;
}

const context = createContext<Context>(undefined);

export function useScroll() {
  return useContext(context);
}

export function ScrollControls({
  eps = 0.00001,
  horizontal = false,
  pages = 1,
  distance = 1,
  damping = 4,
  children,
}) {
  const gl = useThree(state => state.gl);
  const invalidate = useThree(state => state.invalidate);
  const events = useThree(state => state.events);
  const raycaster = useThree(state => state.raycaster);
  const [el] = useState(() => document.createElement('div'));
  const [fill] = useState(() => document.createElement('div'));
  const [fixed] = useState(() => document.createElement('div'));
  const target = gl.domElement.parentNode;
  const scroll = useRef(0);

  const state = useMemo(() => {
    const state: Context = {
      el,
      eps,
      fill,
      fixed,
      horizontal,
      damping,
      offset: 0,
      delta: 0,
      pages,
      // 0 - 1 for a range between start - end
      range(start: number, end: number) {
        return this.offset < start
          ? 0
          : this.offset > end
          ? 1
          : (this.offset - start) / (end - start);
      },
      visible(start: number, end: number) {
        return this.offset >= start && this.offset <= end;
      },
    };
    return state;
  }, [eps, damping, horizontal, pages]);

  useEffect(() => {
    el.style.position = 'absolute';
    el.style.width = '100%';
    el.style.height = '100%';
    el.style[horizontal ? 'overflowX' : 'overflowY'] = 'auto';
    el.style.top = '0';
    el.style.left = '0';

    fixed.style.position = 'sticky';
    fixed.style.top = '0';
    fixed.style.left = '0';
    el.appendChild(fixed);

    fill.style.height = horizontal ? '100%' : `${pages * distance * 100}%`;
    fill.style.width = horizontal ? `${pages * distance * 100}%` : '100%';
    fill.style.pointerEvents = 'none';
    el.appendChild(fill);

    const onScroll = e => {
      invalidate();
      scroll.current = horizontal
        ? e.target.scrollLeft / (e.target.scrollWidth - e.target.clientWidth)
        : e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight);
    };
    el.addEventListener('scroll', onScroll, { passive: true });

    target.appendChild(el);

    requestAnimationFrame(() => events.connect(el));
    raycaster.computeOffsets = ({ clientX, clientY }) => ({ offsetX: clientX, offsetY: clientY });
    return () => {
      target.removeChild(el);
      el.removeEventListener('scroll', onScroll);
    };
  }, [invalidate, distance, damping, pages, horizontal]);

  let last = 0;
  useFrame((_, delta) => {
    state.offset = THREE.MathUtils.damp((last = state.offset), scroll.current, damping, delta);
    state.delta = THREE.MathUtils.damp(state.delta, Math.abs(last - state.offset), damping, delta);
    if (state.delta > eps) invalidate();
  });
  return <context.Provider value={state}>{children}</context.Provider>;
}

export function Scroll({ html, ...props }: { html?: boolean; children: React.ReactNode }) {
  const El: React.FC = html ? ScrollHtml : ScrollCanvas;
  return <El {...props} />;
}

function ScrollCanvas({ children }) {
  const group = useRef<THREE.Group>();
  const state = useScroll();
  const viewport = useThree(state => state.viewport);

  useFrame(() => {
    group.current.position.x = state.horizontal
      ? -viewport.width * (state.pages - 1) * state.offset
      : 0;
    group.current.position.y = state.horizontal
      ? 0
      : viewport.height * (state.pages - 1) * state.offset;
  });

  return <group ref={group}>{children}</group>;
}

function ScrollHtml({ children, style, ...props }) {
  const state = useScroll();
  const group = useRef(undefined);
  const size = useThree(state => state.size);
  const fiberState = useContext(fiberContext);

  useFrame(() => {
    if (group.current && state.delta > state.eps) {
      group.current.style.transform = `translate3d(${
        state.horizontal ? -size.width * (state.pages - 1) * state.offset : 0
      }px,${state.horizontal ? 0 : size.height * (state.pages - 1) * -state.offset}px,0)`;
    }
  });

  ReactDOM.render(
    <div
      ref={group}
      style={{ ...style, position: 'absolute', top: 0, left: 0, willChange: 'transform' }}
      {...props}
    >
      <context.Provider value={state}>
        <fiberContext.Provider value={fiberState}>{children}</fiberContext.Provider>
      </context.Provider>
    </div>,
    state.fixed,
  );
  return null;
}
