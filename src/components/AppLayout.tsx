'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main
        className="flex-1 min-w-0 content-transition"
        style={{ marginLeft: collapsed ? '64px' : '240px' }}
      >
        {children}
      </main>
    </div>
  );
}