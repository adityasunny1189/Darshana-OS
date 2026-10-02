import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...p }: P) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...p,
  };
}

export const IconSearch = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </svg>
);
export const IconBookmark = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base(p)} fill={filled ? "currentColor" : "none"}>
    <path d="M6.5 4.5h11v15.5L12 16l-5.5 4z" />
  </svg>
);
export const IconSun = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
  </svg>
);
export const IconMoon = (p: P) => (
  <svg {...base(p)}>
    <path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10Z" />
  </svg>
);
export const IconLamp = (p: P) => (
  // a diya — small oil lamp
  <svg {...base(p)}>
    <path d="M12 3.5c1.6 2 2.2 3.4 1.6 4.6-.5 1-2.7 1-3.2 0-.6-1.2 0-2.6 1.6-4.6Z" />
    <path d="M3.5 12.5c2.4 3.4 5.2 5 8.5 5s6.1-1.6 8.5-5c-3 .9-5.8 1.3-8.5 1.3s-5.5-.4-8.5-1.3Z" />
    <path d="M9 20.5h6" />
  </svg>
);
export const IconBook = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 6.5c-2-1.4-4.6-2-7.5-2v13c2.9 0 5.5.6 7.5 2 2-1.4 4.6-2 7.5-2v-13c-2.9 0-5.5.6-7.5 2Z" />
    <path d="M12 6.5v13" />
  </svg>
);
export const IconGraph = (p: P) => (
  <svg {...base(p)}>
    <circle cx="6" cy="7" r="2.2" />
    <circle cx="18" cy="6" r="2.2" />
    <circle cx="12" cy="17" r="2.2" />
    <path d="M8 8.2 10.6 15M16.7 7.8 13.3 15.2M8.2 6.8l7.6-.6" />
  </svg>
);
export const IconQuestion = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.6 9.4a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.2 1-1.2 1.8v.3" />
    <path d="M12 16.8h.01" />
  </svg>
);
export const IconPath = (p: P) => (
  <svg {...base(p)}>
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="6" r="2" />
    <path d="M8 18h6.5a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7H16" />
  </svg>
);
export const IconHome = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 10.5 12 4l8 6.5V20h-5.5v-5.5h-5V20H4z" />
  </svg>
);
export const IconUser = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 20c.9-3.4 3.6-5.5 7-5.5s6.1 2.1 7 5.5" />
  </svg>
);
export const IconChevronLeft = (p: P) => (
  <svg {...base(p)}>
    <path d="m14.5 6-6 6 6 6" />
  </svg>
);
export const IconChevronRight = (p: P) => (
  <svg {...base(p)}>
    <path d="m9.5 6 6 6-6 6" />
  </svg>
);
export const IconChevronDown = (p: P) => (
  <svg {...base(p)}>
    <path d="m6 9.5 6 6 6-6" />
  </svg>
);
export const IconArrowRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 12h15M14 6.5l5.5 5.5-5.5 5.5" />
  </svg>
);
export const IconClose = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const IconType = (p: P) => (
  <svg {...base(p)}>
    <path d="M3.5 18 8 6l4.5 12M5.2 14h5.6" />
    <path d="M14.5 18l2.9-7.5 2.9 7.5M15.5 15.6h3.8" />
  </svg>
);
export const IconCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const IconNote = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 4.5h10l4 4V19.5H5z" />
    <path d="M14.5 4.5v4.5h4.5M8.5 13h7M8.5 16.5h5" />
  </svg>
);
export const IconQuote = (p: P) => (
  <svg {...base(p)}>
    <path d="M9.5 7C6.5 8 5 10.2 5 13.5V17h4.5v-4.5H7c0-2 .8-3.3 2.5-4M18.5 7c-3 1-4.5 3.2-4.5 6.5V17h4.5v-4.5H16c0-2 .8-3.3 2.5-4" />
  </svg>
);
export const IconSpark = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
  </svg>
);
export const IconLayers = (p: P) => (
  <svg {...base(p)}>
    <path d="m12 4 8.5 4.5L12 13 3.5 8.5z" />
    <path d="m3.5 12.5 8.5 4.5 8.5-4.5M3.5 16.5 12 21l8.5-4.5" />
  </svg>
);
export const IconClock = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
export const IconSource = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 3.5h8l4 4v13H7z" />
    <path d="M15 3.5V8h4M4.5 7v13.5H15" />
  </svg>
);
