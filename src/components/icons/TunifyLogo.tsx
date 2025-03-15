import React from 'react';

export const TunifyLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 17a3 3 0 1 0 6 0a3 3 0 0 0-6 0m6 0V4h10v9M9 8h10m1 13l2-2l-2-2m-3 0l-2 2l2 2"
    />
  </svg>
);


 