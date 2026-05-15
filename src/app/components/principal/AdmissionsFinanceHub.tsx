'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Banknote,
  BadgeAlert,
  CircleDollarSign,
  FileText,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { toast } from 'sonner';

import DashboardHeader from '@/app/components/DashboardHeader';
import PrincipalScopeBar from './PrincipalScopeBar';
import StatusBadge from '@/components/ui/StatusBadge';
import { useSchoolData } from '@/hooks/useSchoolData';
import type { DBStudent } from '@/lib/mockDatabase';

const TUITION_BY_GRADE: Record<string, number> = {
  '1': 6500,
  '2': 6500,
  '3': 7000,
  '4': 7000,
  '5': 7500,
  '6': 8000,
  '7': 8500,
  '8': 9000,
  '9': 10000,
  '10': 11000,
  '11': 12000,
  '12': 12500,
};

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getPaymentProfile(student: DBStudent) {
  if (student.status === 'On Track') return { collectedRate: 1, pendingRate: 0, overdueRate: 0 };
  if (student.status === 'Monitor') return { collectedRate: 0.9, pendingRate: 0.1, overdueRate: 0 };
  if (student.status === 'At Risk') return { collectedRate: 0.72, pendingRate: 0.18, overdueRate: 0.1 };
  return { collectedRate: 0.58, pendingRate: 0.22, overdueRate: 0.2 };
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

function TuitionTooltip({
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
            {entry.name}: <strong className="text-foreground">{entry.value.toFixed(0)}</strong>
          </span>
        </div>
      ))}
    </div>
  );
}

