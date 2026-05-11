'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const data = [
  { name: 'Present', value: 85, color: 'var(--primary)', count: 1058 },
  { name: 'Excused', value: 10, color: 'var(--accent)', count: 125 },
  { name: 'Unexcused', value: 5, color: 'var(--danger)', count: 62 },
];

const COLORS = ['var(--primary)', 'var(--accent)', 'var(--danger)'];

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: typeof data[0] }[] }) {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="chart-tooltip-card">
        <p className="font-semibold text-foreground">{d.name}</p>
        <p className="text-muted-foreground">{d.value}% — {d.count} students</p>
      </div>
    );
  }
  return null;
}

function CustomLabel({
  cx,
  cy,
}: {
  cx?: number;
  cy?: number;
}) {
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
        85%
      </text>
      <text
        x={cx}
        y={(cy ?? 0) + 14}
        textAnchor="middle"
        fill="var(--muted-foreground)"
        fontSize={11}
        fontFamily="var(--font-plus-jakarta-sans)"
      >
        Overall attendance
      </text>
    </g>
  );
}

export default function AttendanceDonutChart() {
  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={75}
            outerRadius={110}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={CustomLabel as React.FC}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-attendance-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div className="flex flex-col gap-2 w-full mt-2 px-4">
        {data.map((item, idx) => (
          <div key={`legend-attendance-${idx}`} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: COLORS[idx] }}
              />
              <span className="text-sm text-foreground font-medium">{item.name}</span>
            </div>
            <span className="text-sm font-bold font-tabular text-foreground">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}