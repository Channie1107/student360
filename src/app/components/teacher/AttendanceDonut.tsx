'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const AttendanceDonutChart = dynamic(() => import('./AttendanceDonutChart'), { ssr: false });

import { useSchoolData } from '@/hooks/useSchoolData';

export default function AttendanceDonut() {
  const { role, teacherContext } = useSchoolData();

  return (
    <div className="bg-card rounded-2xl shadow-card p-5 card-hover h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-foreground">Attendance Breakdown</h2>
          <span className="text-xs text-muted-foreground font-medium">
            {role === 'principal' ? 'School-wide Overview' : `Class ${teacherContext?.classId}`} · Academic Year 25-26
          </span>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <span className="text-lg leading-none">···</span>
        </button>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <AttendanceDonutChart />
      </div>
    </div>
  );
}