import React from 'react';

export function TempleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 22h16" />
      <path d="M2 18.27v-1.34l9.5-6.65a.5.5 0 0 1 .5 0L22 16.93v1.34" />
      <path d="M12 2v2.4l-5.5 3.85" />
      <path d="M12 4.4l5.5 3.85" />
      <path d="M2.5 13.5h19" />
      <path d="M6.5 13.5v4.95" />
      <path d="M17.5 13.5v4.95" />
    </svg>
  );
}
