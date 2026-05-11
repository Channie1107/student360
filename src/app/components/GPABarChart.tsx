'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const GPABarChartInner = dynamic(() => import('./GPABarChartInner'), { ssr: false });

export default function GPABarChart() {
  return (
    <div className="bg-card rounded-2xl shadow-card p-5 card-hover">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-foreground">GPA Distribution by Grade Level</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: 'var(--primary)' }}
            />
            <span className="text-xs text-muted-foreground font-medium">Term 1</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: 'var(--accent)' }}
            />
            <span className="text-xs text-muted-foreground font-medium">Term 2</span>
          </div>
        </div>
      </div>
      <GPABarChartInner />
    </div>
  );
}