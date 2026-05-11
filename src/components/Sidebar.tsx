'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


import AppImage from '@/components/ui/AppImage';
import {
  LayoutDashboard,
  UserCircle,
  ClipboardCheck,
  CreditCard,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    id: 'nav-overview',
    label: 'Overview Dashboard',
    href: '/',
    icon: <LayoutDashboard size={18} />,
  },
  {
    id: 'nav-student',
    label: 'Student Profile',
    href: '/student-profile',
    icon: <UserCircle size={18} />,
  },
  {
    id: 'nav-compliance',
    label: 'Compliance Matrix',
    href: '/compliance-matrix',
    icon: <ClipboardCheck size={18} />,
    badge: 3,
  },
  {
    id: 'nav-admissions',
    label: 'Admissions & Finance',
    href: '/admissions-finance',
    icon: <CreditCard size={18} />,
  },
  {
    id: 'nav-transcript',
    label: 'Transcript Hub',
    href: '/transcript-hub',
    icon: <FileText size={18} />,
  },
  {
    id: 'nav-settings',
    label: 'Settings',
    href: '/settings',
    icon: <Settings size={18} />,
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="fixed left-0 top-0 h-screen z-40 flex flex-col gradient-purple sidebar-transition overflow-hidden"
      style={{ width: collapsed ? '64px' : '240px' }}
    >
      {/* Branding Block */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div
            className="flex-shrink-0 rounded-lg border-2 p-1 flex items-center justify-center"
            style={{ borderColor: 'var(--accent)', minWidth: 36, minHeight: 36 }}
          >
            <AppImage
              src="/assets/images/image-1778473951253.png"
              alt="The Olympia Schools crest shield with open book, keys, laurel wreath and column"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span
                className="text-white font-bold text-sm leading-tight tracking-wide truncate"
                style={{ letterSpacing: '0.06em' }}
              >
                STUDENT 360
              </span>
              <span className="text-white/60 text-2xs font-medium truncate">
                Olympia Schools
              </span>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className="flex-shrink-0 text-white/60 hover:text-white hover:bg-white/10 rounded-md p-1 transition-colors btn-press"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto scrollbar-thin">
        <div className="px-2 space-y-0.5">
          {!collapsed && (
            <p className="text-white/40 text-2xs font-600 uppercase tracking-widest px-3 py-2">
              Main Menu
            </p>
          )}
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150 group
                  ${active
                    ? 'bg-white/15 text-white nav-active-bar' :'text-white/70 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="truncate flex-1">{item.label}</span>
                )}
                {!collapsed && item.badge && item.badge > 0 && (
                  <span
                    className="flex-shrink-0 text-2xs font-700 rounded-full px-1.5 py-0.5 leading-none"
                    style={{
                      backgroundColor: 'var(--danger)',
                      color: 'white',
                      fontSize: '10px',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                {collapsed && item.badge && item.badge > 0 && (
                  <span
                    className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-white"
                    style={{
                      backgroundColor: 'var(--danger)',
                      fontSize: '9px',
                      fontWeight: 700,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                {/* Tooltip for collapsed */}
                {collapsed && (
                  <div
                    className="absolute left-full ml-2 px-2 py-1 bg-foreground text-white text-xs rounded-md
                    opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50
                    transition-opacity duration-150"
                    style={{ fontSize: '12px' }}
                  >
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Profile Block */}
      <div className="border-t border-white/10 flex-shrink-0">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="w-full flex items-center gap-2.5 px-3 py-3 hover:bg-white/10 transition-colors"
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border-2 border-accent">
            <div
              className="w-full h-full flex items-center justify-center text-white font-bold text-xs"
              style={{ background: 'linear-gradient(135deg, #7b2db8, #5b1d8d)' }}
            >
              HV
            </div>
          </div>
          {!collapsed && (
            <>
              <div className="flex flex-col items-start overflow-hidden flex-1">
                <span className="text-white font-semibold text-xs truncate">
                  Dr. Helena Vance
                </span>
                <span className="text-white/50 text-2xs truncate">
                  Senior Principal
                </span>
              </div>
              <ChevronDown
                size={14}
                className={`text-white/50 flex-shrink-0 transition-transform ${profileOpen ? 'rotate-180' : ''}`}
              />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}