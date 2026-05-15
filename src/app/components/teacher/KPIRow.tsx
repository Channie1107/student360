import React from 'react';
import { TrendingUp, TrendingDown, Minus, Check } from 'lucide-react';

import { useSchoolData } from '@/hooks/useSchoolData';

function TrendIndicator({
  direction,
  positive,
  value,
  showIcon = true,
}: {
  direction: 'up' | 'down' | 'flat' | 'check';
  positive: boolean;
  value: string;
  showIcon?: boolean;
}) {
  const color = direction === 'flat' ? 'text-muted-foreground' : positive ? 'text-success' : 'text-danger';
  return (
    <div className={`flex items-center gap-1 text-sm font-semibold ${color}`}>
      {showIcon && direction === 'up' && <TrendingUp size={14} />}
      {showIcon && direction === 'down' && <TrendingDown size={14} />}
      {showIcon && direction === 'flat' && <Minus size={14} />}
      {showIcon && direction === 'check' && <Check size={14} />}
      <span>{value}</span>
    </div>
  );
}

export default function KPIRow() {
  const { stats, role } = useSchoolData();

  const KPI_CARDS = [
    {
      id: 'kpi-attendance',
      title: role === 'principal' ? 'School Avg Attendance' : 'Class Avg Attendance',
      value: `${stats.avgAttendance}%`,
      badge: '+1.2%',
      trendDirection: 'up' as const,
      trendPositive: true,
    },
    {
      id: 'kpi-gpa',
      title: role === 'principal' ? 'School Average GPA' : 'Class Average GPA',
      value: stats.avgGpa.toString(),
      valueSub: '/ 4.0',
      badge: '+0.05',
      trendDirection: 'up' as const,
      trendPositive: true,
    },
    {
      id: 'kpi-students',
      title: 'Total Students',
      value: stats.total.toString(),
      badge: 'Active',
      trendDirection: 'check' as const,
      trendPositive: true,
    },
    {
      id: 'kpi-discipline',
      title: 'Students At Risk',
      value: `${stats.atRiskCount} Flags`,
      badge: stats.atRiskCount > 0 ? 'Needs Attention' : 'Excellent',
      trendDirection: stats.atRiskCount > 0 ? 'down' : 'check' as const,
      trendPositive: stats.atRiskCount === 0,
      showTrendIcon: stats.atRiskCount === 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {KPI_CARDS.map((card) => (
        <div key={card.id} className="bg-card rounded-2xl shadow-card p-4 card-hover flex flex-col gap-2">
          <span
            className="text-xs font-600 uppercase tracking-wide"
            style={{ color: 'var(--muted-foreground)', letterSpacing: '0.05em' }}
          >
            {card.title}
          </span>
          <div className="flex items-baseline gap-1">
            <span
              className="font-bold font-tabular leading-none"
              style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', color: 'var(--foreground)' }}
            >
              {card.value}
            </span>
            {card.valueSub && <span className="text-base font-semibold text-muted-foreground">{card.valueSub}</span>}
          </div>
          <TrendIndicator
            direction={card.trendDirection}
            positive={card.trendPositive}
            value={card.badge}
            showIcon={card.showTrendIcon ?? true}
          />
        </div>
      ))}
    </div>
  );
}
