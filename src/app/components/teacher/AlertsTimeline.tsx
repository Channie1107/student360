'use client';
import React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ExternalLink, AlertCircle, Info } from 'lucide-react';

import { useSchoolData } from '@/hooks/useSchoolData';

export default function AlertsTimeline() {
  const { alerts } = useSchoolData();

  const activeCount = alerts.filter(a => !a.isSystem).length;

  return (
    <div className="bg-card rounded-2xl shadow-card p-5 card-hover h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-foreground">Class Alerts</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-danger/10 text-danger">{activeCount} Active</span>
          <AlertCircle size={16} className="text-warning" />
        </div>
      </div>
      
      <div className="relative flex-1">
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
                  backgroundColor: alert.dotColor,
                  boxShadow: `0 0 0 2px ${alert.dotColor}`,
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
                    {alert.message}
                  </p>
                </div>
              ) : (
                <div>
                  <p
                    className="text-2xs font-medium mb-0.5"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {alert.time}
                  </p>
                  <p className="text-sm font-semibold text-foreground leading-snug">
                    {alert.message}
                  </p>
                  {alert.action && alert.actionHref && (
                    <Link
                      href={alert.actionHref}
                      className="inline-flex items-center gap-1 text-xs font-semibold mt-1 hover:underline transition-colors"
                      style={{ color: 'var(--primary)' }}
                      onClick={() => toast.info(`Navigating to ${alert.action}`)}
                    >
                      {alert.action}
                      <ExternalLink size={11} />
                    </Link>
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