import React from 'react';
import './theme.css';

// Simple theme provider without MUI dependencies
export default function SimpleThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-theme">
      {children}
    </div>
  );
}

