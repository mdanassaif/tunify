import React from 'react';

export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="#000000"
    viewBox="0 0 512 512"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M256 4.1C114.6 4.1 0 118.7 0 260.1c0 121 84.1 222.2 196.9 248.9V279.8H98.5L256 102.6l157.5 177.2H315V509c112.9-26.7 197-127.9 197-248.9c0-141.4-114.6-256-256-256z"
    />
  </svg>
);
 