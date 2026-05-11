'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const AttendanceDonutChart = dynamic(() => import('./AttendanceDonutChart'), { ssr: false });

export default function AttendanceDonut() {
  return (
    <div className="bg-card rounded-2xl shadow-card p-5 card-hover">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-foreground">Attendance Breakdown</h2>
        <span className="text-xs text-muted-foreground font-medium">
          11 May 2026 · Total: 1,245
        </span>
      </div>
      <AttendanceDonutChart />
    </div>
  );
}