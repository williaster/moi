import React from 'react';
import cx from 'classnames';
import TimeDuration from './TimeDuration';
import { mutedBlack } from '../theme';

const DateRange = ({
  start,
  end,
  showDuration = false,
}: {
  start: string;
  end: string;
  showDuration?: boolean;
}) => (
  <>
    <span className="date-range">
      {start}
      {end && ` – ${end}`}
      {showDuration && <>{<TimeDuration start={start} end={end} />}</>}
    </span>
    <style jsx>{`
      .date-range {
        font-size: 0.8rem;
        color: ${mutedBlack};
        font-weight: 400;
      }
    `}</style>
  </>
);

export default DateRange;
