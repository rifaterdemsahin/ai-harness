import React from 'react';

export type HostIconName = 'server' | 'desktop' | 'nuc' | 'laptop';

interface HostIconProps {
  name: HostIconName;
  size?: number;
  color?: string;
}

/** Tiny inline SVG computer icons — no external assets, no network fetch. */
const HostIcon: React.FC<HostIconProps> = ({ name, size = 16, color = 'currentColor' }) => {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    style: { flexShrink: 0 },
  };

  switch (name) {
    case 'server': // datacenter / VPS (Hetzner)
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="7" rx="2" />
          <rect x="3" y="14" width="18" height="7" rx="2" />
          <line x1="7" y1="6.5" x2="7.01" y2="6.5" />
          <line x1="7" y1="17.5" x2="7.01" y2="17.5" />
        </svg>
      );
    case 'desktop': // Mac Mini
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <line x1="3" y1="15" x2="21" y2="15" />
          <line x1="12" y1="19" x2="12" y2="21" />
          <line x1="8" y1="21" x2="16" y2="21" />
        </svg>
      );
    case 'nuc': // Skull Canyon (small form factor)
      return (
        <svg {...common}>
          <rect x="4" y="2.5" width="16" height="19" rx="2" />
          <line x1="4" y1="8" x2="20" y2="8" />
          <circle cx="12" cy="15" r="3.2" />
        </svg>
      );
    case 'laptop': // XPS / MacBook
    default:
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="11" rx="1.6" />
          <path d="M2 18.5h20" />
          <path d="M4 15l-2 3.5M20 15l2 3.5" />
        </svg>
      );
  }
};

/** Pick an icon from a compute line's wording. */
export function hostIconForLine(line: string): HostIconName {
  const text = line.toLowerCase();
  if (/hetzner|vps|datacenter/.test(text)) return 'server';
  if (/mac mini|mini/.test(text)) return 'desktop';
  if (/skull canyon|nuc/.test(text)) return 'nuc';
  return 'laptop';
}

export default HostIcon;
