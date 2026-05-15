'use client';

import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { DBAchievement } from '@/lib/mockDatabase';

const CATEGORIES = ['Academic', 'Sports', 'Community'];
const TIER_OPTIONS = ['Class', 'School', 'Regional', 'National'];

interface LogAchievementModalProps {
  studentName: string;
  studentId: string;
  onClose: () => void;
  onSubmit: (achievement: DBAchievement) => void;
  initialAchievement?: DBAchievement | null;
  submitLabel?: string;
  titleLabel?: string;
}

export default function LogAchievementModal({
  studentName,
  studentId,
  onClose,
  onSubmit,
  initialAchievement,
  submitLabel = 'Submit Achievement',
  titleLabel = 'Log Award & Achievement',
}: LogAchievementModalProps) {
  const [awardTitle, setAwardTitle] = useState(initialAchievement?.title ?? '');
  const [category, setCategory] = useState(initialAchievement?.category ?? CATEGORIES[0]);
  const [milestoneTier, setMilestoneTier] = useState(initialAchievement?.tier ?? TIER_OPTIONS[1]);
  const [awardDate, setAwardDate] = useState(initialAchievement?.date ?? new Date().toISOString().slice(0, 10));
  const [evidenceName, setEvidenceName] = useState(initialAchievement?.evidenceLabel ?? '');

  useEffect(() => {
    setAwardTitle(initialAchievement?.title ?? '');
    setCategory(initialAchievement?.category ?? CATEGORIES[0]);
    setMilestoneTier(initialAchievement?.tier ?? TIER_OPTIONS[1]);
    setAwardDate(initialAchievement?.date ?? new Date().toISOString().slice(0, 10));
    setEvidenceName(initialAchievement?.evidenceLabel ?? '');
  }, [initialAchievement]);

  const canSubmit = awardTitle.trim().length > 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    onSubmit({
      id: initialAchievement?.id,
      title: awardTitle.trim(),
      category,
      tier: milestoneTier,
      date: awardDate,
      icon: 'TrophyIcon',
      hasEvidence: evidenceName.length > 0,
      evidenceLabel: evidenceName || 'Scanned certificate uploaded',
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
              <Icon name="TrophyIcon" size={20} variant="outline" className="text-primary" />
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
            <label htmlFor="award-title" className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
              Award Title
            </label>
            <input
              id="award-title"
              type="text"
              value={awardTitle}
              onChange={(event) => setAwardTitle(event.target.value)}
              placeholder="e.g. 1st Place - National Physics Olympiad"
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              autoFocus
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="award-category" className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
                Category
              </label>
              <select
                id="award-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              >
                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="award-tier" className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
                Milestone Tier
              </label>
              <select
                id="award-tier"
                value={milestoneTier}
                onChange={(event) => setMilestoneTier(event.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              >
                {TIER_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="award-date" className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
                Capture Date
              </label>
              <input
                id="award-date"
                type="date"
                value={awardDate}
                onChange={(event) => setAwardDate(event.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label htmlFor="award-evidence" className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
                Evidence Document
              </label>
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm transition-colors hover:bg-primary/10">
                <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                  <Icon name="ArrowUpTrayIcon" size={17} variant="outline" className="text-primary flex-shrink-0" />
                  <span className="truncate">{evidenceName || 'Upload scanned certificate / PDF / PNG'}</span>
                </span>
                <span className="text-xs font-bold text-primary whitespace-nowrap">Choose File</span>
                <input
                  id="award-evidence"
                  type="file"
                  accept="application/pdf,image/*"
                  className="sr-only"
                  onChange={(event) => setEvidenceName(event.target.files?.[0]?.name ?? '')}
                />
              </label>
            </div>
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
