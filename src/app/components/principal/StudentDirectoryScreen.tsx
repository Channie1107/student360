'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Eye,
  Mail,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  Phone,
  BookOpen,
  Clock3,
} from 'lucide-react';

import DashboardHeader from '@/app/components/DashboardHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import { useSchoolData } from '@/hooks/useSchoolData';
import type { DBStudent } from '@/lib/mockDatabase';

function statusVariant(status: DBStudent['status']) {
  if (status === 'Critical') return 'danger';
  if (status === 'At Risk') return 'warning';
  if (status === 'Monitor') return 'neutral';
  return 'success';
}

function StudentActionButton({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
    >
      {icon}
      {label}
    </Link>
  );
}

export default function StudentDirectoryScreen() {
  const { students, selectedGrade, selectedClass, academicYear } = useSchoolData();
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(students[0]?.id ?? '');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((student) => {
      if (!q) return true;
      return (
        student.name.toLowerCase().includes(q) ||
        student.studentId.toLowerCase().includes(q) ||
        student.classId.toLowerCase().includes(q) ||
        student.gradeId.toLowerCase().includes(q)
      );
    });
  }, [students, query]);

  const selected = filtered.find((student) => student.id === selectedId) ?? filtered[0] ?? students[0];

  return (
    <>
      <DashboardHeader
        title="Global Student Directory"
        subtitle={`Academic Year ${academicYear} � Grade ${selectedGrade === 'All' ? 'All' : selectedGrade} � Homeroom ${selectedClass === 'All' ? 'All' : selectedClass}`}
        breadcrumb="Global Student Directory"
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[58%_42%]">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-foreground">Student Roster</h2>
              <p className="mt-1 text-sm text-muted-foreground">Whole-school student overview with direct profile access.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-muted/30 px-3 py-1.5 text-sm font-semibold text-foreground">
              <Users size={15} className="text-primary" />
              {filtered.length} Students
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 shadow-sm">
            <Search size={16} className="text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by student ID, name, grade, or homeroom..."
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-border">
            <div className="grid grid-cols-[1.6fr_1fr_0.75fr_0.75fr_0.9fr_0.95fr] border-b border-border bg-muted/30 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <span>Student Profile</span>
              <span>Assigned Homeroom</span>
              <span>GPA</span>
              <span>Attendance</span>
              <span>Discipline</span>
              <span>Actions</span>
            </div>

            <div className="max-h-[680px] overflow-y-auto">
              {filtered.map((student) => {
                const active = selected?.id === student.id;
                return (
                  <button
                    key={student.id}
                    onClick={() => setSelectedId(student.id)}
                    className={`grid w-full grid-cols-[1.6fr_1fr_0.75fr_0.75fr_0.9fr_0.95fr] items-center border-b border-border px-4 py-4 text-left transition-colors last:border-b-0 ${
                      active ? 'bg-muted/20' : 'hover:bg-muted/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
                        style={{ background: student.avatarBg }}
                      >
                        {student.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.studentId}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Grade {student.gradeId}</p>
                      <p className="text-xs text-muted-foreground">Class {student.classId}</p>
                    </div>
                    <p className="text-sm font-bold text-foreground">{student.gpa.toFixed(2)}</p>
                    <p className="text-sm font-bold text-foreground">{student.attendance}%</p>
                    <StatusBadge variant={statusVariant(student.status)} dot>
                      {student.status}
                    </StatusBadge>
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
              <h2 className="text-lg font-bold text-foreground">Student 360 Profile</h2>
              <p className="mt-1 text-sm text-muted-foreground">Academic, attendance, and conduct snapshot for the selected student.</p>
            </div>
            {selected && <StatusBadge variant={statusVariant(selected.status)} dot>{selected.status}</StatusBadge>}
          </div>

          {selected ? (
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
                  <p className="text-sm text-muted-foreground">
                    {selected.studentId} · Grade {selected.gradeId} · Class {selected.classId}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>{selected.nationality}</span>
                    <span>·</span>
                    <span>DOB {selected.dob}</span>
                    <span>·</span>
                    <span>{selected.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Current GPA</p>
                  <p className="mt-2 text-2xl font-bold text-primary">{selected.gpa.toFixed(2)} / 4.00</p>
                </div>
                <div className="rounded-xl border border-border bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Attendance</p>
                  <p className="mt-2 text-2xl font-bold text-primary">{selected.attendance}%</p>
                </div>
                <div className="rounded-xl border border-border bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Homeroom Contact</p>
                  <p className="mt-2 text-sm font-medium text-foreground">Mr. James Wilson</p>
                  <p className="text-xs text-muted-foreground">Homeroom Teacher - Grade 11A</p>
                </div>
                <div className="rounded-xl border border-border bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Parent Contact</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{selected.parentName}</p>
                  <p className="text-xs text-muted-foreground">{selected.parentEmail}</p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-border bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Subject Snapshot</p>
                <div className="mt-3 grid gap-2">
                  {selected.subjects.slice(0, 4).map((subject) => (
                    <div key={subject.name} className="flex items-center justify-between rounded-lg bg-muted/20 px-3 py-2">
                      <span className="text-sm font-medium text-foreground">{subject.name}</span>
                      <span className="text-sm font-bold text-foreground">{subject.score}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-white p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <Clock3 size={13} />
                    Attendance History
                  </div>
                  <p className="mt-2 text-sm text-foreground">Term trend available from Sep to Dec.</p>
                </div>
                <div className="rounded-xl border border-border bg-white p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <BookOpen size={13} />
                    Behaviour & Awards
                  </div>
                  <p className="mt-2 text-sm text-foreground">
                    {selected.behaviorLogs.length} behaviour logs · {selected.achievements.length} awards
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <StudentActionButton
                  href={`/student-profile-class-list?studentId=${selected.studentId}`}
                  label="View Full Profile"
                  icon={<UserRound size={14} />}
                />
                <StudentActionButton
                  href={`mailto:${selected.parentEmail}`}
                  label="Contact Parent"
                  icon={<Mail size={14} />}
                />
                <StudentActionButton
                  href={`tel:${selected.parentPhone}`}
                  label="Call Parent"
                  icon={<Phone size={14} />}
                />
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
              No student selected in the current scope.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
