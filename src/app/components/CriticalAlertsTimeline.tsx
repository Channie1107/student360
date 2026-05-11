'use client';

import React from 'react';
import { ExternalLink, AlertTriangle, Info } from 'lucide-react';

interface AlertItem {
  id: string;
  timeAgo: string;
  type: 'red' | 'yellow' | 'purple';
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  isSystem?: boolean;
}

const alerts: AlertItem[] = [
  {
    id: 'alert-001',
    timeAgo: '2 hours ago',
    type: 'red',
    title: '10 students in 10C with unexcused absences > 3 days.',
    description: '',
    actionLabel: 'View Class List',
    actionHref: '#',
  },
  {
    id: 'alert-002',
    timeAgo: '5 hours ago',
    type: 'red',
    title: 'Science Dept: Mid-term grades pending finalization.',
    description: '',
    actionLabel: 'Contact Dept',
    actionHref: '#',
  },
  {
    id: 'alert-003',
    timeAgo: '5 hours ago',
    type: 'yellow',
    title: 'Mathematics Dept: 3 teachers missing Canvas submissions.',
    description: '',
    actionLabel: 'Contact Dept',
    actionHref: '#',
  },
  {
    id: 'alert-004',
    timeAgo: 'System Notice',
    type: 'purple',
    title: '',
    description:
      'All campus networks will undergo scheduled maintenance this Sunday at 12:00 PM. Automated attendance syncing may be delayed.',
    isSystem: true,
  },
];

const nodeColors: Record<string, string> = {
  red: 'var(--danger)',
  yellow: 'var(--warning)',
  purple: 'var(--primary)',
};

export default function CriticalAlertsTimeline() {
  return (
    <div className="bg-card rounded-2xl shadow-card p-5 card-hover h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-foreground">Critical Alerts Timeline</h2>
        <AlertTriangle size={16} className="text-warning" />
      </div>
      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-[5px] top-0 bottom-0 w-0.5"
          style={{ backgroundColor: 'var(--border)' }}
        />
        <div className="space-y-5">
          {alerts.map((alert) => (
            <div key={alert.id} className="relative pl-6">
              {/* Node */}
              <div
                className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                style={{
                  backgroundColor: nodeColors[alert.type],
                  boxShadow: `0 0 0 2px ${nodeColors[alert.type]}`,
                }}
              />
              {alert.isSystem ? (
                <div
                  className="rounded-lg p-3"
                  style={{ backgroundColor: 'var(--secondary)' }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Info size={13} style={{ color: 'var(--primary)' }} />
                    <span
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: 'var(--primary)' }}
                    >
                      System Notice
                    </span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">
                    {alert.description}
                  </p>
                </div>
              ) : (
                <div>
                  <p
                    className="text-2xs font-medium mb-0.5"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {alert.timeAgo}
                  </p>
                  <p className="text-sm font-semibold text-foreground leading-snug">
                    {alert.title}
                  </p>
                  {alert.actionLabel && (
                    <a
                      href={alert.actionHref}
                      className="inline-flex items-center gap-1 text-xs font-semibold mt-1 hover:underline"
                      style={{ color: 'var(--primary)' }}
                    >
                      {alert.actionLabel}
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}