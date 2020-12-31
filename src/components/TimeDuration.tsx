import React from 'react';

const YearsDuration = ({ start, end }: { start: string; end: string }) => (
  <>{(new Date(end).getUTCFullYear() - new Date(start).getUTCFullYear()).toString()}</>
);

export default YearsDuration;
