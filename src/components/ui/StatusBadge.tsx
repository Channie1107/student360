import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'yellow' | 'neutral';

interface StatusBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  danger: 'bg-danger-bg text-danger',
  info: 'bg-info-bg text-info',
  purple: 'bg-secondary text-primary',
  yellow: 'text-accent-foreground',
  neutral: 'bg-muted text-muted-foreground',
};

const dotColors: Record<BadgeVariant, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
  purple: 'bg-primary',
  yellow: 'bg-accent',
  neutral: 'bg-muted-foreground',
};

export default function StatusBadge({
  variant,
  children,
  size = 'sm',
  dot = false,
}: StatusBadgeProps) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';
  const yellowExtra = variant === 'yellow' ? 'bg-accent/20' : '';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClass} ${variantStyles[variant]} ${yellowExtra}`}
    >
      {dot && (
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[variant]}`}
        />
      )}
      {children}
    </span>
  );
}