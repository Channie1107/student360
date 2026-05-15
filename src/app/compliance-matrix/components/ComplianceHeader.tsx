'use client';

import React from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import DashboardHeader from '@/app/components/DashboardHeader';

export default function ComplianceHeader() {
  const handleExport = () => {
    // Backend integration point: GET /api/compliance/export?format=csv
    toast.success('Compliance report exported', {
      description: 'compliance_matrix_may2026.csv downloaded',
      duration: 3000,
    });
  };

  const handleRefresh = () => {
    // Backend integration point: POST /api/compliance/sync
    toast.info('Syncing compliance data...', {
      description: 'Pulling latest SIS and Canvas records',
      duration: 2500,
    });
  };

  return (
    <DashboardHeader
      title="Compliance Matrix"
      subtitle="Teacher attendance input & Canvas grading compliance — Deadline 12:30 PM daily"
      breadcrumb="Compliance Matrix"
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted btn-press"
          >
            <RefreshCw size={15} />
            Sync
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 btn-press"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <Download size={15} />
            Export Report
          </button>
        </div>
      }
    />
  );
}
