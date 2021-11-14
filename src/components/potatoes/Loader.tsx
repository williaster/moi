// forked from @react-three/drei <Loader />
import React, { useRef, useEffect, useCallback } from 'react';
import { useProgress } from '@react-three/drei';
import * as colors from './colors';

const formatLoadedPercent = (percent?: number) =>
  `Loading${typeof percent === 'number' ? ` ${percent.toFixed(0)}` : ''}%`;

export default function Loader() {
  const { active, progress } = useProgress();
  const progressRef = useRef(0);
  const rafRef = useRef(0);
  const progressSpanRef = useRef<HTMLSpanElement>(null);

  const updateProgress = useCallback(() => {
    if (active && progressSpanRef.current) {
      progressSpanRef.current.innerText = formatLoadedPercent(progressRef.current);
      progressRef.current += (progress - progressRef.current) / 2;
      if (progressRef.current > 0.95 * progress || progress === 100) progressRef.current = progress;
      if (progressRef.current < progress) rafRef.current = requestAnimationFrame(updateProgress);
    }
  }, [progress]);

  useEffect(() => {
    updateProgress();
    return () => cancelAnimationFrame(rafRef.current);
  }, [updateProgress]);

  return active ? (
    <div style={styles.container}>
      <div>
        <div style={styles.title}>Potato ranks 🥔</div>
        <div style={styles.inner}>
          <div style={{ ...styles.bar, transform: `scaleX(${progress / 100})` }}></div>
          <span ref={progressSpanRef} style={styles.data}>
            Loading
          </span>
        </div>
      </div>
    </div>
  ) : null;
}

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    color: colors.textColorDark,
  },
  inner: {
    width: 200,
    height: 4,
    background: colors.textColorDark,
    textAlign: 'center',
  },
  bar: {
    height: '100%',
    width: '100%',
    background: colors.highlightColor,
    transition: 'transform 200ms',
    transformOrigin: 'left center',
  },
  data: {
    display: 'inline-block',
    position: 'relative',
    fontVariantNumeric: 'tabular-nums',
    marginTop: '0.3em',
    fontSize: '1.5vh',
    whiteSpace: 'nowrap',
  },
  title: {
    position: 'absolute',
    left: '50%',
    top: '43%',
    transform: 'translateX(-50%)',
    fontSize: '4.5vh',
    lineHeight: '1em',
    fontWeight: 'bold',
    width: 'fit-content',
  },
} as const;
