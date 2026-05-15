'use client';
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface AttPoint { month: string; rate: number }

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-elevated text-sm">
      <p className="font-semibold">{label}</p>
      <p className="font-bold font-tabular" style={{ color: '#ffd900' }}>Attendance: {payload[0].value}%</p>
    </div>
  );
}

export default function StudentAttendanceChart({ data }: { data: AttPoint[] }) {
  return (
    <div style={{ height: 140 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffd900" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#ffd900" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
          <YAxis domain={[60, 100]} ticks={[60, 70, 80, 90, 100]} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="rate" stroke="#ffd900" strokeWidth={2.5} fill="url(#attGrad)" dot={{ fill: '#ffd900', r: 3 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}