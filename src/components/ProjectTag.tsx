import React from 'react';
import cx from 'classnames';
import { ProjectTag as ProjectTagType } from '../types';
import { linearGradient } from '../theme';

const ProjectTag = ({
  filled,
  tag,
  onClick,
}: {
  filled?: boolean;
  tag: ProjectTagType;
  onClick?: () => void;
}) => (
  <>
    <div
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cx('tag', onClick && 'tag--button', filled && 'tag--filled')}
    >
      {tag}
    </div>
    <style jsx>{`
      .tag {
        font-size: 0.6rem;
        font-weight: 300;
        line-height: 0.6rem;
        margin: 8px 8px 0 0;
        border: 1px solid currentcolor;
        padding: 2px 8px;
        border-radius: 2px;
        transition: color 300ms; // can't transition gradient background
        flex-grow: 0;
      }
      .tag--button {
        cursor: pointer;
      }
      .tag--button:hover,
      .tag--filled {
        color: #fff;
        background: ${linearGradient};
      }
    `}</style>
  </>
);

export default ProjectTag;
