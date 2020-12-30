import React from 'react';

const YearsDuration = ({ year }: { year: string }) => (
  <>{(new Date().getUTCFullYear() - new Date(`${year}-01-01`).getUTCFullYear()).toString()}</>
);

export default YearsDuration;
