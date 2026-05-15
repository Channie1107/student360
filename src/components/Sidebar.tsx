'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
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
  Check,
} from 'lucide-react';
import AppImage from '@/components/ui/AppImage';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const teacherNavItems: NavItem[] = [
  { id: 'nav-overview', label: 'Class Overview', href: '/', icon: <LayoutDashboard size={18} /> },
  { id: 'nav-student-class', label: 'Student Profile', href: '/student-profile-class-list', icon: <UserCircle size={18} /> },
  { id: 'nav-compliance-audit', label: 'Compliance Data Entry', href: '/class-compliance-data-entry-audit', icon: <ClipboardCheck size={18} /> },
  { id: 'nav-tuition', label: 'Tuition Status', href: '/tuition-status', icon: <CreditCard size={18} /> },
  { id: 'nav-transcript', label: 'Transcript Hub', href: '/transcript-hub', icon: <FileText size={18} /> },
  { id: 'nav-settings', label: 'Settings', href: '/settings', icon: <Settings size={18} /> },
];

const principalNavItems: NavItem[] = [
  { id: 'nav-overview', label: 'Overview Dashboard', href: '/', icon: <LayoutDashboard size={18} /> },
  { id: 'nav-student', label: 'Student Profile', href: '/student-profile', icon: <UserCircle size={18} /> },
  { id: 'nav-compliance', label: 'Compliance Matrix', href: '/compliance-matrix', icon: <ClipboardCheck size={18} />, badge: 3 },
  { id: 'nav-admissions', label: 'Admissions & Finance', href: '/admissions-finance', icon: <CreditCard size={18} /> },
  { id: 'nav-tuition', label: 'Tuition Status', href: '/tuition-status', icon: <CreditCard size={18} /> },
  { id: 'nav-transcript', label: 'Transcript Hub', href: '/transcript-hub', icon: <FileText size={18} /> },
  { id: 'nav-settings', label: 'Settings', href: '/settings', icon: <Settings size={18} /> },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { role, setRole } = useRole();
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = role === 'principal' ? principalNavItems : teacherNavItems;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleRoleChange = (newRole: 'principal' | 'teacher') => {
    setRole(newRole);
    setProfileOpen(false);
  };

  return (
    <aside
      className="fixed left-0 top-0 z-40 flex h-screen flex-col overflow-hidden sidebar-transition"
      style={{ backgroundColor: '#5b1d8d', width: collapsed ? '64px' : '240px' }}
    >
      <div className="flex flex-shrink-0 items-center justify-between border-b border-white/10 px-3 py-4">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div
            className="flex h-[36px] min-w-[36px] flex-shrink-0 items-center justify-center rounded-lg border-2 p-1"
            style={{ borderColor: 'var(--accent)' }}
          >
            <AppImage
              src="/assets/images/image-1778473951253.png"
              alt="The Olympia Schools crest"
              width={28}
              height={28}
              className="object-contain"
              unoptimized
            />
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-bold leading-tight tracking-wide text-white" style={{ letterSpacing: '0.06em' }}>
                STUDENT 360
              </span>
              <span className="truncate text-2xs font-medium text-white/60">Olympia Schools</span>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className="flex-shrink-0 rounded-md p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white btn-press"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin">
        <div className="space-y-0.5 px-2">
          {!collapsed && <p className="px-3 py-2 text-2xs font-medium uppercase tracking-widest text-white/40">Main Menu</p>}
          {teacherNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 group ${
                  active ? 'nav-active-bar bg-white/12 text-[#ffd900] shadow-sm' : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                {!collapsed && item.badge && item.badge > 0 && (
                  <span
                    className="flex-shrink-0 rounded-full px-1.5 py-0.5 text-2xs font-700 leading-none text-white"
                    style={{ backgroundColor: 'var(--danger)', fontSize: '10px' }}
                  >
                    {item.badge}
                  </span>
                )}
                {collapsed && item.badge && item.badge > 0 && (
                  <span
                    className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: 'var(--danger)', fontSize: '9px', fontWeight: 700 }}
                  >
                    {item.badge}
                  </span>
                )}
                {collapsed && (
                  <div
                    className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100"
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

      <div className="relative flex-shrink-0 border-t border-white/10">
        {profileOpen && (
          <div className="absolute bottom-full left-2 right-2 z-50 mb-2 overflow-hidden rounded-lg bg-white text-sm shadow-xl animate-in fade-in slide-in-from-bottom-2">
            <div className="border-b bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-500">Switch Role</div>
            <button
              onClick={() => handleRoleChange('principal')}
              className="flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-gray-50"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">Dr. Helena Vance</span>
                <span className="text-xs text-gray-500">Senior Principal</span>
              </div>
              {role === 'principal' && <Check size={16} className="text-purple-600" />}
            </button>
            <button
              onClick={() => handleRoleChange('teacher')}
              className="flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-gray-50"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">Mr. James Wilson</span>
                <span className="text-xs text-gray-500">Homeroom Teacher · 11A</span>
              </div>
              {role === 'teacher' && <Check size={16} className="text-purple-600" />}
            </button>
          </div>
        )}

        <button onClick={() => setProfileOpen(!profileOpen)} className="flex w-full items-center gap-2.5 px-3 py-3 transition-colors hover:bg-white/10">
          <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border-2 border-accent">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#7b2db8] to-[#5b1d8d] text-xs font-bold text-white">
              {role === 'principal' ? 'HV' : 'JW'}
            </div>
          </div>
          {!collapsed && (
            <>
              <div className="flex flex-1 flex-col items-start overflow-hidden">
                <span className="truncate text-xs font-semibold text-white">
                  {role === 'principal' ? 'Dr. Helena Vance' : 'Mr. James Wilson'}
                </span>
                <span className="truncate text-2xs text-white/50">
                  {role === 'principal' ? 'Senior Principal' : 'Homeroom Teacher · 11A'}
                </span>
              </div>
              <ChevronDown size={14} className={`flex-shrink-0 text-white/50 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
