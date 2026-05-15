'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const [searchValue, setSearchValue] = useState('');

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-card border-b border-border sticky top-0 z-30" style={{ minHeight: 56 }}>
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>The Olympia Schools</span>
          <Icon name="ChevronRightIcon" size={14} variant="outline" />
          <span className="font-semibold text-foreground">{title}</span>
        </div>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Icon name="MagnifyingGlassIcon" size={16} variant="outline" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students, alerts..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 w-56 transition-all"
            suppressHydrationWarning
          />
        </div>
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Notifications" suppressHydrationWarning>
          <Icon name="BellIcon" size={20} variant="outline" className="text-foreground" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-danger text-white text-xs flex items-center justify-center font-bold" style={{ fontSize: 10 }}>3</span>
        </button>
        <div className="avatar-circle" style={{ background: '#ffd900', color: '#5b1d8d', width: 34, height: 34, fontSize: '0.8rem', cursor: 'pointer' }}>
          JW
        </div>
      </div>
    </header>
  );
}