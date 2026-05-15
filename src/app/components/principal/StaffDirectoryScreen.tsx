'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Eye,
  Mail,
  Search,
  ShieldCheck,
  UserCog,
  UserRound,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

import DashboardHeader from '@/app/components/DashboardHeader';
import StatusBadge from '@/components/ui/StatusBadge';

type StaffStatus = 'Compliant' | 'Action Needed' | 'Overdue';

interface StaffRecord {
  id: string;
  name: string;
  title: string;
  department: string;
  role: string;
  email: string;
  attendanceReliability: number;
  gradingCompliance: number;
  status: StaffStatus;
  workload: string;
  observation: string;
  certification: string;
  initials: string;
  avatarBg: string;
}

const STAFF: StaffRecord[] = [
  {
    id: 'stf-helena-vance',
    name: 'Dr. Helena Vance',
    title: 'Senior Principal',
    department: 'School Leadership',
    role: 'Senior Principal',
    email: 'helena.vance@olympiaschools.edu',
    attendanceReliability: 100,
    gradingCompliance: 100,
    status: 'Compliant',
    workload: 'Executive oversight, multi-campus review, admissions sign-off',
    observation: 'Board review completed on 12/05/2026 with no exceptions.',
    certification: 'National School Leadership Certification',
    initials: 'HV',
    avatarBg: 'linear-gradient(135deg,#7c3aed,#5b1d8d)',
  },
  {
    id: 'stf-james-wilson',
    name: 'Mr. James Wilson',
    title: 'Homeroom Teacher - Grade 11A',
    department: 'Mathematics',
    role: 'Homeroom Teacher',
    email: 'james.wilson@olympiaschools.edu',
    attendanceReliability: 98,
    gradingCompliance: 92,
    status: 'Compliant',
    workload: 'Homeroom 11A, Mathematics HL, supervision duty',
    observation: 'Peer observation completed 12/10/2025, score 4.5/5.0.',
    certification: 'Apple Distinguished Educator',
    initials: 'JW',
    avatarBg: 'linear-gradient(135deg,#7b2db8,#5b1d8d)',
  },
  {
    id: 'stf-maria-chen',
    name: 'Ms. Maria Chen',
    title: 'Head of Science',
    department: 'Science',
    role: 'Department Head',
    email: 'maria.chen@olympiaschools.edu',
    attendanceReliability: 99,
    gradingCompliance: 88,
    status: 'Action Needed',
    workload: 'Science department lead, labs, curriculum mapping',
    observation: 'One pending moderation note in Canvas gradebook.',
    certification: 'IBDP Category 1 Science Trainer',
    initials: 'MC',
    avatarBg: 'linear-gradient(135deg,#0891b2,#0f766e)',
  },
  {
    id: 'stf-omar-hassan',
    name: 'Mr. Omar Hassan',
    title: 'Admissions Manager',
    department: 'Admissions & Finance',
    role: 'Operations Manager',
    email: 'omar.hassan@olympiaschools.edu',
    attendanceReliability: 100,
    gradingCompliance: 100,
    status: 'Compliant',
    workload: 'Admissions pipeline, fee reconciliation, placement follow-up',
    observation: 'Clean audit trail for this term.',
    certification: 'School Finance Operations Certification',
    initials: 'OH',
    avatarBg: 'linear-gradient(135deg,#6d28d9,#7c3aed)',
  },
  {
    id: 'stf-fatima-ali',
    name: 'Ms. Fatima Ali',
    title: 'Student Support Lead',
    department: 'Student Support',
    role: 'Counselor',
    email: 'fatima.ali@olympiaschools.edu',
    attendanceReliability: 96,
    gradingCompliance: 90,
    status: 'Compliant',
    workload: 'Wellbeing reviews, conduct monitoring, parent coordination',
    observation: 'Supports three at-risk cohorts this term.',
    certification: 'Child Safeguarding Level 3',
    initials: 'FA',
    avatarBg: 'linear-gradient(135deg,#be185d,#db2777)',
  },
  {
    id: 'stf-ethan-patel',
    name: 'Mr. Ethan Patel',
    title: 'Head of English',
    department: 'English',
    role: 'Department Head',
    email: 'ethan.patel@olympiaschools.edu',
    attendanceReliability: 97,
    gradingCompliance: 84,
    status: 'Action Needed',
    workload: 'English A HL, literature moderation, writing clinic',
    observation: 'Two overdue grade submissions in Term 1.',
    certification: 'IBDP English Literature Workshop',
    initials: 'EP',
    avatarBg: 'linear-gradient(135deg,#1d4ed8,#2563eb)',
  },
  {
    id: 'stf-anya-scott',
    name: 'Ms. Anya Scott',
    title: 'Head of Humanities',
    department: 'Humanities',
    role: 'Department Head',
    email: 'anya.scott@olympiaschools.edu',
    attendanceReliability: 98,
    gradingCompliance: 93,
    status: 'Compliant',
    workload: 'History HL, civics project, assessment alignment',
    observation: 'Strong cross-grade moderation record.',
    certification: 'Advanced Humanities Pedagogy',
    initials: 'AS',
    avatarBg: 'linear-gradient(135deg,#c2410c,#ea580c)',
  },
  {
    id: 'stf-noah-kim',
    name: 'Mr. Noah Kim',
    title: 'IT Coordinator',
    department: 'Operations',
    role: 'Technology Lead',
    email: 'noah.kim@olympiaschools.edu',
    attendanceReliability: 100,
    gradingCompliance: 100,
    status: 'Compliant',
    workload: 'SIS sync, Canvas integrations, device support',
    observation: 'No service interruptions this week.',
    certification: 'Google for Education Certified Trainer',
    initials: 'NK',
    avatarBg: 'linear-gradient(135deg,#0ea5e9,#0284c7)',
  },
];

