'use client';
import React, { useState } from 'react';
import { ChevronDown, SlidersHorizontal, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface FilterOption {
  value: string;
  label: string;
}

const yearOptions: FilterOption[] = [
  { value: '25-26', label: 'Year: 25-26' },
  { value: '24-25', label: 'Year: 24-25' },
  { value: '23-24', label: 'Year: 23-24' },
];

const termOptions: FilterOption[] = [
  { value: 'term1', label: 'Term 1' },
  { value: 'term2', label: 'Term 2' },
  { value: 'full-year', label: 'Full Year' },
];

const monthOptions: FilterOption[] = [
  { value: 'september', label: 'September' },
  { value: 'october', label: 'October' },
  { value: 'may', label: 'May' },
];

const subjectOptions: FilterOption[] = [
  { value: 'all', label: 'Subject: All' },
  { value: 'math', label: 'Mathematics' },
  { value: 'literature', label: 'Literature' },
  { value: 'english', label: 'English' },
  { value: 'physics', label: 'Physics' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'history', label: 'History' },
];

function SelectDropdown({ value, options, onChange, className = '' }: { value: string; options: FilterOption[]; onChange: (val: string) => void; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-border rounded-lg pl-3 pr-7 py-1.5 text-xs font-medium text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
      >
        {options.map((opt) => (
          <option key={`opt-${opt.value}`} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={12}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />
    </div>
  );
}

function LockedSelectDropdown({ label }: { label: string }) {
  return (
    <div className="relative">
      <div className="appearance-none bg-muted/30 border border-border rounded-lg pl-3 pr-7 py-1.5 text-xs font-medium text-muted-foreground cursor-not-allowed flex items-center justify-between opacity-80">
        <span>{label}</span>
      </div>
      <Lock
        size={10}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground opacity-70 pointer-events-none"
      />
    </div>
  );
}

export default function FilterBar() {
  const [year, setYear] = useState('25-26');
  const [term, setTerm] = useState('term1');
  const [month, setMonth] = useState('september');
  const [subject, setSubject] = useState('all');

  const handleApply = () => {
    toast.success('Filters applied — dashboard refreshed', {
      description: `${year} · ${term} · ${month} · Class 11A`,
      duration: 3000,
    });
  };

  return (
    <div className="bg-white border border-border rounded-2xl shadow-card px-4 py-3 mb-5 fade-in">
      <div className="flex flex-wrap items-center gap-4">
        {/* Time Period */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-2xs font-600 text-muted-foreground uppercase tracking-wide">
              Time Period
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <SelectDropdown value={year} options={yearOptions} onChange={setYear} />
            <SelectDropdown value={term} options={termOptions} onChange={setTerm} />
            <SelectDropdown value={month} options={monthOptions} onChange={setMonth} />
          </div>
        </div>

        <div className="w-px h-10 bg-border hidden md:block" />

        {/* Academic Scope */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-2xs font-600 text-muted-foreground uppercase tracking-wide">
              Academic Scope
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <LockedSelectDropdown label="Campus: Main" />
            <LockedSelectDropdown label="Grade: 11" />
            <LockedSelectDropdown label="Class: 11A" />
          </div>
        </div>

        <div className="w-px h-10 bg-border hidden md:block" />

        {/* Curriculum */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-2xs font-600 text-muted-foreground uppercase tracking-wide">
              Curriculum
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <LockedSelectDropdown label="Program: IBDP" />
            <SelectDropdown value={subject} options={subjectOptions} onChange={setSubject} />
          </div>
        </div>

        <div className="ml-auto">
          <button
            onClick={handleApply}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white btn-press transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <SlidersHorizontal size={15} />
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}