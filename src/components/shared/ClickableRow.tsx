'use client';

import { type ReactNode } from 'react';

type ClickableRowProps = {
  href: string;
  children: ReactNode;
  style?: React.CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export default function ClickableRow({ href, children, style, onMouseEnter, onMouseLeave }: ClickableRowProps) {
  const handleClick = (e: React.MouseEvent) => {
    // Check if user is trying to open in new tab
    if (e.ctrlKey || e.metaKey || e.button === 1) {
      return; // Let browser handle it
    }
    e.preventDefault();
    window.location.href = href;
  };

  return (
    <tr
      style={{ ...style, cursor: 'pointer' }}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </tr>
  );
}

