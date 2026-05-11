import React from 'react';
import { Bus, Heart, Activity, CheckCircle2 } from 'lucide-react';

const logs = [
  {
    id: 'health-001',
    icon: Bus,
    iconBg: 'bg-info-bg',
    iconColor: 'text-info',
    title: 'Bus Check-In',
    subtitle: 'Route 4B — Arrived On Time',
    time: 'Today, 07:42 AM',
    status: 'Normal',
    statusVariant: 'success',
  },
  {
    id: 'health-002',
    icon: Heart,
    iconBg: 'bg-success-bg',
    iconColor: 'text-success',
    title: 'Annual Physical Exam',
    subtitle: 'Dr. Minh Nguyen — All Clear',
    time: '28 Apr 2026',
    status: 'Completed',
    statusVariant: 'success',
  },
  {
    id: 'health-003',
    icon: Activity,
    iconBg: 'bg-warning-bg',
    iconColor: 'text-warning',
    title: 'Infirmary Visit',
    subtitle: 'Mild headache — Paracetamol administered',
    time: '15 Mar 2026, 02:15 PM',
    status: 'Resolved',
    statusVariant: 'warning',
  },
  {
    id: 'health-004',
    icon: CheckCircle2,
    iconBg: 'bg-success-bg',
    iconColor: 'text-success',
    title: 'Vision Screening',
    subtitle: '20/20 — No correction required',
    time: '10 Jan 2026',
    status: 'Normal',
    statusVariant: 'success',
  },
];

const statusColors: Record<string, string> = {
  success: 'text-success bg-success-bg',
  warning: 'text-warning bg-warning-bg',
  danger: 'text-danger bg-danger-bg',
};

export default function SafetyHealthLog() {
  return (
    <div className="bg-card rounded-2xl shadow-card p-5 card-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground">Safety & Health Log</h3>
        <span className="text-xs text-muted-foreground">AY 2025–26</span>
      </div>
      <div className="space-y-3">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-3 p-3 rounded-xl border border-border hover:border-primary/20 transition-colors"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${log.iconBg}`}>
              <log.icon size={15} className={log.iconColor} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{log.title}</p>
                <span
                  className={`text-2xs font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${statusColors[log.statusVariant]}`}
                >
                  {log.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{log.subtitle}</p>
              <p className="text-2xs text-muted-foreground/70 mt-0.5">{log.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}