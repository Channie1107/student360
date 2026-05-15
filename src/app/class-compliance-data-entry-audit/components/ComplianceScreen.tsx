'use client';

import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import DashboardHeader from '@/app/components/DashboardHeader';
import Icon from '@/components/ui/AppIcon';
import { useSchoolData } from '@/hooks/useSchoolData';
import {
  buildComplianceData,
  ComplianceState,
  ComplianceSummary,
  STATE_COLORS,
  summarizeCompliance,
  type StudentCompliance,
} from './complianceMatrixData';
import ComplianceMatrixTable from './ComplianceMatrixTable';
import ComplianceCanvasMatrix from './ComplianceCanvasMatrix';
import ComplianceAwardsLedger from './ComplianceAwardsLedger';
import ComplianceBehaviourLedger from './ComplianceBehaviourLedger';

type TabKey = 'summary' | 'sis' | 'canvas' | 'awards' | 'behaviour';

function SummaryCard({
  title,
  subtitle,
  value,
  state,
}: {
  title: string;
  subtitle: string;
  value: string;
  state: ComplianceState;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">{title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
          style={{
            color: STATE_COLORS[state],
            backgroundColor: `${STATE_COLORS[state]}15`,
            borderColor: `${STATE_COLORS[state]}33`,
          }}
        >
          {state}
        </span>
      </div>
      <div className="text-4xl font-black font-tabular tracking-tight" style={{ color: STATE_COLORS[state] }}>
        {value}
      </div>
    </div>
  );
}

export default function ComplianceScreen() {
  const { students } = useSchoolData();
  const [activeTab, setActiveTab] = useState<TabKey>('summary');
  const [sisSearch, setSisSearch] = useState('');
  const [canvasSearch, setCanvasSearch] = useState('');

  const classStudents = useMemo(
    () => students.filter((student) => student.classId === '11A' && student.academicYear === '25-26'),
    [students]
  );

  const rows: StudentCompliance[] = useMemo(() => buildComplianceData(classStudents), [classStudents]);
  const summary: ComplianceSummary = useMemo(() => summarizeCompliance(rows), [rows]);

  const actions = (
    <button
      type="button"
      onClick={() => toast.success('Official PDF export queued')}
      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90"
    >
      <Icon name="ArrowDownTrayIcon" size={16} variant="outline" />
      Export Official PDF
    </button>
  );

  const compliantCount = summary.compliantCount;
  const inProgressCount = summary.inProgressCount;
  const mismatchCount = summary.mismatchCount;

  return (
    <div className="mx-auto max-w-screen-2xl space-y-5">
      <DashboardHeader
        title="Data Input Compliance & Self-Audit (11A)"
        subtitle="Class 11A - Academic Year 25-26"
        breadcrumb="Compliance Data Entry"
        actions={actions}
      />

      <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-wrap gap-2 border-b border-border">
          {[
            { key: 'summary' as const, label: 'Synchronization Summary' },
            { key: 'sis' as const, label: 'Detailed SIS Matrix' },
            { key: 'canvas' as const, label: 'Detailed Canvas Matrix' },
            { key: 'awards' as const, label: 'Awards & Achievements' },
            { key: 'behaviour' as const, label: 'Behaviour Logs' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`-mb-px border-b-2 px-1 py-2 text-sm font-bold transition-all ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'summary' && (
        <div className="space-y-5">
        <div className="grid gap-5 md:grid-cols-3">
            <SummaryCard
              title="SIS & Face ID Synced"
              subtitle="Unified hardware gate and classroom registries."
              value={summary.total > 0 ? `${Math.round((summary.compliantCount / summary.total) * 100)}%` : '0%'}
              state="COMPLIANT"
            />
            <SummaryCard
              title="Canvas Gradebook Inputs"
              subtitle="Aggregate grading completeness across 5 core subjects."
              value={`${summary.canvasAverage}%`}
              state="COMPLIANT"
            />
            <SummaryCard
              title="Reconciliation Compliance"
              subtitle="Fully validated multi-source student accounts."
              value={`${summary.compliantCount} / ${summary.total} Records`}
              state="COMPLIANT"
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">Core Operational Health Bar</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {summary.compliantCount} Compliant | {summary.inProgressCount} In Progress | {summary.mismatchCount} Missing data
                  </p>
                </div>
                <button
                  type="button"
                  className="text-xs font-bold text-primary hover:underline"
                  onClick={() => setActiveTab('sis')}
                >
                  Review Detailed SIS Matrix
                </button>
              </div>

              <div className="overflow-hidden rounded-full bg-muted/30">
                <div className="h-3 w-full bg-success" />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-xs font-bold">
                <div className="rounded-xl border border-success/20 bg-success/5 px-3 py-2 text-success">23 Compliant</div>
                <div className="rounded-xl border border-warning/20 bg-warning/5 px-3 py-2 text-warning">0 In Progress</div>
                <div className="rounded-xl border border-danger/20 bg-danger/5 px-3 py-2 text-danger">0 Missing data</div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">Automated System Sync Gateway</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Webhook health and live reconciliation status.</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-success/20 bg-success/5 px-4 py-3 text-sm font-bold text-foreground shadow-sm">
                  <span className="flex items-center gap-2">
                    <Icon name="CheckCircleIcon" size={16} variant="outline" className="text-success" />
                    FTS Face ID API Polling Engine
                  </span>
                  <span className="text-xs font-bold text-success">Active Sync</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-success/20 bg-success/5 px-4 py-3 text-sm font-bold text-foreground shadow-sm">
                  <span className="flex items-center gap-2">
                    <Icon name="CheckCircleIcon" size={16} variant="outline" className="text-success" />
                    Canvas REST API Live Sync
                  </span>
                  <span className="text-xs font-bold text-success">Synced 2m ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sis' && <ComplianceMatrixTable rows={rows} summary={summary} searchQuery={sisSearch} onSearchQueryChange={setSisSearch} />}

      {activeTab === 'canvas' && <ComplianceCanvasMatrix rows={rows} searchQuery={canvasSearch} onSearchQueryChange={setCanvasSearch} />}

      {activeTab === 'awards' && <ComplianceAwardsLedger />}

      {activeTab === 'behaviour' && <ComplianceBehaviourLedger />}

      <div className="sr-only">
        {compliantCount} {inProgressCount} {mismatchCount}
      </div>
    </div>
  );
}
