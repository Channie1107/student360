'use client';

import React from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function ComplianceHeader() {
  const handleExport = () => {
    // Backend integration point: GET /api/compliance/export?format=csv
    toast?.success('Compliance report exported', {
      description: 'compliance_matrix_may2026.csv downloaded',
      duration: 3000,
    });
  };

  const handleRefresh = () => {
    // Backend integration point: POST /api/compliance/sync
    toast?.info('Syncing compliance data...', {
      description: 'Pulling latest SIS and Canvas records',
      duration: 2500,
    });
  };

  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <span className="font-medium">The Olympia Schools</span>
          <span>/</span>
          <span className="font-semibold" style={{ color: 'var(--primary)' }}>
            Compliance Matrix
          </span>
        </div>
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--primary)', letterSpacing: '-0.01em' }}
        >
          Compliance Matrix
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Teacher attendance input &amp; Canvas grading compliance — Deadline 12:30 PM daily
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-white text-sm font-medium text-foreground hover:bg-muted btn-press transition-all"
        >
          <RefreshCw size={15} />
          Sync
        </button>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white btn-press transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <Download size={15} />
          Export Report
        </button>
      </div>
    </div>
  );
}