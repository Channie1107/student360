'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const gpaData = [
  { grade: 'Gr 1', term1: 3.5, term2: 3.3 },
  { grade: 'Gr 2', term1: 3.2, term2: 3.4 },
  { grade: 'Gr 3', term1: 3.4, term2: 3.6 },
  { grade: 'Gr 4', term1: 3.7, term2: 3.5 },
  { grade: 'Gr 5', term1: 3.6, term2: 3.8 },
  { grade: 'Gr 6', term1: 3.1, term2: 3.3 },
  { grade: 'Gr 7', term1: 3.3, term2: 3.0 },
  { grade: 'Gr 8', term1: 3.5, term2: 3.4 },
  { grade: 'Gr 9', term1: 3.8, term2: 3.7 },
  { grade: 'Gr 10', term1: 3.6, term2: 3.9 },
  { grade: 'Gr 11', term1: 3.4, term2: 2.9 },
  { grade: 'Gr 12', term1: 3.2, term2: 3.1 },
];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip-card">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        {payload.map((p, i) => (
          <div key={`gpa-tt-${i}`} className="flex items-center gap-2">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-muted-foreground text-xs">
              {p.name}: <strong className="text-foreground">{p.value}</strong>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function GPABarChartInner() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={gpaData}
        margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
        barCategoryGap="25%"
        barGap={2}
      >
        <CartesianGrid
          stroke="var(--border)"
          strokeDasharray="3 3"
          vertical={false}
        />
        <XAxis
          dataKey="grade"
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-plus-jakarta-sans)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 4.5]}
          ticks={[0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5]}
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-plus-jakarta-sans)' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine
          y={3.5}
          stroke="var(--muted-foreground)"
          strokeDasharray="4 4"
          strokeWidth={1.5}
          label={{
            value: 'Benchmark 3.5',
            position: 'right',
            fontSize: 10,
            fill: 'var(--muted-foreground)',
            fontFamily: 'var(--font-plus-jakarta-sans)',
          }}
        />
        <Bar dataKey="term1" name="Term 1" fill="var(--primary)" radius={[3, 3, 0, 0]} />
        <Bar dataKey="term2" name="Term 2" fill="var(--accent)" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}