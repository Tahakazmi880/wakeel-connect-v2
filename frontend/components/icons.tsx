// Inline SVG icon set — every button pairs one of these with a text label.

type P = { className?: string };

function base(className?: string) {
  return { className: className ?? "h-6 w-6", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, viewBox: "0 0 24 24", "aria-hidden": true };
}

export const SearchIcon = ({ className }: P) => (
  <svg {...base(className)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const PhoneIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" /></svg>
);
export const VideoIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="m22 8-6 4 6 4V8Z" /><rect x="2" y="6" width="14" height="12" rx="2" /></svg>
);
export const OfficeIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M3 21h18M5 21V7l7-4 7 4v14" /><path d="M9 9h.01M9 13h.01M15 9h.01M15 13h.01M9 17h6" /></svg>
);
export const DocIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h6" /></svg>
);
export const BriefcaseIcon = ({ className }: P) => (
  <svg {...base(className)}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
);
export const ChatIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
);
export const CheckBadgeIcon = ({ className }: P) => (
  <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2 14.5 4.5 17.5 4l1 3 3 1-.5 3L23.5 14.5 22 17.5 22.5 20.5 19.5 20 17 22.5 14.5 21 12 22.5 9.5 21 7 22.5 4.5 20 1.5 20.5 2 17.5.5 14.5 3 11.5 2.5 8.5 5.5 7.5 6.5 4.5 9.5 5z" opacity="0" />
    <path d="M12 1.8 14.7 4l3.1-.5.9 3 2.9 1.1-.5 3 2 2.6-1.9 2.2.7 3-3 .5-2.4 2-2.5-1.4-2.5 1.4-2.4-2-3-.5.7-3L2.9 13 3.4 10 2.5 7l2.9-1.1.9-3 3.1.5z" />
    <path d="m10.6 14.6-2.1-2.1-1.4 1.4 3.5 3.5 6.4-6.4-1.4-1.4z" fill="#fff" />
  </svg>
);
export const StarIcon = ({ className }: P) => (
  <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
  </svg>
);
export const ClockIcon = ({ className }: P) => (
  <svg {...base(className)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const PinIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
);
export const CalendarIcon = ({ className }: P) => (
  <svg {...base(className)}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
);
export const UserIcon = ({ className }: P) => (
  <svg {...base(className)}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" /></svg>
);
export const ShieldIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
);
export const MenuIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M4 6h16M4 12h16M4 18h16" /></svg>
);
export const CloseIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M18 6 6 18M6 6l12 12" /></svg>
);
export const ArrowIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
);
export const UploadIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M12 16V4m0 0 4 4m-4-4L8 8" /><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></svg>
);
export const WalletIcon = ({ className }: P) => (
  <svg {...base(className)}><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M2 10h20M16 15h.01" /></svg>
);
export const HomeIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>
);
export const CheckIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="m4 12.5 5 5L20 6.5" /></svg>
);
