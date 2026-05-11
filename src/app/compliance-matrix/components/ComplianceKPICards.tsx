import React from 'react';
import { CheckCircle, UserX, BookX } from 'lucide-react';

const cards = [
  {
    id: 'ckpi-submission',
    icon: CheckCircle,
    iconBg: 'bg-success-bg',
    iconColor: 'text-success',
    label: 'Overall Submission Rate',
    value: '88%',
    subtext: '22 of 25 teachers logged today',
    variant: 'normal',
  },
  {
    id: 'ckpi-missing',
    icon: UserX,
    iconBg: 'bg-danger-bg',
    iconColor: 'text-danger',
    label: 'Missing Teachers',
    value: '3',
    subtext: 'Have not logged attendance today',
    variant: 'alert',
  },
  {
    id: 'ckpi-overdue',
    icon: BookX,
    iconBg: 'bg-warning-bg',
    iconColor: 'text-warning',
    label: 'Overdue Canvas Courses',
    value: '5',
    subtext: 'Grading not submitted > 48 hrs',
    variant: 'warning',
  },
];

const variantBorder: Record<string, string> = {
  normal: 'border-transparent',
  alert: 'border-danger/30',
  warning: 'border-warning/30',
};

const variantBg: Record<string, string> = {
  normal: 'bg-card',
  alert: 'bg-danger-bg/30',
  warning: 'bg-warning-bg/30',
};

export default function ComplianceKPICards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`rounded-2xl shadow-card p-4 border card-hover ${variantBorder[card.variant]} ${variantBg[card.variant]}`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
              <card.icon size={20} className={card.iconColor} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-600 text-muted-foreground uppercase tracking-wide mb-1">
                {card.label}
              </p>
              <p
                className="font-bold font-tabular leading-none mb-1"
                style={{ fontSize: '1.75rem', color: 'var(--foreground)' }}
              >
                {card.value}
              </p>
              <p className="text-xs text-muted-foreground">{card.subtext}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}