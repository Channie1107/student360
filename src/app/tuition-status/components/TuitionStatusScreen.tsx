'use client';

import React, { useMemo, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardHeader from '@/app/components/DashboardHeader';
import { useSchoolData } from '@/hooks/useSchoolData';
import { ReceiptText, Mail, CircleAlert, CircleCheckBig, Clock3, TriangleAlert, X, User, Phone, Mail as MailIcon } from 'lucide-react';
import { toast } from 'sonner';

type LedgerState = 'Paid' | 'Pending Installment' | 'Overdue';
type ProgramState = 'Paid' | 'N/A';

type TuitionRecord = {
  studentId: string;
  name: string;
  avatarBg: string;
  initials: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  standardFee: number;
  standardStatus: 'Paid' | 'Overdue';
  ibStatus: ProgramState;
  auxiliaryStatus: LedgerState;
  balance: number;
  isOverdue: boolean;
  isPending: boolean;
};

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatMoney(value: number) {
  return moneyFormatter.format(value);
}

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: 'success' | 'warning' | 'danger' | 'muted';
}) {
  const toneClass = {
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    muted: 'bg-slate-100 text-slate-500 border-slate-200',
  }[tone];

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none ${toneClass}`}>
      {label}
    </span>
  );
}

function MetricCard({
  title,
  value,
  badge,
  badgeTone = 'muted',
}: {
  title: string;
  value: string;
  badge?: string;
  badgeTone?: 'success' | 'warning' | 'danger' | 'muted';
}) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{title}</p>
        </div>
        {badge && <StatusPill label={badge} tone={badgeTone} />}
      </div>
      <div className="mt-5 flex items-end justify-between gap-3">
        <p className="text-3xl font-bold text-slate-900 font-tabular">{value}</p>
      </div>
    </article>
  );
}

function ActionButton({
  icon,
  onClick,
  title,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all hover:border-primary/30 hover:text-primary hover:bg-primary/5 btn-press"
    >
      {icon}
    </button>
  );
}

export default function TuitionStatusScreen() {
  const { role, teacherContext, students } = useSchoolData();
  const [selectedParent, setSelectedParent] = useState<TuitionRecord | null>(null);

  const classRoster = useMemo(
    () =>
      [...students]
        .filter((student) => student.classId === '11A' && student.academicYear === '25-26')
        .sort((a, b) => a.studentId.localeCompare(b.studentId)),
    [students]
  );

  const tuitionLedger = useMemo<TuitionRecord[]>(() => {
    const standardFee = 12500;
    const ibDifferential = 2500;
    const auxiliaryFee = 600;

    return classRoster.map((student, index) => {
      const isOverdue = index === classRoster.length - 1;
      const isPending = index >= classRoster.length - 3 && index < classRoster.length - 1;
      const ibApplies = index % 4 === 1 || index % 5 === 0;

      const standardStatus = isOverdue ? 'Overdue' : 'Paid';
      const ibStatus: ProgramState = ibApplies ? 'Paid' : 'N/A';
      const auxiliaryStatus: LedgerState = isOverdue ? 'Overdue' : isPending ? 'Pending Installment' : 'Paid';

      const balance = isOverdue
        ? standardFee + ibDifferential + auxiliaryFee
        : isPending
          ? auxiliaryFee
          : 0;

      return {
        studentId: student.studentId,
        name: student.name,
        avatarBg: student.avatarBg,
        initials: student.initials,
        parentName: student.parentName,
        parentPhone: student.parentPhone,
        parentEmail: student.parentEmail,
        standardFee,
        standardStatus,
        ibStatus,
        auxiliaryStatus,
        balance,
        isOverdue,
        isPending,
      };
    });
  }, [classRoster]);

  const stats = useMemo(() => {
    const fullyPaid = tuitionLedger.filter((row) => row.balance === 0).length;
    const pending = tuitionLedger.filter((row) => row.isPending).length;
    const overdue = tuitionLedger.filter((row) => row.isOverdue).length;
    const collected = fullyPaid;
    const completion = classRoster.length > 0 ? Math.round((collected / classRoster.length) * 100) : 0;

    return {
      total: tuitionLedger.length,
      fullyPaid,
      pending,
      overdue,
      completion,
    };
  }, [classRoster.length, tuitionLedger]);

  const pageTitle = 'Tuition & Student Fee Tracking (11A)';
  const subtitle =
    role === 'teacher'
      ? `Class ${teacherContext?.classId} · Academic Year ${teacherContext?.academicYear}`
      : 'Locked to Class 11A tuition data and billing workflow review';

  return (
    <AppLayout>
      <div className="mx-auto max-w-screen-2xl px-6 py-5 lg:px-8 xl:px-10">
        <DashboardHeader
          title={pageTitle}
          subtitle={subtitle}
          breadcrumb="Tuition Status"
          actions={
            <button
              onClick={() => toast.success('Billing report export queued')}
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-sm btn-press"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <ReceiptText size={16} />
              Export Billing Report
            </button>
          }
        />

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total Class Roster"
            value={`${stats.total} Students`}
          />
          <MetricCard
            title="Fully Paid Accounts"
            value={`${stats.fullyPaid} Students`}
            badge={`${stats.completion}% Completed`}
            badgeTone="success"
          />
          <MetricCard
            title="Pending Installments"
            value={`${stats.pending} Students`}
            badge="Due Next Cycle"
            badgeTone="warning"
          />
          <MetricCard
            title="Overdue Accounts"
            value={`${stats.overdue} Student`}
            badge="Action Required"
            badgeTone="danger"
          />
        </section>

        <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-5">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-foreground">Billing Snapshot</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                {stats.completion}% collected
              </span>
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Collected</span>
                  <span className="text-green-700">{stats.fullyPaid} students</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-green-500" style={{ width: `${stats.completion}%` }} />
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Pending</span>
                  <span className="text-yellow-700">{stats.pending} students</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-yellow-400"
                    style={{ width: `${stats.total ? Math.round((stats.pending / stats.total) * 100) : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Overdue</span>
                  <span className="text-red-700">{stats.overdue} student</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-red-500"
                    style={{ width: `${stats.total ? Math.round((stats.overdue / stats.total) * 100) : 0}%` }}
                  />
                </div>
              </div>
            </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-green-100 bg-green-50 px-3 py-2 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Paid</p>
                <p className="mt-1 font-bold text-green-800">{stats.fullyPaid} records</p>
              </div>
              <div className="rounded-xl border border-yellow-100 bg-yellow-50 px-3 py-2 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">Pending</p>
                <p className="mt-1 font-bold text-yellow-800">{stats.pending} records</p>
              </div>
              <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-red-700">Overdue</p>
                <p className="mt-1 font-bold text-red-800">{stats.overdue} record</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-foreground">Operational Guidance</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1.5 text-xs font-semibold text-slate-600">
                <CircleAlert size={14} className="text-red-500" />
                1 overdue row
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-border bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <CircleCheckBig size={18} className="text-green-600" />
                  <div>
                    <p className="font-semibold text-slate-900">Paid accounts</p>
                    <p className="text-sm text-slate-500">Invoice record is closed and no reminder is needed.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Clock3 size={18} className="text-yellow-600" />
                  <div>
                    <p className="font-semibold text-slate-900">Pending installment accounts</p>
                    <p className="text-sm text-slate-500">Schedule the next reminder before the cycle closes.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <TriangleAlert size={18} className="text-red-600" />
                  <div>
                    <p className="font-semibold text-slate-900">Overdue accounts</p>
                    <p className="text-sm text-slate-500">Prioritize invoice retrieval and immediate parent follow-up.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: 'var(--primary)' }}>
                Granular Class 11A Fee Ingestion Ledger
              </p>
              <h2 className="mt-1 text-xl font-bold text-foreground">Billing workflow audit records</h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <CircleAlert size={14} className="text-red-500" />
              Each row stays anchored to the assigned 11A roster.
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border">
            <div className="max-h-[760px] overflow-auto scrollbar-thin">
              <table className="min-w-[1100px] w-full text-left">
                <thead className="sticky top-0 z-10 bg-slate-50">
                  <tr className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                    <th className="px-4 py-3 font-semibold">Student Profile</th>
                    <th className="px-4 py-3 font-semibold">Standard Tuition Fee</th>
                    <th className="px-4 py-3 font-semibold">IB Program Differential</th>
                    <th className="px-4 py-3 font-semibold">Auxiliary Services (Bus/Meals)</th>
                    <th className="px-4 py-3 font-semibold">Total Outstanding Balance</th>
                    <th className="px-4 py-3 font-semibold">Targeted Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tuitionLedger.map((row, index) => (
                    <tr key={row.studentId} className={`align-top ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
                            style={{ backgroundColor: row.avatarBg }}
                          >
                            {row.initials}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{row.name}</p>
                            <p className="text-sm text-slate-500">{row.studentId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <p className="font-semibold text-slate-900">{formatMoney(row.standardFee)}</p>
                          <StatusPill label={row.standardStatus} tone={row.standardStatus === 'Paid' ? 'success' : 'danger'} />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {row.ibStatus === 'Paid' ? (
                          <StatusPill label="Paid" tone="success" />
                        ) : (
                          <span className="text-sm font-medium text-slate-500">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <StatusPill
                          label={row.auxiliaryStatus}
                          tone={
                            row.auxiliaryStatus === 'Paid'
                              ? 'success'
                              : row.auxiliaryStatus === 'Pending Installment'
                                ? 'warning'
                                : 'danger'
                          }
                        />
                      </td>
                      <td className="px-4 py-4">
                        <p className={`text-lg font-bold font-tabular ${row.balance === 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatMoney(row.balance)}
                        </p>
                        <p className="text-xs text-slate-500">Current balance snapshot</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <ActionButton
                            icon={<ReceiptText size={14} />}
                            onClick={() => toast.info(`Opening invoice record for ${row.name}`)}
                            title="Invoice record"
                          />
                          <ActionButton
                            icon={<Mail size={14} />}
                            onClick={() => setSelectedParent(row)}
                            title="Contact parent"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {selectedParent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm fade-in p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedParent(null)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-1">Contact Parent</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Parent/Guardian information for <span className="font-semibold text-foreground">{selectedParent.name}</span>
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/30">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Parent Name</p>
                      <p className="font-medium text-foreground">{selectedParent.parentName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/30">
                    <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                      <Phone size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone Number</p>
                      <p className="font-medium text-foreground">{selectedParent.parentPhone}</p>
                    </div>
                    <button className="px-3 py-1.5 text-xs font-semibold bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
                      Call
                    </button>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/30">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <MailIcon size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email Address</p>
                      <p className="font-medium text-foreground truncate max-w-[180px]">{selectedParent.parentEmail}</p>
                    </div>
                    <button className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
