'use client';

import React, { useMemo, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';
import { useSchoolData } from '@/hooks/useSchoolData';
import { DBBehaviorLog } from '@/lib/mockDatabase';
import LogBehaviourModal from './LogBehaviourModal';

type SeverityFilter = 'All' | 'Info' | 'Warning' | 'Danger';

interface BehaviourLedgerItem extends DBBehaviorLog {
  studentId: string;
  studentName: string;
  initials: string;
  avatarBg: string;
}

const SEVERITY_FILTERS: SeverityFilter[] = ['All', 'Info', 'Warning', 'Danger'];

const SEVERITY_META: Record<DBBehaviorLog['severity'], { label: string; color: string; bg: string; icon: string }> = {
  info: { label: 'Info', color: '#5b1d8d', bg: 'rgba(91,29,141,0.08)', icon: 'InformationCircleIcon' },
  warning: { label: 'Warning', color: '#faad14', bg: 'rgba(250,173,20,0.08)', icon: 'ExclamationTriangleIcon' },
  danger: { label: 'Danger', color: '#ff4d4f', bg: 'rgba(255,77,79,0.08)', icon: 'ExclamationCircleIcon' },
};

export default function ComplianceBehaviourLedger() {
  const { students, addBehaviorLog, updateBehaviorLog } = useSchoolData();
  const classStudents = useMemo(
    () => students.filter((student) => student.classId === '11A' && student.academicYear === '25-26'),
    [students]
  );

  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('All');
  const [selectedStudentId, setSelectedStudentId] = useState(classStudents[0]?.studentId ?? '');
  const [logType, setLogType] = useState('Late Arrival');
  const [severity, setSeverity] = useState<DBBehaviorLog['severity']>('warning');
  const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [editingLog, setEditingLog] = useState<BehaviourLedgerItem | null>(null);

  const ledger = useMemo<BehaviourLedgerItem[]>(() => {
    return classStudents.flatMap((student) =>
      student.behaviorLogs.map((log) => ({
        ...log,
        studentId: student.studentId,
        studentName: student.name,
        initials: student.initials,
        avatarBg: student.avatarBg,
      }))
    );
  }, [classStudents]);

  const filteredLedger = useMemo(() => {
    return ledger.filter((item) => {
      if (severityFilter === 'All') return true;
      if (severityFilter === 'Info') return item.severity === 'info';
      if (severityFilter === 'Warning') return item.severity === 'warning';
      return item.severity === 'danger';
    });
  }, [ledger, severityFilter]);

  const selectedStudent = classStudents.find((student) => student.studentId === selectedStudentId) ?? classStudents[0] ?? null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedStudent || !note.trim()) return;

    addBehaviorLog(selectedStudent.studentId, {
      date: new Date(logDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: logType.trim(),
      note: note.trim(),
      severity,
    });

    toast.success(`Behaviour log submitted for ${selectedStudent.name}`);
    setNote('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            onClick={() => toast.info('Open behaviour logging dock')}
          >
            <Icon name="ShieldExclamationIcon" size={16} variant="outline" />
            Log New Behaviour Note
          </button>

          <div className="flex flex-wrap gap-2">
            {SEVERITY_FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSeverityFilter(item)}
                className={`rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                  severityFilter === item
                    ? 'bg-primary/5 text-primary shadow-sm'
                    : 'bg-white text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                style={{ borderColor: severityFilter === item ? 'rgba(91,29,141,0.25)' : 'var(--border)' }}
              >
                {item === 'All' ? 'All Logs' : item}
              </button>
            ))}
          </div>
        </div>

        <div className="text-sm font-semibold text-muted-foreground">
          {filteredLedger.length} Logged Record{filteredLedger.length === 1 ? '' : 's'}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.65fr_0.95fr]">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">Homeroom Behaviour & Conduct Ledger</h3>
              <p className="mt-1 text-xs text-muted-foreground">Class 11A behaviour notes stored with immediate profile hydration.</p>
            </div>
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
              Live
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-background text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Student</th>
                  <th className="px-4 py-3 text-left font-semibold">Log Type</th>
                  <th className="px-4 py-3 text-left font-semibold">Log Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Severity</th>
                  <th className="px-4 py-3 text-left font-semibold">Note</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLedger.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      No behaviour logs found for the selected severity.
                    </td>
                  </tr>
                ) : (
                  filteredLedger.map((item) => {
                    const meta = SEVERITY_META[item.severity];
                    return (
                      <tr key={`${item.studentId}-${item.date}-${item.type}-${item.note}`} className="border-t border-border/60">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: item.avatarBg }}>
                              {item.initials}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{item.studentName}</p>
                              <p className="text-xs text-muted-foreground">{item.studentId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-semibold text-foreground">{item.type}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">{item.date}</td>
                        <td className="px-4 py-4">
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold"
                            style={{ color: meta.color, backgroundColor: meta.bg, borderColor: meta.bg }}
                          >
                            <Icon name={meta.icon} size={14} variant="solid" />
                            {meta.label}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-foreground">{item.note}</p>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-xs font-bold text-foreground shadow-sm transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                            onClick={() => setEditingLog(item)}
                            title="Edit logged behaviour properties"
                          >
                            <Icon name="PencilSquareIcon" size={14} variant="outline" />
                            Edit
                          </button>
                      </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">Live Behaviour Ingestion Dock</h3>
            <p className="mt-1 text-xs text-muted-foreground">Submit conduct notes directly into the Class 11A record.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Select Student</label>
              <select
                value={selectedStudentId}
                onChange={(event) => setSelectedStudentId(event.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {classStudents.map((student) => (
                  <option key={student.studentId} value={student.studentId}>
                    {student.name} {student.studentId}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Log Type</label>
              <input
                type="text"
                value={logType}
                onChange={(event) => setLogType(event.target.value)}
                placeholder="e.g. Late Arrival, Uniform Check"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Severity</label>
                <select
                  value={severity}
                  onChange={(event) => setSeverity(event.target.value as DBBehaviorLog['severity'])}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="danger">Danger</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Date Picker</label>
                <input
                  type="date"
                  value={logDate}
                  onChange={(event) => setLogDate(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Behaviour Note</label>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Describe the conduct, observation, or follow-up..."
                rows={4}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              <Icon name="CheckCircleIcon" size={16} variant="outline" />
              Submit Behaviour Note
            </button>
          </form>
        </div>
      </div>

      {editingLog && (
        <LogBehaviourModal
          studentName={editingLog.studentName}
          studentId={editingLog.studentId}
          initialLog={editingLog}
          titleLabel="Edit Behaviour Note"
          submitLabel="Save Changes"
          onClose={() => setEditingLog(null)}
          onSubmit={(log) => {
            updateBehaviorLog(editingLog.studentId, editingLog.id ?? '', log);
            toast.success(`Behaviour log updated for ${editingLog.studentName}`);
            setEditingLog(null);
          }}
        />
      )}
    </div>
  );
}
