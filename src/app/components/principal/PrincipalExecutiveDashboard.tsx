'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  GraduationCap,
  ShieldAlert,
  UserRoundSearch,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import DashboardHeader from '@/app/components/DashboardHeader';
import PrincipalScopeBar from './PrincipalScopeBar';
import StatusBadge from '@/components/ui/StatusBadge';
import { useSchoolData } from '@/hooks/useSchoolData';

const PIE_COLORS = ['var(--primary)', 'var(--accent)', 'var(--danger)'];

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function KpiCard({
  title,
  value,
  badge,
  badgeClass,
  icon,
}: {
  title: string;
  value: string;
  badge: string;
  badgeClass: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold leading-none text-foreground">{value}</p>
          <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass}`}>{badge}</span>
        </div>
        <div className="rounded-xl border border-border bg-muted/30 p-2.5 text-primary">{icon}</div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function AttendanceTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { name: string; value: number; count: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const current = payload[0].payload;
  return (
    <div className="chart-tooltip-card">
      <p className="font-semibold text-foreground">{current.name}</p>
      <p className="text-muted-foreground">
        {current.value}% - {current.count} students
      </p>
    </div>
  );
}

function GpaTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip-card">
      <p className="mb-1 font-semibold text-foreground">{label}</p>
      {payload.map((entry, index) => (
        <div key={`${label}-${index}`} className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-muted-foreground">
            {entry.name}: <strong className="text-foreground">{entry.value.toFixed(2)}</strong>
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PrincipalExecutiveDashboard() {
  const { students, selectedGrade, selectedClass, academicYear } = useSchoolData();

  const analytics = useMemo(() => {
    const totalStudents = students.length;
    const avgGpa = average(students.map((student) => student.gpa));
    const avgAttendance = average(students.map((student) => student.attendance));
    const criticalGaps = students.filter((student) => student.behaviorLogs.length === 0 || student.achievements.length === 0).length;
    const activeClasses = new Set(students.map((student) => student.classId)).size;

    const attendanceMix = [
      {
        name: 'On Track',
        value: Math.round((students.filter((student) => student.attendance >= 95).length / Math.max(totalStudents, 1)) * 100),
        count: students.filter((student) => student.attendance >= 95).length,
      },
      {
        name: 'Watch List',
        value: Math.round((students.filter((student) => student.attendance >= 88 && student.attendance < 95).length / Math.max(totalStudents, 1)) * 100),
        count: students.filter((student) => student.attendance >= 88 && student.attendance < 95).length,
      },
      {
        name: 'Priority Risk',
        value: Math.round((students.filter((student) => student.attendance < 88).length / Math.max(totalStudents, 1)) * 100),
        count: students.filter((student) => student.attendance < 88).length,
      },
    ];

    const gradeTrend = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((gradeId) => {
      const gradeStudents = students.filter((student) => student.gradeId === gradeId);
      return {
        grade: `G${gradeId}`,
        current: average(gradeStudents.map((student) => student.gpaHistory[1]?.gpa ?? student.gpa)),
        previous: average(gradeStudents.map((student) => student.gpaHistory[0]?.gpa ?? student.gpa)),
      };
    });

    const priorityWatchlist = [...students]
      .filter((student) => student.status === 'At Risk' || student.status === 'Critical' || student.attendance < 88)
      .sort((a, b) => a.gpa - b.gpa || a.attendance - b.attendance)
      .slice(0, 5);

    const operationalSignals = [
      {
        title: 'Behaviour logs needing follow-up',
        value: students.filter((student) => student.behaviorLogs.length === 0).length,
        tone: 'warning' as const,
      },
      {
        title: 'Students without achievements recorded',
        value: students.filter((student) => student.achievements.length === 0).length,
        tone: 'neutral' as const,
      },
      {
        title: 'Classes below 3.0 GPA',
        value: new Set(
          students
            .filter((student) => student.gpa < 3.0)
            .map((student) => student.classId)
        ).size,
        tone: 'danger' as const,
      },
    ];

    return {
      totalStudents,
      avgGpa,
      avgAttendance,
      criticalGaps,
      activeClasses,
      attendanceMix,
      gradeTrend,
      priorityWatchlist,
      operationalSignals,
    };
  }, [students]);

  const attendanceLabel = useMemo(() => {
    const onTrack = analytics.attendanceMix[0].count;
    const watch = analytics.attendanceMix[1].count;
    const risk = analytics.attendanceMix[2].count;
    return `${onTrack} on track | ${watch} watch list | ${risk} priority risk`;
  }, [analytics.attendanceMix]);

  return (
    <>
      <DashboardHeader
        title="Executive Dashboard - Whole School Overview"
        subtitle={`Academic Year ${academicYear} · Campus: Main Campus · Scope: ${selectedGrade === 'All' ? 'All Grades' : `Grade ${selectedGrade}`}${selectedClass !== 'All' ? ` · Class ${selectedClass}` : ''}`}
        breadcrumb="Executive Dashboard"
      />

      <PrincipalScopeBar />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <KpiCard
          title="Total Active Enrollment"
          value={analytics.totalStudents.toLocaleString()}
          badge={`${analytics.activeClasses} active classes`}
          badgeClass="bg-success-bg text-success"
          icon={<Users size={18} />}
        />
        <KpiCard
          title="Campus-wide Attendance"
          value={formatPercent(analytics.avgAttendance)}
          badge={attendanceLabel}
          badgeClass="bg-muted text-muted-foreground"
          icon={<ShieldAlert size={18} />}
        />
        <KpiCard
          title="Average School GPA"
          value={`${analytics.avgGpa.toFixed(2)} / 4.0`}
          badge="Target: 3.50"
          badgeClass="bg-warning-bg text-warning"
          icon={<GraduationCap size={18} />}
        />
        <KpiCard
          title="Critical Data Gaps"
          value={`${analytics.criticalGaps} Logs`}
          badge="Action Required"
          badgeClass="bg-danger-bg text-danger"
          icon={<AlertTriangle size={18} />}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[40%_60%]">
        <SectionCard
          title="Daily Campus Presence"
          subtitle="Distribution of students on track, watch list, and priority risk."
        >
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={analytics.attendanceMix}
                  cx="50%"
                  cy="50%"
                  innerRadius={82}
                  outerRadius={112}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                >
                  {analytics.attendanceMix.map((entry, index) => (
                    <Cell key={`principal-attendance-${index}`} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip content={<AttendanceTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-[-28px] text-center">
              <p className="text-3xl font-bold text-primary">{analytics.totalStudents.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">students in current scope</p>
            </div>
            <div className="mt-5 grid w-full gap-3 sm:grid-cols-3">
              {analytics.attendanceMix.map((item, index) => (
                <div key={item.name} className="rounded-xl border border-border bg-muted/20 p-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: PIE_COLORS[index] }} />
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                  </div>
                  <p className="mt-1 text-xl font-bold text-foreground">{item.count}</p>
                  <p className="text-xs text-muted-foreground">{item.value}% of scope</p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="GPA Distribution by Grade"
          subtitle="Current vs previous term averages across the full school."
          action={
            <StatusBadge variant="neutral" dot>
              Benchmark 3.50
            </StatusBadge>
          }
        >
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.gradeTrend} margin={{ top: 8, right: 8, bottom: 0, left: -10 }} barCategoryGap="24%">
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="grade"
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 4.5]}
                  ticks={[0, 1, 2, 3, 4]}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<GpaTooltip />} />
                <ReferenceLine
                  y={3.5}
                  stroke="var(--muted-foreground)"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: 'Target 3.50',
                    position: 'right',
                    fontSize: 10,
                    fill: 'var(--muted-foreground)',
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 18 }}
                  content={({ payload }) => (
                    <div className="mt-2 flex items-center justify-center gap-4">
                      {payload?.map((entry) => (
                        <div key={String(entry.value)} className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: entry.color }} />
                          <span className="text-foreground">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                />
                <Bar dataKey="current" name="Term 1" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="previous" name="Term 2" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[60%_40%]">
        <SectionCard
          title="Priority Watchlist"
          subtitle="Students and classes that require immediate follow-up."
        >
          <div className="space-y-3">
            {analytics.priorityWatchlist.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
                No priority students in the current scope.
              </p>
            ) : (
              analytics.priorityWatchlist.map((student) => (
                <div
                  key={student.id}
                  className="grid gap-3 rounded-xl border border-border bg-muted/10 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
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
                      <p className="text-xs text-muted-foreground">
                        {student.studentId} Â· Grade {student.gradeId} Â· Class {student.classId}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    <StatusBadge variant={student.status === 'Critical' ? 'danger' : student.status === 'At Risk' ? 'warning' : 'neutral'} dot>
                      {student.status}
                    </StatusBadge>
                    <span className="rounded-full bg-success-bg px-2.5 py-1 text-xs font-semibold text-success">
                      GPA {student.gpa.toFixed(2)}
                    </span>
                    <span className="rounded-full bg-info-bg px-2.5 py-1 text-xs font-semibold text-info">
                      ATT {student.attendance}%
                    </span>
                    <Link
                      href={`/student-profile?studentId=${student.studentId}`}
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                    >
                      <UserRoundSearch size={14} />
                      View Profile
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Operational Signals"
          subtitle="High-level blockers that need a principal review."
          action={
            <StatusBadge variant="neutral" dot>
              Live
            </StatusBadge>
          }
        >
          <div className="space-y-3">
            {analytics.operationalSignals.map((signal) => (
              <div key={signal.title} className="rounded-xl border border-border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{signal.title}</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{signal.value}</p>
                  </div>
                  <StatusBadge
                    variant={signal.tone === 'danger' ? 'danger' : signal.tone === 'warning' ? 'warning' : 'neutral'}
                    dot
                  >
                    Review
                  </StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
