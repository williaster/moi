/* eslint-disable no-undef */
import React, { useMemo, useState } from 'react';
import { Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { scaleLinear } from '@visx/scale';

import getIngredientHierarchy from './parsers/getIngredientHierarchy';
import useStore from './appStore';

type Hierarchy = ReturnType<typeof getIngredientHierarchy>;

interface IngredientIcicleProps {
  hierarchy: Hierarchy;
  horizontal?: boolean;
}

export default function IngredientIcicle({ hierarchy, horizontal }: IngredientIcicleProps) {
  const {
    size: { height, width },
  } = useThree();
  const size = horizontal ? width : height;
  const maxValue = hierarchy.value ?? 0;
  const scale = useMemo(() => scaleLinear({ domain: [0, maxValue], range: [0, size] }), [
    size,
    maxValue,
  ]);

  const [catExpanded, setCatExpanded] = useState<Hierarchy | null>(null);
  const { selectedIngredients, setSelectedIngredients } = useStore();

  return (
    <Html
      calculatePosition={() => [0, 0, 0]}
      style={{
        fontSize: 16,
        // height: '100%',
        width: horizontal ? '100%' : undefined,
        height: horizontal ? undefined : '100%',
        display: 'flex',
        flexDirection: horizontal ? 'column' : 'row',
        flexWrap: 'nowrap',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: horizontal ? 'row' : 'column',
          width: horizontal ? '100vw' : 80,
          height: horizontal ? 60 : '100vh',
        }}
      >
        {(hierarchy?.children ?? [])
          .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
          .map(d => (
            <div
              key={d.data.name}
              style={{
                textAlign: 'center',
                width: horizontal ? scale(d.value ?? 0) : '100%',
                height: horizontal ? '100%' : scale(d.value ?? 0),
                outline: '1px solid white',
                outlineOffset: '-1px',
                background: d.data.name === catExpanded?.data.name ? '#ddd' : null,
                cursor: 'pointer',
              }}
              role="button"
              tabIndex={0}
              onKeyDown={e =>
                e.key === 'Enter' &&
                setCatExpanded(d.data.name === catExpanded?.data?.name ? null : d)
              }
              onClick={() => setCatExpanded(d.data.name === catExpanded?.data.name ? null : d)}
            >
              <div>{d.data.name}</div>
            </div>
          ))}
      </div>

      {catExpanded && (
        <div
          style={{
            display: 'flex',
            flexDirection: horizontal ? 'row' : 'column',
            width: horizontal ? '100vw' : 80,
            height: horizontal ? 60 : '100vh',
          }}
        >
          {(catExpanded?.children ?? [])
            .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
            .map(d => {
              const itemHeight = (size / scale(catExpanded.value)) * scale(d.value ?? 0);
              const showLabel = itemHeight >= 10;
              const isSelected = selectedIngredients && selectedIngredients.includes(d.data.name);
              return (
                <div
                  key={d.data.name}
                  style={{
                    textAlign: 'center',
                    width: horizontal ? itemHeight : '100%',
                    height: horizontal ? '100%' : itemHeight,
                    outline: '1px solid white',
                    outlineOffset: '-1px',
                    background: isSelected ? '#ddd' : null,
                    cursor: 'pointer',
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e =>
                    e.key === 'Enter' &&
                    setSelectedIngredients(
                      isSelected
                        ? selectedIngredients.filter(i => i !== d.data.name)
                        : [...(selectedIngredients ?? []), d.data.name],
                    )
                  }
                  onClick={() =>
                    setSelectedIngredients(
                      isSelected
                        ? selectedIngredients.filter(i => i !== d.data.name)
                        : [...(selectedIngredients ?? []), d.data.name],
                    )
                  }
                >
                  {showLabel && <div>{d.data.name}</div>}
                </div>
              );
            })}
        </div>
      )}
    </Html>
  );
}
