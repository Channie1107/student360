'use client';

import React, { useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

import { useSchoolData } from '@/hooks/useSchoolData';
import { MockDB } from '@/lib/mockDatabase';

interface FilterOption {
  value: string;
  label: string;
}

const yearOptions: FilterOption[] = [
  { value: '25-26', label: 'Year: 25-26' },
  { value: '24-25', label: 'Year: 24-25' },
];

const termOptions: FilterOption[] = [
  { value: 'term1', label: 'Term 1' },
  { value: 'term2', label: 'Term 2' },
];

const gradeOptions: FilterOption[] = [
  { value: 'All', label: 'Grade: All' },
  { value: '1', label: 'Grade 1' },
  { value: '2', label: 'Grade 2' },
  { value: '3', label: 'Grade 3' },
  { value: '4', label: 'Grade 4' },
  { value: '5', label: 'Grade 5' },
  { value: '6', label: 'Grade 6' },
  { value: '7', label: 'Grade 7' },
  { value: '8', label: 'Grade 8' },
  { value: '9', label: 'Grade 9' },
  { value: '10', label: 'Grade 10' },
  { value: '11', label: 'Grade 11' },
  { value: '12', label: 'Grade 12' },
];

const classOptions: FilterOption[] = [
  { value: 'All', label: 'Class: All' },
  ...MockDB.classes.map((classId) => ({ value: classId, label: `Class ${classId}` })),
];

const programOptions: FilterOption[] = [
  { value: 'standard-ibdp', label: 'Standard & IBDP' },
  { value: 'standard', label: 'Standard' },
  { value: 'ibdp', label: 'IBDP Only' },
];

const subjectOptions: FilterOption[] = [
  { value: 'all', label: 'Subject: All' },
  { value: 'math', label: 'Mathematics' },
  { value: 'science', label: 'Science' },
  { value: 'english', label: 'English' },
  { value: 'history', label: 'History' },
];

interface SelectDropdownProps {
  value: string;
  options: FilterOption[];
  onChange: (val: string) => void;
  className?: string;
}

function SelectDropdown({ value, options, onChange, className = '' }: SelectDropdownProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-full border border-border bg-white px-4 py-2.5 pr-10 text-sm font-medium text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
}

export default function PrincipalFilterBar() {
  const { selectedGrade, setSelectedGrade, selectedClass, setSelectedClass, academicYear, setAcademicYear } = useSchoolData();
  const [term, setTerm] = useState('term1');
  const [program, setProgram] = useState('standard-ibdp');
  const [subject, setSubject] = useState('all');

  const handleReset = () => {
    setAcademicYear('25-26');
    setSelectedGrade('All');
    setSelectedClass('All');
    setTerm('term1');
    setProgram('standard-ibdp');
    setSubject('all');
    toast.success('Filters reset');
  };

  const handleApply = () => {
    toast.success('Filters applied', {
      description: `${academicYear} · Grade ${selectedGrade}`,
      duration: 2500,
    });
  };

  return (
    <div className="mb-5 rounded-2xl border border-border bg-white px-4 py-4 shadow-card fade-in">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-2xs font-semibold uppercase tracking-wide text-muted-foreground">Time Period</span>
          <div className="flex flex-wrap items-center gap-2">
            <SelectDropdown value={academicYear} options={yearOptions} onChange={setAcademicYear} />
            <SelectDropdown value={term} options={termOptions} onChange={setTerm} />
          </div>
        </div>

        <div className="h-10 w-px bg-border hidden md:block" />

        <div className="flex flex-col gap-1">
          <span className="text-2xs font-semibold uppercase tracking-wide text-muted-foreground">Academic Scope</span>
          <div className="flex flex-wrap items-center gap-2">
            <SelectDropdown value={selectedGrade} options={gradeOptions} onChange={setSelectedGrade} />
            <SelectDropdown value={selectedClass} options={classOptions} onChange={setSelectedClass} />
          </div>
        </div>

        <div className="h-10 w-px bg-border hidden md:block" />

        <div className="flex flex-col gap-1">
          <span className="text-2xs font-semibold uppercase tracking-wide text-muted-foreground">Curriculum</span>
          <div className="flex flex-wrap items-center gap-2">
            <SelectDropdown value={program} options={programOptions} onChange={setProgram} />
            <SelectDropdown value={subject} options={subjectOptions} onChange={setSubject} />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted btn-press"
          >
            Reset Filter
          </button>
          <button
            onClick={handleApply}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 btn-press"
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
