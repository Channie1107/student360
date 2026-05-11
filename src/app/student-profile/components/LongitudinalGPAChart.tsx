'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,  } from 'recharts';

const gpaHistory = [
  { grade: 'Grade 8', gpa: 3.55, benchmark: 3.5 },
  { grade: 'Grade 9', gpa: 3.62, benchmark: 3.5 },
  { grade: 'Grade 10', gpa: 3.74, benchmark: 3.5 },
  { grade: 'Grade 11 T1', gpa: 3.85, benchmark: 3.5 },
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
          <div key={`lga-tt-${i}`} className="flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-xs text-muted-foreground">
              GPA: <strong className="text-foreground">{p.value}</strong>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function LongitudinalGPAChart() {
  return (
    <div className="bg-card rounded-2xl shadow-card p-5 card-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground">Longitudinal GPA — Grades 8–11</h3>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}
        >
          IBDP Track
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={gpaHistory}
          margin={{ top: 4, right: 16, bottom: 0, left: -20 }}
        >
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="grade"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-plus-jakarta-sans)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[3.0, 4.0]}
            ticks={[3.0, 3.25, 3.5, 3.75, 4.0]}
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
              value: 'Benchmark',
              position: 'insideTopRight',
              fontSize: 10,
              fill: 'var(--muted-foreground)',
              fontFamily: 'var(--font-plus-jakarta-sans)',
            }}
          />
          <Line
            type="monotone"
            dataKey="gpa"
            stroke="var(--primary)"
            strokeWidth={2.5}
            dot={{ fill: 'var(--primary)', r: 5, strokeWidth: 2, stroke: 'white' }}
            activeDot={{ r: 7, fill: 'var(--primary)' }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-3 flex items-center justify-between px-2">
        <div className="text-xs text-muted-foreground">
          Starting GPA: <span className="font-semibold text-foreground">3.55</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Current GPA:{' '}
          <span className="font-bold text-success text-sm">3.85</span>
          <span className="text-success ml-1">▲ +0.30</span>
        </div>
      </div>
    </div>
  );
}