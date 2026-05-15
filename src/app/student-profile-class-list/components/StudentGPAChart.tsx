'use client';
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell } from 'recharts';

interface GPAPoint { term: string; gpa: number }

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-elevated text-sm">
      <p className="font-semibold">{label}</p>
      <p className="text-primary font-bold font-tabular">GPA: {payload[0].value.toFixed(2)}</p>
    </div>
  );
}

export default function StudentGPAChart({ data }: { data: GPAPoint[] }) {
  return (
    <div style={{ height: 160 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 8, left: -20, bottom: 0 }} barSize={40}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="term" tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontWeight: 500 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 4.0]} ticks={[0, 1.0, 2.0, 3.0, 4.0]} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.4 }} />
          <ReferenceLine y={2.0} stroke="#ff4d4f" strokeDasharray="4 3" strokeWidth={1.5} />
          <Bar dataKey="gpa" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === data.length - 1 ? 'var(--primary)' : 'var(--accent)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}