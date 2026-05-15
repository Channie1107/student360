'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useSchoolData } from '@/hooks/useSchoolData';

const GPABarChartInner = dynamic(() => import('./GPABarChartInner'), { ssr: false });

export default function GPABarChart() {
  const { role, teacherContext } = useSchoolData();

  return (
    <div className="bg-card rounded-2xl shadow-card p-5 card-hover h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-foreground">GPA Performance by Subject</h2>
          <span className="text-xs text-muted-foreground font-medium">
            {role === 'principal' ? 'School-wide average vs Region' : `Comparing Class ${teacherContext?.classId} vs Grade ${teacherContext?.gradeId} average`} · Term 1
          </span>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <span className="text-lg leading-none">···</span>
        </button>
      </div>
      <div className="flex-1 min-h-[280px]">
        <GPABarChartInner />
      </div>
    </div>
  );
}