'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useRole } from '@/context/RoleContext';
import { useSchoolData } from '@/hooks/useSchoolData';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  breadcrumb?: string;
  actions?: React.ReactNode;
}

export default function DashboardHeader({
  title = 'Overview Dashboard',
  subtitle = 'Academic Year 2025-26 · Term 1 · Last updated: 11 May 2026, 04:30 AM',
  breadcrumb = 'Overview Dashboard',
  actions,
}: DashboardHeaderProps) {
  const { role, alerts } = useSchoolData();
  const router = useRouter();

  const [searchValue, setSearchValue] = useState('');
  const [bellOpen, setBellOpen] = useState(false);
  const [hasRead, setHasRead] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const displayAlerts = alerts;
  const notificationKey = `dashboard-notifications-read:${displayAlerts.map((alert) => alert.id).join('|')}`;
  const unreadCount = hasRead ? 0 : displayAlerts.length;

  useEffect(() => {
    const savedValue = localStorage.getItem(notificationKey);
    setHasRead(savedValue === '1');
  }, [notificationKey]);

  const markNotificationsRead = () => {
    setHasRead(true);
    localStorage.setItem(notificationKey, '1');
  };

  const handleBellClick = () => {
    setBellOpen(!bellOpen);
    if (!bellOpen) {
      markNotificationsRead();
    }
  };

  const menuItems = [
    { name: 'Class Overview', path: '/' },
    { name: 'Student Profile', path: '/student-profile-class-list' },
    { name: 'Compliance Data Entry', path: '/class-compliance-data-entry-audit' },
    { name: 'Tuition Status', path: '/tuition-status' },
    { name: 'Transcript Hub', path: '/transcript-hub' },
  ];

  const filteredMenu = menuItems.filter((m) => m.name.toLowerCase().includes(searchValue.toLowerCase()));

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredMenu.length > 0) {
      router.push(filteredMenu[0].path);
      setSearchValue('');
      (document.activeElement as HTMLElement)?.blur();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setBellOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <span className="font-medium">The Olympia Schools</span>
          <span>/</span>
          <span className="font-semibold" style={{ color: 'var(--primary)' }}>
            {breadcrumb}
          </span>
        </div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--primary)', letterSpacing: '-0.01em' }}>
          {title}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {actions}

        <div className="relative group">
          <div className="flex items-center bg-white border border-border rounded-lg px-3 py-2 w-64 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            <Search size={16} className="text-muted-foreground mr-2" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search main menu functions..."
              className="bg-transparent border-none focus:outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-border rounded-xl shadow-xl opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all z-50 p-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1 mb-1">
              {searchValue ? 'Results' : 'Suggested'}
            </p>
            {filteredMenu.length === 0 ? (
              <p className="text-xs text-muted-foreground px-2 py-2">No results found.</p>
            ) : (
              filteredMenu.map((menu) => (
                <button
                  key={menu.path}
                  onClick={() => router.push(menu.path)}
                  className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  {menu.name}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="relative" ref={bellRef}>
          <button
            onClick={handleBellClick}
            className="relative p-2 rounded-lg border border-border bg-white hover:bg-muted transition-colors btn-press"
          >
            <Bell size={18} className="text-muted-foreground" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: 'var(--danger)', fontSize: '10px' }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {bellOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-border rounded-xl shadow-xl z-50 overflow-hidden fade-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                <h3 className="font-bold text-foreground text-sm">Notifications</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-danger/10 text-danger">{unreadCount} New</span>
              </div>
              <div className="max-h-80 overflow-y-auto scroll-thin p-2 space-y-1">
                {displayAlerts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No new notifications</p>
                ) : (
                  displayAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 hover:bg-muted/50 rounded-lg transition-colors relative pl-6">
                      <div className="absolute left-2.5 top-5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: alert.dotColor }} />
                      <p className="text-xs text-muted-foreground mb-1">{alert.time}</p>
                      <p className="text-sm text-foreground leading-snug">{alert.message}</p>
                      {alert.action && alert.actionHref && (
                        <Link
                          href={alert.actionHref}
                          onClick={() => setBellOpen(false)}
                          className="inline-block text-xs font-semibold mt-2 hover:underline transition-colors text-primary"
                        >
                          {alert.action}
                        </Link>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-border p-2">
                <button
                  onClick={() => {
                    markNotificationsRead();
                    setBellOpen(false);
                  }}
                  className="w-full text-center text-xs text-muted-foreground hover:text-foreground font-semibold py-1 transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg border border-border bg-white hover:bg-muted transition-colors">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
            style={{ background: 'linear-gradient(135deg, #7b2db8, #5b1d8d)' }}
          >
            {role === 'principal' ? 'HV' : 'JW'}
          </div>
          <ChevronDown size={14} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
