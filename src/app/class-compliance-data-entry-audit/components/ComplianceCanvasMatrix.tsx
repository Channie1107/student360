'use client';

import React, { useMemo, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';
import {
  ComplianceState,
  STATE_COLORS,
  StudentCompliance,
  SubjectName,
} from './complianceMatrixData';

interface ComplianceCanvasMatrixProps {
  rows: StudentCompliance[];
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
}

const SUBJECTS: SubjectName[] = ['Mathematics', 'English A', 'Physics', 'Chemistry', 'History'];

const FILTERS: Array<'all' | 'COMPLIANT' | 'PENDING'> = ['all', 'COMPLIANT', 'PENDING'];

const filterLabel: Record<'all' | 'COMPLIANT' | 'PENDING', string> = {
  all: 'All Roster (23)',
  COMPLIANT: 'Fully Graded (23)',
  PENDING: 'Pending Input (0)',
};

function statusPill(state: ComplianceState) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold whitespace-nowrap"
      style={{
        color: STATE_COLORS[state],
        backgroundColor: `${STATE_COLORS[state]}12`,
        borderColor: `${STATE_COLORS[state]}30`,
      }}
    >
      <Icon name="CheckCircleIcon" size={14} variant="solid" />
      {state}
    </span>
  );
}

function scorePill(score: number) {
  const scale4 = (score / 25).toFixed(2);
  return (
    <span className="inline-flex items-center rounded-full border border-success/25 bg-success/5 px-2.5 py-1 text-[11px] font-extrabold tabular-nums" style={{ color: '#52c41a' }}>
      {scale4}/4
    </span>
  );
}

export default function ComplianceCanvasMatrix({
  rows,
  searchQuery,
  onSearchQueryChange,
}: ComplianceCanvasMatrixProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'COMPLIANT' | 'PENDING'>('all');

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch =
        row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.studentId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesState = activeFilter === 'all' || row.canvasState === activeFilter;
      return matchesSearch && matchesState;
    });
  }, [rows, searchQuery, activeFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(activeFilter === filter ? 'all' : filter)}
              className={`rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                activeFilter === filter
                  ? 'bg-primary/5 text-primary shadow-sm'
                  : 'bg-white text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
              style={{ borderColor: activeFilter === filter ? 'rgba(91,29,141,0.25)' : 'var(--border)' }}
            >
              {filterLabel[filter]}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-xs">
          <Icon name="MagnifyingGlassIcon" size={16} variant="outline" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter by Student Name or ID..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-4 text-sm shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 border-b border-border bg-background">
            <tr>
              <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Student Profile
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Mathematics
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                English A
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Physics
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Chemistry
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                History
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Academic Audit Status
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Targeted Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                  No students match your search or filter criteria.
                </td>
              </tr>
            )}

            {filteredRows.map((row) => (
              <tr key={row.id} className="group border-b border-border/50 transition-colors hover:bg-muted/20 last:border-0">
                <td className="px-5 py-4 align-top">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: row.avatarBg }}>
                      {row.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-tight text-foreground">{row.name}</p>
                      <p className="text-xs text-muted-foreground">{row.studentId}</p>
                    </div>
                  </div>
                </td>

                {SUBJECTS.map((subject) => {
                  const cell = row.subjects.find((entry) => entry.subject === subject);
                  return (
                    <td key={`${row.id}-${subject}`} className="px-4 py-4 align-top">
                      {cell && scorePill(cell.score)}
                    </td>
                  );
                })}

                <td className="px-4 py-4 align-top">
                  <div className="inline-flex items-center gap-1.5 rounded-xl border border-success/25 bg-success px-3 py-1.5 text-xs font-bold text-white">
                    COMPLIANT
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5 opacity-80 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => toast.info(`Launch Canvas Subject Ledger for ${row.name}`)}
                      className="rounded-xl bg-muted/50 p-2 text-muted-foreground shadow-sm transition-all hover:bg-primary/10 hover:text-primary"
                      title="Launch Canvas Subject Ledger"
                    >
                      <Icon name="BookOpenIcon" size={16} variant="outline" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toast.success(`Auto-alert queued for ${row.name}`)}
                      className="rounded-xl bg-muted/50 p-2 text-muted-foreground shadow-sm transition-all hover:bg-primary/10 hover:text-primary"
                      title="Trigger Auto-Alert to Subject Teacher"
                    >
                      <Icon name="EnvelopeIcon" size={16} variant="outline" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
