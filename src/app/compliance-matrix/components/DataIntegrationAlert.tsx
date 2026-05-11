import React from 'react';
import { ShieldAlert, ExternalLink } from 'lucide-react';

export default function DataIntegrationAlert() {
  return (
    <div
      className="rounded-2xl p-4 border flex items-start gap-3 fade-in"
      style={{
        backgroundColor: 'rgba(91,29,141,0.05)',
        borderColor: 'rgba(91,29,141,0.2)',
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: 'var(--secondary)' }}
      >
        <ShieldAlert size={18} style={{ color: 'var(--primary)' }} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-foreground mb-1">
          Data Integration Gatekeeper Notice
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Compliance records displayed here are sourced directly from the SIS (Student Information
          System) and Canvas LMS integration. Any discrepancies in attendance or grading data
          reflect the state of the upstream system at the last sync. Manual overrides are logged
          and require Department Head approval. SIS sync runs every 15 minutes;
          Canvas sync runs every 30 minutes.
        </p>
        <div className="flex items-center gap-4 mt-2">
          <button
            className="flex items-center gap-1 text-xs font-semibold hover:underline"
            style={{ color: 'var(--primary)' }}
          >
            View Integration Status
            <ExternalLink size={11} />
          </button>
          <span className="text-2xs text-muted-foreground">
            Last SIS sync: 11 May 2026, 04:15 AM · Last Canvas sync: 11 May 2026, 04:00 AM
          </span>
        </div>
      </div>
    </div>
  );
}