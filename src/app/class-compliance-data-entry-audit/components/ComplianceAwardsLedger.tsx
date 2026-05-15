'use client';

import React, { useMemo, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';
import { useSchoolData } from '@/hooks/useSchoolData';
import { DBAchievement } from '@/lib/mockDatabase';
import LogAchievementModal from './LogAchievementModal';

type CategoryFilter = 'All' | 'Academic' | 'Sports' | 'Community';
type MilestoneTier = 'Class' | 'School' | 'Regional' | 'National';

interface AwardLedgerItem extends DBAchievement {
  studentId: string;
  studentName: string;
  initials: string;
  avatarBg: string;
}

const CATEGORY_FILTERS: CategoryFilter[] = ['All', 'Academic', 'Sports', 'Community'];
const TIER_OPTIONS: MilestoneTier[] = ['Class', 'School', 'Regional', 'National'];

export default function ComplianceAwardsLedger() {
  const { students, addAchievement, updateAchievement } = useSchoolData();
  const classStudents = useMemo(
    () => students.filter((student) => student.classId === '11A' && student.academicYear === '25-26'),
    [students]
  );

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const [selectedStudentId, setSelectedStudentId] = useState(classStudents[0]?.studentId ?? '');
  const [awardTitle, setAwardTitle] = useState('');
  const [category, setCategory] = useState<'Academic' | 'Sports' | 'Community'>('Academic');
  const [milestoneTier, setMilestoneTier] = useState<MilestoneTier>('School');
  const [captureDate, setCaptureDate] = useState(new Date().toISOString().slice(0, 10));
  const [evidenceName, setEvidenceName] = useState('');
  const [editingAward, setEditingAward] = useState<AwardLedgerItem | null>(null);

  const ledger = useMemo<AwardLedgerItem[]>(() => {
    return classStudents.flatMap((student) =>
      student.achievements.map((achievement) => ({
        ...achievement,
        studentId: student.studentId,
        studentName: student.name,
        initials: student.initials,
        avatarBg: student.avatarBg,
      }))
    );
  }, [classStudents]);

  const filteredLedger = useMemo(() => {
    return ledger.filter((item) => categoryFilter === 'All' || item.category === categoryFilter);
  }, [ledger, categoryFilter]);

  const selectedStudent = classStudents.find((student) => student.studentId === selectedStudentId) ?? classStudents[0] ?? null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedStudent || !awardTitle.trim()) return;

    addAchievement(selectedStudent.studentId, {
      title: awardTitle.trim(),
      date: new Date(captureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      icon: 'TrophyIcon',
      category,
      tier: milestoneTier,
      hasEvidence: Boolean(evidenceName),
      evidenceLabel: evidenceName || 'Scanned certificate uploaded',
    });

    toast.success(`Award submitted for ${selectedStudent.name}`);
    setAwardTitle('');
    setEvidenceName('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            onClick={() => toast.info('Open award logging dock')}
          >
            <Icon name="TrophyIcon" size={16} variant="outline" />
            Log New Student Award
          </button>

          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategoryFilter(item)}
                className={`rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                  categoryFilter === item
                    ? 'bg-primary/5 text-primary shadow-sm'
                    : 'bg-white text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                style={{ borderColor: categoryFilter === item ? 'rgba(91,29,141,0.25)' : 'var(--border)' }}
              >
                {item === 'All' ? 'All Categories' : item}
              </button>
            ))}
          </div>
        </div>

        <div className="text-sm font-semibold text-muted-foreground">
          {filteredLedger.length} Verified Record{filteredLedger.length === 1 ? '' : 's'}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.65fr_0.95fr]">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">Homeroom Verified Accolades Ledger</h3>
              <p className="mt-1 text-xs text-muted-foreground">Class 11A achievements stored with immediate profile hydration.</p>
            </div>
            <span className="rounded-full border border-success/20 bg-success/10 px-3 py-1 text-[11px] font-bold text-success">
              Verified
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-background text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Student</th>
                  <th className="px-4 py-3 text-left font-semibold">Award Title</th>
                  <th className="px-4 py-3 text-left font-semibold">Capture Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Evidence</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLedger.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      No achievements found for the selected category.
                    </td>
                  </tr>
                ) : (
                  filteredLedger.map((item) => (
                    <tr key={`${item.studentId}-${item.title}-${item.date}`} className="border-t border-border/60">
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
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.category ?? 'Academic'} · {item.tier ?? 'School'}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{item.date}</td>
                      <td className="px-4 py-4">
                        {item.hasEvidence ? (
                          <button
                            type="button"
                            className="text-xs font-semibold text-primary hover:underline"
                            onClick={() => toast.info(item.evidenceLabel ?? 'Evidence document available')}
                          >
                            View Evidence (PDF)
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-muted-foreground">No evidence uploaded</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full border border-success/20 bg-success/10 px-3 py-1 text-[11px] font-bold text-success">
                          Verified
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-xs font-bold text-foreground shadow-sm transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                          onClick={() => setEditingAward(item)}
                          title="Edit logged award properties"
                        >
                          <Icon name="PencilSquareIcon" size={14} variant="outline" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">Live Ingestion Dock</h3>
            <p className="mt-1 text-xs text-muted-foreground">Submit directly to the single source of truth for Class 11A.</p>
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
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Award Title</label>
              <input
                type="text"
                value={awardTitle}
                onChange={(event) => setAwardTitle(event.target.value)}
                placeholder="e.g. 1st Place - National Physics Olympiad"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Category</label>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value as 'Academic' | 'Sports' | 'Community')}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option>Academic</option>
                  <option>Sports</option>
                  <option>Community</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Milestone Tier</label>
                <select
                  value={milestoneTier}
                  onChange={(event) => setMilestoneTier(event.target.value as MilestoneTier)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {TIER_OPTIONS.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Date Picker</label>
                <input
                  type="date"
                  value={captureDate}
                  onChange={(event) => setCaptureDate(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Upload Scanned Certificate / Evidence (PDF/PNG)</label>
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm transition-colors hover:bg-primary/10">
                  <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                    <Icon name="ArrowUpTrayIcon" size={17} variant="outline" className="text-primary flex-shrink-0" />
                    <span className="truncate">{evidenceName || 'Drag and drop or choose file'}</span>
                  </span>
                  <span className="text-xs font-bold text-primary whitespace-nowrap">Choose File</span>
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    className="sr-only"
                    onChange={(event) => setEvidenceName(event.target.files?.[0]?.name ?? '')}
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              <Icon name="CheckCircleIcon" size={16} variant="outline" />
              Submit to Global Single Source of Truth
            </button>
          </form>
        </div>
      </div>

      {editingAward && (
        <LogAchievementModal
          studentName={editingAward.studentName}
          studentId={editingAward.studentId}
          initialAchievement={editingAward}
          titleLabel="Edit Award & Achievement"
          submitLabel="Save Changes"
          onClose={() => setEditingAward(null)}
          onSubmit={(achievement) => {
            updateAchievement(editingAward.studentId, editingAward.id ?? '', achievement);
            toast.success(`Award updated for ${editingAward.studentName}`);
            setEditingAward(null);
          }}
        />
      )}
    </div>
  );
}
