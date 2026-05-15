'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { useSchoolData } from '@/hooks/useSchoolData';

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip-card">
      <p className="font-semibold text-foreground">{payload[0].name}</p>
      <p className="text-muted-foreground">{payload[0].value}%</p>
    </div>
  );
}

function CustomLabel({ cx, cy, presentPct, totalStudents }: { cx?: number; cy?: number; presentPct: number, totalStudents: number }) {
  return (
    <g>
      <text
        x={cx}
        y={(cy ?? 0) - 8}
        textAnchor="middle"
        fill="var(--primary)"
        fontSize={28}
        fontWeight={700}
        fontFamily="var(--font-plus-jakarta-sans)"
      >
        {presentPct}%
      </text>
      <text
        x={cx}
        y={(cy ?? 0) + 14}
        textAnchor="middle"
        fill="var(--muted-foreground)"
        fontSize={11}
        fontFamily="var(--font-plus-jakarta-sans)"
      >
        Present
      </text>
      <text
        x={cx}
        y={(cy ?? 0) + 26}
        textAnchor="middle"
        fill="var(--muted-foreground)"
        fontSize={9}
        fontFamily="var(--font-plus-jakarta-sans)"
      >
        {totalStudents} Students
      </text>
    </g>
  );
}

export default function AttendanceDonutChart() {
  const { stats, students } = useSchoolData();
  const presentPct = stats.avgAttendance;
  const missingPct = 100 - presentPct;
  
  let totalExcused = 0;
  let totalUnexcused = 0;
  students.forEach(s => {
    totalExcused += s.excusedAbsences;
    totalUnexcused += s.unexcusedAbsences;
  });
  
  const totalMissingDays = totalExcused + totalUnexcused;
  let excusedPct = 0;
  let unexcusedPct = 0;
  if (totalMissingDays > 0) {
    excusedPct = Number(((totalExcused / totalMissingDays) * missingPct).toFixed(1));
    unexcusedPct = Number((missingPct - excusedPct).toFixed(1));
  } else {
    excusedPct = missingPct;
  }

  const chartData = [
    { name: 'Present', value: presentPct, color: 'var(--primary)' },
    { name: 'Excused Leave', value: excusedPct, color: 'var(--accent)' },
    { name: 'Unexcused Absence', value: unexcusedPct, color: 'var(--danger)' },
  ];

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={72}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
            labelLine={false}
            label={(props) => <CustomLabel {...props} presentPct={presentPct} totalStudents={stats.total} />}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-donut-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-col gap-2 w-full mt-4 px-2">
        {chartData.map((d) => (
          <div key={`legend-donut-${d.name}`} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-sm text-foreground font-medium">{d.name}</span>
            </div>
            <span className="text-sm font-bold font-tabular text-foreground">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
