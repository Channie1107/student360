'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { useSchoolData } from '@/hooks/useSchoolData';
import { buildComplianceData, summarizeCompliance, STATE_COLORS, type ComplianceState } from './complianceMatrixData';

const KPIS = [
  {
    id: 'ckpi-attendance',
    title: 'SIS & Face ID Synced',
    subtitle: 'Attendance sync status across the matrix',
    kind: 'attendance' as const,
    icon: 'UsersIcon',
    bg: '#52c41a15',
  },
  {
    id: 'ckpi-canvas',
    title: 'Canvas Gradebook Inputs',
    subtitle: 'Average grading completion across the matrix',
    kind: 'canvas' as const,
    icon: 'PencilSquareIcon',
    bg: '#faad1415',
  },
  {
    id: 'ckpi-audit',
    title: 'Reconciliation Compliance',
    subtitle: 'Fully compliant records in Class 11A',
    kind: 'reconciliation' as const,
    icon: 'ShieldCheckIcon',
    bg: '#ff4d4f15',
  },
] as const;

const stateBadgeClass: Record<ComplianceState, string> = {
  COMPLIANT: 'bg-success/10 text-success border-success/20',
  'IN PROGRESS': 'bg-warning/10 text-warning border-warning/20',
  'MISSING DATA': 'bg-danger/10 text-danger border-danger/20',
};

function getCardState(kind: (typeof KPIS)[number]['kind'], summary: ReturnType<typeof summarizeCompliance>): ComplianceState {
  if (kind === 'attendance') {
    if (summary.attendanceAverage >= 93) return 'COMPLIANT';
    if (summary.attendanceAverage === 0) return 'MISSING DATA';
    return 'IN PROGRESS';
  }

  if (kind === 'canvas') {
    if (summary.canvasAverage === 100) return 'COMPLIANT';
    if (summary.canvasAverage === 0) return 'MISSING DATA';
    return 'IN PROGRESS';
  }

  if (summary.total === 0) return 'MISSING DATA';
  if (summary.compliantCount === summary.total) return 'COMPLIANT';
  if (summary.compliantCount === 0) return 'MISSING DATA';
  return 'IN PROGRESS';
}

export default function ComplianceKPIRow() {
  const { students } = useSchoolData();
  const classStudents = students.filter((student) => student.classId === '11A' && student.academicYear === '25-26');
  const complianceRows = buildComplianceData(classStudents);
  const summary = summarizeCompliance(complianceRows);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {KPIS.map((card) => {
        const state = getCardState(card.kind, summary);
        const value =
          card.kind === 'attendance'
            ? `${summary.attendanceAverage}%`
            : card.kind === 'canvas'
              ? `${summary.canvasAverage}%`
              : `${summary.compliantCount} / ${summary.total} Records`;

        return (
          <div key={card.id} className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-elevated transition-all relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none">
              <Icon name={card.kind === 'attendance' ? 'ClipboardDocumentCheckIcon' : card.kind === 'canvas' ? 'AcademicCapIcon' : 'ShieldCheckIcon'} size={120} variant="solid" />
            </div>

            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 rounded-lg flex items-center justify-center" style={{ background: card.bg, color: STATE_COLORS[state] }}>
                    <Icon name={card.icon} size={16} variant="outline" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">{card.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground ml-8">{card.subtitle}</p>
              </div>
            </div>

            <div className="flex items-end justify-between mt-2 z-10 relative">
              <div>
                <p className="text-4xl font-black font-tabular tracking-tight" style={{ color: STATE_COLORS[state] }}>{value}</p>
                <div className="mt-1">
                  <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${stateBadgeClass[state]}`}>
                    {state}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
