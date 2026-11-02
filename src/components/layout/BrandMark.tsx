import type { SVGProps } from "react";

export function BrandMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M20 3.5 34 8.6v10.1c0 8.4-5.8 14.7-14 17.8C11.8 33.4 6 27.1 6 18.7V8.6L20 3.5Z" />
      <path d="m12.8 20 4.7 4.6 9.7-10" />
    </svg>
  );
}
