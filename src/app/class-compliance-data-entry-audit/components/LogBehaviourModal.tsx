'use client';

import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { DBBehaviorLog } from '@/lib/mockDatabase';

const SEVERITIES: Array<{ value: DBBehaviorLog['severity']; label: string }> = [
  { value: 'info', label: 'Info' },
  { value: 'warning', label: 'Warning' },
  { value: 'danger', label: 'Danger' },
];

interface LogBehaviourModalProps {
  studentName: string;
  studentId: string;
  onClose: () => void;
  onSubmit: (log: DBBehaviorLog) => void;
  initialLog?: DBBehaviorLog | null;
  submitLabel?: string;
  titleLabel?: string;
}

export default function LogBehaviourModal({
  studentName,
  studentId,
  onClose,
  onSubmit,
  initialLog,
  submitLabel = 'Submit Behaviour Note',
  titleLabel = 'Log Behaviour Note',
}: LogBehaviourModalProps) {
  const [logType, setLogType] = useState(initialLog?.type ?? 'Late Arrival');
  const [severity, setSeverity] = useState<DBBehaviorLog['severity']>(initialLog?.severity ?? 'warning');
  const [logDate, setLogDate] = useState(initialLog?.date ?? new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState(initialLog?.note ?? '');

  useEffect(() => {
    setLogType(initialLog?.type ?? 'Late Arrival');
    setSeverity(initialLog?.severity ?? 'warning');
    setLogDate(initialLog?.date ?? new Date().toISOString().slice(0, 10));
    setNote(initialLog?.note ?? '');
  }, [initialLog]);

  const canSubmit = note.trim().length > 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    onSubmit({
      id: initialLog?.id,
      date: logDate,
      type: logType.trim(),
      note: note.trim(),
      severity,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-card shadow-elevated border border-border">
        <div
          className="flex items-start justify-between gap-4 px-6 py-5 border-b border-border"
          style={{ background: 'linear-gradient(135deg, rgba(91,29,141,0.08) 0%, rgba(255,217,0,0.08) 100%)' }}
        >
          <div>
            <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2">
              <Icon name="ShieldExclamationIcon" size={20} variant="outline" className="text-primary" />
              {titleLabel}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Student row target: <span className="font-semibold text-foreground">{studentName}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Student ID: {studentId}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Close"
          >
            <Icon name="XMarkIcon" size={18} variant="outline" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="behaviour-type" className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
              Log Type
            </label>
            <input
              id="behaviour-type"
              type="text"
              value={logType}
              onChange={(event) => setLogType(event.target.value)}
              placeholder="e.g. Late Arrival, Uniform Check"
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              autoFocus
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="behaviour-severity" className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
                Severity
              </label>
              <select
                id="behaviour-severity"
                value={severity}
                onChange={(event) => setSeverity(event.target.value as DBBehaviorLog['severity'])}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              >
                {SEVERITIES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="behaviour-date" className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
                Log Date
              </label>
              <input
                id="behaviour-date"
                type="date"
                value={logDate}
                onChange={(event) => setLogDate(event.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="behaviour-note" className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
              Behaviour Note
            </label>
            <textarea
              id="behaviour-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Describe the conduct, observation, or follow-up..."
              rows={4}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-bold border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="CheckCircleIcon" size={16} variant="outline" />
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
