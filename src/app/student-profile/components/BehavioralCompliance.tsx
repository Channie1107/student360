import React from 'react';

const categories = [
  { id: 'beh-uniform', label: 'Uniform Compliance', score: 98, total: 100, color: 'var(--primary)' },
  { id: 'beh-punctuality', label: 'Punctuality', score: 95, total: 100, color: 'var(--primary)' },
  { id: 'beh-conduct', label: 'Classroom Conduct', score: 92, total: 100, color: 'var(--primary)' },
  { id: 'beh-homework', label: 'Homework Submission', score: 88, total: 100, color: 'var(--warning)' },
  { id: 'beh-digital', label: 'Digital Device Policy', score: 100, total: 100, color: 'var(--success)' },
];

const demerits = [
  { id: 'dem-001', date: '—', category: '—', description: 'No demerits on record', severity: 'none' },
];

export default function BehavioralCompliance() {
  return (
    <div className="bg-card rounded-2xl shadow-card p-5 card-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground">Behavioral Compliance</h3>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full bg-success-bg text-success"
        >
          0 Demerits
        </span>
      </div>
      <div className="space-y-3 mb-4">
        {categories?.map((cat) => (
          <div key={cat?.id}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-foreground">{cat?.label}</span>
              <span className="text-xs font-semibold font-tabular text-foreground">
                {cat?.score}%
              </span>
            </div>
            <div className="compliance-progress-track">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${cat?.score}%`,
                  backgroundColor: cat?.color,
                  height: '6px',
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div
        className="rounded-xl p-3 text-center"
        style={{ backgroundColor: 'var(--success-bg)' }}
      >
        <p className="text-xs font-semibold text-success">
          ✓ Clean disciplinary record for Academic Year 2025–26
        </p>
      </div>
    </div>
  );
}