function GradeDistributionLegend({ payload }: { payload?: { value?: string; color?: string }[] }) {
  if (!payload?.length) return null;

  return (
    <div className="mt-2 flex items-center justify-center gap-4">
      {payload.map((entry) => (
        <div key={String(entry.value)} className="flex items-center gap-2 text-sm font-medium text-foreground">
          <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: entry.color }} />
          <span className="text-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdmissionsFinanceHub() {
  const { students, selectedGrade, selectedClass, academicYear } = useSchoolData();

  const analytics = useMemo(() => {
    const enriched = students.map((student) => {
      const tuitionFee = TUITION_BY_GRADE[student.gradeId] ?? 9000;
      const paymentProfile = getPaymentProfile(student);
      return {
        student,
        tuitionFee,
        collected: tuitionFee * paymentProfile.collectedRate,
        pending: tuitionFee * paymentProfile.pendingRate,
        overdue: tuitionFee * paymentProfile.overdueRate,
      };
    });

    const totalRevenueCollected = enriched.reduce((sum, row) => sum + row.collected, 0);
    const overdueReceivables = enriched.reduce((sum, row) => sum + row.overdue, 0);
    const pendingInstallments = enriched.reduce((sum, row) => sum + row.pending, 0);
    const enrolledNextYear = Math.round(students.length * 1.05);

    const applications = [
      { label: 'Leads', value: Math.max(students.length * 4, 800) },
      { label: 'Tested', value: Math.max(students.length * 3, 600) },
      { label: 'Offered', value: Math.max(students.length * 2, 500) },
      { label: 'Enrolled', value: students.length },
    ];

    const gradeCollection = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((gradeId) => {
      const gradeRows = enriched.filter((row) => row.student.gradeId === gradeId);
      const gradeTotal = gradeRows.reduce((sum, row) => sum + row.tuitionFee, 0);
      const gradeCollected = gradeRows.reduce((sum, row) => sum + row.collected, 0);
      const gradeOverdue = gradeRows.reduce((sum, row) => sum + row.overdue, 0);
      return {
        grade: `Grade ${gradeId}`,
        collectedPct: gradeTotal > 0 ? (gradeCollected / gradeTotal) * 100 : 0,
        overduePct: gradeTotal > 0 ? (gradeOverdue / gradeTotal) * 100 : 0,
        collectedAmount: gradeCollected,
        overdueAmount: gradeOverdue,
      };
    });

    const overdueRows = [...enriched]
      .filter((row) => row.overdue > 0)
      .sort((a, b) => b.overdue - a.overdue)
      .slice(0, 5);

    return {
      totalRevenueCollected,
      overdueReceivables,
      pendingInstallments,
      enrolledNextYear,
      applications,
      gradeCollection,
      overdueRows,
      collectionPct: average(enriched.map((row) => row.collected / row.tuitionFee)) * 100,
    };
  }, [students]);

  return (
    <>
      <DashboardHeader
        title="Admissions & Finance Hub"
        subtitle={`Academic Year ${academicYear} · Campus: Main Campus · Scope: ${selectedGrade === 'All' ? 'All Grades' : `Grade ${selectedGrade}`}${selectedClass !== 'All' ? ` · Class ${selectedClass}` : ''}`}
        breadcrumb="Admissions & Finance"
        actions={
          <button
            onClick={() => toast.success('Finance brief queued for export')}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 btn-press"
          >
            <FileText size={15} />
            Export Finance Brief
          </button>
        }
      />

      <PrincipalScopeBar />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <KpiCard
          title="Total Revenue Collected"
          value={`$${(analytics.totalRevenueCollected / 1000000).toFixed(2)}M`}
          badge={`${analytics.collectionPct.toFixed(1)}% collected`}
          badgeClass="bg-success-bg text-success"
          icon={<CircleDollarSign size={18} />}
        />
        <KpiCard
          title="Overdue Tuition Receivables"
          value={`$${(analytics.overdueReceivables / 1000).toFixed(0)}K`}
          badge={`${analytics.pendingInstallments > 0 ? 'Follow up required' : 'All settled'}`}
          badgeClass="bg-danger-bg text-danger"
          icon={<BadgeAlert size={18} />}
        />
        <KpiCard
          title="New Applications (Next AY)"
          value={analytics.enrolledNextYear.toLocaleString()}
          badge="+12% YoY"
          badgeClass="bg-warning-bg text-warning"
          icon={<Banknote size={18} />}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[52%_48%]">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Admissions Funnel</h2>
              <p className="mt-1 text-sm text-muted-foreground">Lead conversion from inquiry to enrolled seat.</p>
            </div>
            <StatusBadge variant="warning" dot>
              Whole School
            </StatusBadge>
          </div>
          <div className="space-y-4">
            {analytics.applications.map((stage, index) => {
              const max = analytics.applications[0].value;
              const width = Math.max(18, (stage.value / max) * 100);
              const previous = analytics.applications[index - 1]?.value ?? stage.value;
              const conversion = index === 0 ? 100 : (stage.value / previous) * 100;
              return (
                <div key={stage.label} className="rounded-xl border border-border bg-muted/20 p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{stage.label}</p>
                      <p className="text-xs text-muted-foreground">{conversion.toFixed(1)}% from previous stage</p>
                    </div>
                    <p className="text-sm font-bold text-primary">{stage.value.toLocaleString()}</p>
                  </div>
                  <div className="mt-3 h-3 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${width}%`,
                        background: index === analytics.applications.length - 1 ? 'var(--success)' : index === 1 ? 'var(--accent)' : 'var(--primary)',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Grade-Level Collection Status</h2>
              <p className="mt-1 text-sm text-muted-foreground">Tuition collection by grade with overdue exposure.</p>
            </div>
            <StatusBadge variant="warning" dot>
              Financial review
            </StatusBadge>
          </div>
          <div className="grid max-h-[540px] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
            {analytics.gradeCollection.map((item) => (
              <div key={item.grade} className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.grade}</p>
                    <p className="text-xs text-muted-foreground">Overdue exposure: ${item.overdueAmount.toFixed(0)}</p>
                  </div>
                  <span className={`text-sm font-bold ${item.collectedPct >= 95 ? 'text-success' : item.collectedPct >= 88 ? 'text-warning' : 'text-danger'}`}>
                    {item.collectedPct.toFixed(0)}% Collected
                  </span>
                </div>
                <div className="mt-3 h-2.5 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.min(item.collectedPct, 100)}%`, backgroundColor: item.collectedPct >= 95 ? 'var(--success)' : item.collectedPct >= 88 ? 'var(--warning)' : 'var(--danger)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[60%_40%]">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Grade Collection Distribution</h2>
              <p className="mt-1 text-sm text-muted-foreground">Collected vs overdue tuition by grade level.</p>
            </div>
            <StatusBadge variant="warning" dot>
              Live
            </StatusBadge>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.gradeCollection} margin={{ top: 8, right: 8, bottom: 24, left: -10 }} barCategoryGap="24%">
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="grade"
                  interval={0}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  tickMargin={8}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<TuitionTooltip />} />
                <Legend content={({ payload }) => <GradeDistributionLegend payload={payload as { value?: string; color?: string }[] | undefined} />} />
                <Bar dataKey="collectedAmount" name="Collected" fill="var(--success)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="overdueAmount" name="Overdue" fill="var(--danger)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Top Overdue Accounts</h2>
              <p className="mt-1 text-sm text-muted-foreground">Highest outstanding tuition balances in the current scope.</p>
            </div>
            <StatusBadge variant="danger" dot>
              {analytics.overdueRows.length} Watch
            </StatusBadge>
          </div>
          <div className="space-y-3">
            {analytics.overdueRows.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
                No overdue accounts in the selected scope.
              </p>
            ) : (
              analytics.overdueRows.map((row) => (
                <div key={row.student.id} className="rounded-xl border border-border bg-muted/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{row.student.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {row.student.studentId} Â· Grade {row.student.gradeId} Â· Class {row.student.classId}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-danger">${row.overdue.toFixed(0)}</p>
                      <p className="text-xs text-muted-foreground">overdue</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <StatusBadge variant={row.student.status === 'Critical' ? 'danger' : row.student.status === 'At Risk' ? 'warning' : 'neutral'} dot>
                      {row.student.status}
                    </StatusBadge>
                    <Link
                      href={`/student-profile?studentId=${row.student.studentId}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                    >
                      <ArrowRight size={14} />
                      Open Profile
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
