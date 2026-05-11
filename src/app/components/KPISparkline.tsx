'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface KPISparklineProps {
  data: number[];
  positive: boolean;
}

export default function KPISparkline({ data, positive }: KPISparklineProps) {
  const chartData = data.map((v, i) => ({ i, v }));
  const color = positive ? 'var(--primary)' : 'var(--danger)';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`spark-grad-${positive}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip
          content={() => null}
        />
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#spark-grad-${positive})`}
          dot={false}
          activeDot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}