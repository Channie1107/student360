'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

import { useSchoolData } from '@/hooks/useSchoolData';

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip-card min-w-[160px]">
      <p className="font-semibold mb-1 text-foreground">{label}</p>
      {payload.map((p) => (
        <div key={`tt-gpa-${p.name}`} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: p.color }} />
            <span className="text-muted-foreground text-sm">{p.name}</span>
          </div>
          <span className="font-bold font-tabular text-foreground">{p.value.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

export default function GPABarChartInner() {
  const { students, role, teacherContext } = useSchoolData();

  // Calculate dynamic averages per subject
  const subjectMap = new Map<string, { total: number, count: number }>();
  students.forEach(s => {
    s.subjects.forEach(sub => {
      // Map score (0-100) back to GPA scale roughly for display
      const gpaValue = Math.max(0, Math.min(4.0, (sub.score / 100) * 4.0));
      if (!subjectMap.has(sub.name)) {
        subjectMap.set(sub.name, { total: 0, count: 0 });
      }
      subjectMap.get(sub.name)!.total += gpaValue;
      subjectMap.get(sub.name)!.count += 1;
    });
  });

  const chartData = Array.from(subjectMap.entries()).map(([name, data]) => {
    const avg = data.total / data.count;
    return {
      subject: name.replace(' HL', '').replace(' SL', ''), // Shorten names
      primaryValue: Number(avg.toFixed(2)),
      benchmarkValue: Number((avg - (Math.random() * 0.4 - 0.2)).toFixed(2)), // Mock benchmark based on avg
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} barCategoryGap="30%" barGap={4} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(91,29,141,0.04)' }} />
        <Legend 
          iconType="square" 
          iconSize={10} 
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }} 
          formatter={(value) => <span className="text-foreground font-medium">{value}</span>}
        />
        <ReferenceLine y={2.0} stroke="#ff4d4f" strokeDasharray="5 3" strokeWidth={1.5} />
        <Bar dataKey="primaryValue" name={role === 'principal' ? 'School Avg' : `Class ${teacherContext?.classId}`} fill="var(--primary)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="benchmarkValue" name={role === 'principal' ? 'Region Avg' : `Grade ${teacherContext?.gradeId} Avg`} fill="var(--accent)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
