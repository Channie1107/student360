import React from 'react';
import { FileText, Award, CheckCircle } from 'lucide-react';

const achievements = [
  {
    id: 'ach-001',
    category: 'Language Certification',
    title: 'IELTS Academic',
    detail: 'Band Score: 7.5',
    date: 'October 2025',
    verified: true,
    hasEvidence: true,
    evidenceLabel: 'Certificate PDF',
    badgeColor: 'bg-info-bg text-info',
  },
  {
    id: 'ach-002',
    category: 'Academic Competition',
    title: 'Science Olympiad — National',
    detail: '1st Place — Biology Category',
    date: 'March 2026',
    verified: true,
    hasEvidence: true,
    evidenceLabel: 'Award Letter PDF',
    badgeColor: 'bg-warning-bg text-warning',
  },
  {
    id: 'ach-003',
    category: 'Leadership',
    title: 'Student Council Vice President',
    detail: 'AY 2025–26 Term',
    date: 'Sep 2025 – Present',
    verified: true,
    hasEvidence: false,
    evidenceLabel: '',
    badgeColor: 'bg-secondary text-primary',
  },
  {
    id: 'ach-004',
    category: 'Arts & Culture',
    title: 'Hanoi Youth Orchestra',
    detail: 'First Violin — Season 2025',
    date: 'June 2025',
    verified: false,
    hasEvidence: false,
    evidenceLabel: '',
    badgeColor: 'bg-muted text-muted-foreground',
  },
];

export default function ExtracurricularAchievements() {
  return (
    <div className="bg-card rounded-2xl shadow-card p-5 card-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground">Extracurricular Achievements</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CheckCircle size={13} className="text-success" />
          <span>3 Verified</span>
        </div>
      </div>
      <div className="space-y-3">
        {achievements?.map((ach) => (
          <div
            key={ach?.id}
            className="flex items-start gap-3 p-3 rounded-xl border border-border hover:border-primary/20 transition-colors"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'var(--secondary)' }}
            >
              <Award size={15} style={{ color: 'var(--primary)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <p className="text-sm font-semibold text-foreground">{ach?.title}</p>
                  <p className="text-xs text-muted-foreground">{ach?.detail}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {ach?.verified && (
                    <span className="flex items-center gap-1 text-2xs font-semibold text-success bg-success-bg px-1.5 py-0.5 rounded-full">
                      <CheckCircle size={10} />
                      Verified
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mt-1.5 flex-wrap gap-1">
                <span className={`text-2xs font-semibold px-1.5 py-0.5 rounded-full ${ach?.badgeColor}`}>
                  {ach?.category}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-2xs text-muted-foreground">{ach?.date}</span>
                  {ach?.hasEvidence && (
                    <button className="flex items-center gap-1 text-2xs font-semibold text-primary hover:underline">
                      <FileText size={11} />
                      {ach?.evidenceLabel}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}