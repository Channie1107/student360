'use client';

import React, { useState } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

export default function DashboardHeader() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <span className="font-medium">The Olympia Schools</span>
          <span>/</span>
          <span className="font-semibold" style={{ color: 'var(--primary)' }}>
            Overview Dashboard
          </span>
        </div>
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--primary)', letterSpacing: '-0.01em' }}
        >
          Overview Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Academic Year 2025–26 · Term 1 · Last updated: 11 May 2026, 04:30 AM
        </p>
      </div>
      <div className="flex items-center gap-3">
        {/* Search */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="p-2 rounded-lg border border-border bg-white hover:bg-muted transition-colors btn-press"
          aria-label="Open search"
        >
          <Search size={18} className="text-muted-foreground" />
        </button>
        {/* Notifications */}
        <button className="relative p-2 rounded-lg border border-border bg-white hover:bg-muted transition-colors btn-press">
          <Bell size={18} className="text-muted-foreground" />
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: 'var(--danger)', fontSize: '10px' }}
          >
            3
          </span>
        </button>
        {/* Avatar */}
        <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg border border-border bg-white hover:bg-muted transition-colors">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
            style={{ background: 'linear-gradient(135deg, #7b2db8, #5b1d8d)' }}
          >
            HV
          </div>
          <ChevronDown size={14} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}