import React from 'react';
import cx from 'classnames';

export type FlexContainerProps = {
  children: NonNullable<React.ReactNode>;
  alignItems?: string;
  fillHorizontal?: boolean;
  fillVertical?: boolean;
  inline?: boolean;
  justifyContent?: string;
  style?: Object;
  vertical?: boolean;
  wrap?: boolean;
  wrapReverse?: boolean;
};

function FlexContainer({
  alignItems,
  children,
  fillHorizontal = false,
  fillVertical = false,
  inline = false,
  justifyContent,
  style,
  vertical = false,
  wrap = false,
  wrapReverse = false,
}: FlexContainerProps) {
  let flexFlowClass: string;

  if (vertical) {
    flexFlowClass = wrap ? 'column-wrap' : 'column';
    if (wrapReverse) flexFlowClass = 'column-wrap-reverse';
  } else {
    flexFlowClass = wrap ? 'row-wrap' : 'row';
    if (wrapReverse) flexFlowClass = 'row-wrap-reverse';
  }

  const Tag = inline ? 'span' : 'div';

  return (
    <>
      <Tag
        className={cx(
          'flexbox',
          fillHorizontal && 'fill-horizontal',
          fillVertical && 'fill-vertical',
          flexFlowClass,
        )}
        style={{ ...style, alignItems, justifyContent }}
      >
        {children}
      </Tag>
      <style jsx>{`
        .flexbox {
          display: flex;
          position: relative;
        }
        .fill-horizontal {
          min-width: 100%;
        }
        .fill-vertical {
          min-height: 100%;
        }
        .column {
          flex-flow: column nowrap;
        }
        .column-wrap {
          flex-flow: column wrap;
        }
        .column-wrap-reverse: {
          flex-flow: column wrap-reverse;
        }
        .row {
          flex-flow: row nowrap;
        }
        .row-wrap {
          flex-flow: row wrap;
        }
        .row-wrap-reverse {
          flex-flow: row wrap-reverse;
        }
      `}</style>
    </>
  );
}

export default FlexContainer;
