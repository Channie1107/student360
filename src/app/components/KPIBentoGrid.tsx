'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const KPISparkline = dynamic(() => import('./KPISparkline'), { ssr: false });

interface KPICardData {
  id: string;
  label: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'flat';
  trendPositive: boolean;
  sparklineData: number[];
  accentColor: string;
}

const kpiCards: KPICardData[] = [
  {
    id: 'kpi-enrollment',
    label: 'Enrollment',
    value: '1,245',
    trend: '+5.2%',
    trendDirection: 'up',
    trendPositive: true,
    sparklineData: [1080, 1100, 1120, 1145, 1170, 1190, 1210, 1230, 1245],
    accentColor: 'var(--primary)',
  },
  {
    id: 'kpi-attendance',
    label: 'Attendance Rate',
    value: '96.5%',
    trend: '-1.2%',
    trendDirection: 'down',
    trendPositive: false,
    sparklineData: [97.8, 97.5, 97.2, 97.0, 96.8, 97.1, 96.9, 96.7, 96.5],
    accentColor: 'var(--primary)',
  },
  {
    id: 'kpi-compliance',
    label: 'Teacher Compliance',
    value: '82%',
    trend: '+5.2%',
    trendDirection: 'up',
    trendPositive: true,
    sparklineData: [72, 74, 76, 77, 78, 79, 80, 81, 82],
    accentColor: 'var(--primary)',
  },
  {
    id: 'kpi-gpa',
    label: 'Average GPA',
    value: '3.42',
    trend: 'Flat',
    trendDirection: 'flat',
    trendPositive: true,
    sparklineData: [3.38, 3.40, 3.39, 3.41, 3.40, 3.42, 3.41, 3.43, 3.42],
    accentColor: 'var(--primary)',
  },
];

function TrendIndicator({
  direction,
  positive,
  value,
}: {
  direction: 'up' | 'down' | 'flat';
  positive: boolean;
  value: string;
}) {
  const color = direction === 'flat' ? 'text-muted-foreground' : positive ? 'text-success' : 'text-danger';
  return (
    <div className={`flex items-center gap-1 text-sm font-semibold ${color}`}>
      {direction === 'up' && <TrendingUp size={14} />}
      {direction === 'down' && <TrendingDown size={14} />}
      {direction === 'flat' && <Minus size={14} />}
      <span>{value}</span>
    </div>
  );
}

export default function KPIBentoGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiCards.map((card) => (
        <div
          key={card.id}
          className="bg-card rounded-2xl shadow-card p-4 card-hover flex flex-col gap-2"
        >
          <span
            className="text-xs font-600 uppercase tracking-wide"
            style={{ color: 'var(--muted-foreground)', letterSpacing: '0.05em' }}
          >
            {card.label}
          </span>
          <div
            className="font-bold font-tabular leading-none"
            style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', color: 'var(--foreground)' }}
          >
            {card.value}
          </div>
          <TrendIndicator
            direction={card.trendDirection}
            positive={card.trendPositive}
            value={card.trend}
          />
          <div className="mt-1 h-12">
            <KPISparkline data={card.sparklineData} positive={card.trendPositive} />
          </div>
        </div>
      ))}
    </div>
  );
}