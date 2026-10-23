/** サイトで使う小さなアイコン（線のアイコン、24px 格子）。飾りなので読み上げない */
type Props = { size?: number; className?: string };

function Svg({ size = 20, className, children }: Props & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

export const GlobeIcon = (p: Props) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </Svg>
);

export const ChevronDownIcon = (p: Props) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const CheckIcon = (p: Props) => (
  <Svg {...p}>
    <path d="m5 12 5 5L20 7" />
  </Svg>
);

export const MenuIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Svg>
);

export const CloseIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const DownloadIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" />
  </Svg>
);

export const ArrowRightIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M5 12h14m0 0-6-6m6 6-6 6" />
  </Svg>
);

export const ArrowUpIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M12 19V5m0 0-6 6m6-6 6 6" />
  </Svg>
);

export const ErrorIcon = (p: Props) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5M12 16.5h.01" />
  </Svg>
);

export const InfoIcon = (p: Props) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5M12 7.5h.01" />
  </Svg>
);

export const GitHubIcon = ({ size = 20, className }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" className={className}>
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
  </svg>
);

/* ---- トップページの機能アイコン ---- */
export const LinkIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
  </Svg>
);

export const TranslateIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M4 5h8M8 3v2m2.5 0C9.7 9 7.5 12 4 14m2-6c1 2 3 4 5.5 5" />
    <path d="m12 21 4.5-10 4.5 10m-7.5-3h6" />
  </Svg>
);

export const SigmaIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M18 6V4H6l6 8-6 8h12v-2" />
  </Svg>
);

export const NoteIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h4" />
  </Svg>
);

export const SlidesIcon = (p: Props) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M12 16v4m-4 0h8M7 9h5m-5 3h3" />
  </Svg>
);

export const BookIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
    <path d="M4 19V5m4 2h7" />
  </Svg>
);

export const GraphIcon = (p: Props) => (
  <Svg {...p}>
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="18" cy="8" r="2.5" />
    <circle cx="9" cy="18" r="2.5" />
    <path d="m8.3 7.2 7.4.6M7 8.4l1.4 7.2m2.4-.6 5.4-5.2" />
  </Svg>
);

export const NetworkIcon = (p: Props) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="2.5" />
    <circle cx="5" cy="5" r="2" />
    <circle cx="19" cy="5" r="2" />
    <circle cx="5" cy="19" r="2" />
    <circle cx="19" cy="19" r="2" />
    <path d="m6.5 6.5 3.7 3.7m7.3-3.7-3.7 3.7m-7.3 7.3 3.7-3.7m7.3 3.7-3.7-3.7" />
  </Svg>
);

export const PlugIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M9 3v4m6-4v4M7 7h10v4a5 5 0 0 1-10 0zm5 9v5" />
  </Svg>
);

export const VaultIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M8 13h8" />
  </Svg>
);

export const HighlightIcon = (p: Props) => (
  <Svg {...p}>
    <path d="m14 4 6 6-8 8H6v-6z" />
    <path d="M4 21h16" />
  </Svg>
);

export const LockIcon = (p: Props) => (
  <Svg {...p}>
    <rect x="4.5" y="10" width="15" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3" />
  </Svg>
);

export const ShieldIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
);

export const MarkdownIcon = (p: Props) => (
  <Svg {...p}>
    <rect x="2.5" y="5" width="19" height="14" rx="2" />
    <path d="M6 15V9l2.5 3L11 9v6m5-6v6m-2-2 2 2 2-2" />
  </Svg>
);

export const GemIcon = (p: Props) => (
  <Svg {...p}>
    <path d="m12 2 7 6-3 13H8L5 8z" />
    <path d="m5 8 7 3 7-3m-7 3v10" />
  </Svg>
);

export const ParseIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M7 4H5v16h2m10-16h2v16h-2" />
    <path d="M9 9h6m-6 3h6m-6 3h4" />
  </Svg>
);

export const MonitorIcon = (p: Props) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M8 20h8m-4-4v4" />
  </Svg>
);

export const LaptopIcon = (p: Props) => (
  <Svg {...p}>
    <rect x="5" y="5" width="14" height="10" rx="1.5" />
    <path d="M3 19h18l-2-4H5z" />
  </Svg>
);

export const TerminalIcon = (p: Props) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="m7 9 3 3-3 3m5 0h5" />
  </Svg>
);

export const CodeIcon = (p: Props) => (
  <Svg {...p}>
    <path d="m8 7-5 5 5 5m8-10 5 5-5 5" />
  </Svg>
);

export const ExpandIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />
  </Svg>
);

export const ArrowUpRightIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M7 17 17 7m0 0H9m8 0v8" />
  </Svg>
);
