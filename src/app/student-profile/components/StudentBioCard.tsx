import React from 'react';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  Calendar,
  Home,
  BookOpen,
  Star,
  Clock,
  ShieldCheck,
} from 'lucide-react';

const bioFields = [
  { id: 'bio-dob', icon: Calendar, label: 'Date of Birth', value: '14 March 2008' },
  { id: 'bio-homeroom', icon: Home, label: 'Homeroom Teacher', value: 'James Wilson' },
  { id: 'bio-track', icon: BookOpen, label: 'Programme', value: 'IBDP Track' },
  { id: 'bio-gpa', icon: Star, label: 'Cumulative GPA', value: '3.85 / 4.00' },
  { id: 'bio-attendance', icon: Clock, label: 'Attendance Rate', value: '98.0%' },
  { id: 'bio-demerits', icon: ShieldCheck, label: 'Demerits', value: '0 (Clean Record)' },
];

export default function StudentBioCard() {
  return (
    <div
      className="rounded-2xl shadow-card p-5 mb-5 fade-in"
      style={{ backgroundColor: 'var(--primary)' }}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl border-2"
            style={{ background: 'linear-gradient(135deg, #9b3dd8, #5b1d8d)', borderColor: 'rgba(255,217,0,0.5)' }}
          >
            EH
          </div>
        </div>
        {/* Name & ID */}
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h2 className="text-xl font-bold text-white">Evelyn Harper</h2>
            <StatusBadge variant="success" dot>Active</StatusBadge>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(255,217,0,0.2)', color: 'var(--accent)' }}
            >
              PRE43178
            </span>
          </div>
          <div className="flex items-center gap-3 text-white/70 text-sm flex-wrap">
            <span>Grade 11</span>
            <span>·</span>
            <span>Class 11A</span>
            <span>·</span>
            <span>Academic Year 2025–26</span>
          </div>
        </div>
      </div>
      {/* Bio fields grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5">
        {bioFields?.map((field) => (
          <div
            key={field?.id}
            className="rounded-xl p-3"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <field.icon size={13} className="text-white/60 flex-shrink-0" />
              <span className="text-2xs text-white/60 font-medium uppercase tracking-wide">
                {field?.label}
              </span>
            </div>
            <p className="text-sm font-semibold text-white">{field?.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}