function StatusPill({ status }: { status: StaffStatus }) {
  const variant = status === 'Compliant' ? 'success' : status === 'Action Needed' ? 'warning' : 'danger';
  return (
    <StatusBadge variant={variant} dot>
      {status}
    </StatusBadge>
  );
}

export default function StaffDirectoryScreen() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(STAFF[0].id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STAFF.filter((item) => {
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q)
      );
    });
  }, [query]);

  const selected = filtered.find((item) => item.id === selectedId) ?? filtered[0] ?? STAFF[0];

  return (
    <>
      <DashboardHeader
        title="Global Staff Directory"
        subtitle="Principal-level staffing overview, compliance, and operational profile for the current school year"
        breadcrumb="Global Staff Directory"
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[58%_42%]">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-foreground">Staff Roster</h2>
              <p className="mt-1 text-sm text-muted-foreground">Filter by name, department, or role.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-muted/30 px-3 py-1.5 text-sm font-semibold text-foreground">
              <Users size={15} className="text-primary" />
              {filtered.length} Staff
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 shadow-sm">
            <Search size={16} className="text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search staff by name, title, or department..."
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-border">
            <div className="grid grid-cols-[1.4fr_1.2fr_0.9fr_0.9fr_0.95fr] border-b border-border bg-muted/30 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <span>Staff Profile</span>
              <span>Department & Role</span>
              <span>SIS Attendance</span>
              <span>Canvas Grading</span>
              <span>Actions</span>
            </div>

            <div className="max-h-[680px] overflow-y-auto">
              {filtered.map((staff) => {
                const active = selected.id === staff.id;
                return (
                  <button
                    key={staff.id}
                    onClick={() => setSelectedId(staff.id)}
                    className={`grid w-full grid-cols-[1.4fr_1.2fr_0.9fr_0.9fr_0.95fr] items-center border-b border-border px-4 py-4 text-left transition-colors last:border-b-0 ${
                      active ? 'bg-muted/20' : 'hover:bg-muted/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
                        style={{ background: staff.avatarBg }}
                      >
                        {staff.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{staff.name}</p>
                        <p className="text-xs text-muted-foreground">{staff.title}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{staff.department}</p>
                      <p className="text-xs text-muted-foreground">{staff.role}</p>
                    </div>
                    <StatusBadge variant={staff.attendanceReliability >= 98 ? 'success' : staff.attendanceReliability >= 95 ? 'warning' : 'danger'} dot>
                      {staff.attendanceReliability}%
                    </StatusBadge>
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 flex-1 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${staff.gradingCompliance}%`,
                            backgroundColor: staff.gradingCompliance >= 95 ? 'var(--success)' : staff.gradingCompliance >= 88 ? 'var(--warning)' : 'var(--danger)',
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-foreground">{staff.gradingCompliance}%</span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-muted-foreground hover:bg-muted">
                        <Eye size={15} />
                      </span>
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-muted-foreground hover:bg-muted">
                        <Mail size={15} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Staff 360 Profile</h2>
              <p className="mt-1 text-sm text-muted-foreground">Operational snapshot for the selected staff member.</p>
            </div>
            <StatusPill status={selected.status} />
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-muted/20 p-5">
            <div className="flex items-start gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-bold text-white"
                style={{ background: selected.avatarBg }}
              >
                {selected.initials}
              </div>
              <div className="min-w-0">
                <h3 className="text-xl font-bold text-foreground">{selected.name}</h3>
                <p className="text-sm text-muted-foreground">{selected.title}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{selected.department}</span>
                  <span>·</span>
                  <span>{selected.email}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Current Teaching Workload</p>
                <p className="mt-2 text-sm font-medium text-foreground">{selected.workload}</p>
              </div>
              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Compliance Audit</p>
                <p className="mt-2 text-sm font-medium text-foreground">SIS Input {selected.attendanceReliability}%</p>
                <p className="text-sm font-medium text-foreground">Canvas Grading {selected.gradingCompliance}%</p>
              </div>
              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Formal Observations</p>
                <p className="mt-2 text-sm font-medium text-foreground">{selected.observation}</p>
              </div>
              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Certifications</p>
                <p className="mt-2 text-sm font-medium text-foreground">{selected.certification}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => toast.success(`Opened 360 profile for ${selected.name}`)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 btn-press"
              >
                <UserRound size={15} />
                View 360 Profile
              </button>
              <button
                onClick={() => toast.success(`Official memo queued for ${selected.name}`)}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted btn-press"
              >
                <ClipboardList size={15} />
                Send Official Memo
              </button>
              <button
                onClick={() => toast.success(`Compliance follow-up sent to ${selected.name}`)}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted btn-press"
              >
                <ShieldCheck size={15} />
                Compliance Reminder
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-dashed border-border bg-white p-4 text-sm text-muted-foreground">
            This directory is ready for whole-school staffing review. Filters and audit states can later connect to HR or SIS sources.
          </div>
        </div>
      </div>
    </>
  );
}
