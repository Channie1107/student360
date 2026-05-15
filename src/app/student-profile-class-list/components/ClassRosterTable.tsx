'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { Mail, User, X, Phone, Mail as MailIcon, ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { useSchoolData } from '@/hooks/useSchoolData';
import { DBStudent } from '@/lib/mockDatabase';

interface ClassRosterTableProps {
  search: string;
  onSearchChange: (v: string) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

type SortKey = 'gpa' | 'attendance' | 'status';
type SortDirection = 'asc' | 'desc';

const getStatusColor = (status: string) => {
  if (status === 'On Track') return 'text-success';
  if (status === 'Monitor' || status === 'Watch') return 'text-yellow-500';
  if (status === 'At Risk') return 'text-orange-500';
  if (status === 'Critical') return 'text-danger';
  return 'text-foreground';
};



export default function ClassRosterTable({ search, onSearchChange, selectedId, onSelect }: ClassRosterTableProps) {
  const { students, role, teacherContext } = useSchoolData();
  const [selectedParent, setSelectedParent] = useState<DBStudent | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('gpa');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;

    if (sortKey === 'gpa') {
      return (a.gpa - b.gpa) * multiplier;
    }

    if (sortKey === 'attendance') {
      return (a.attendance - b.attendance) * multiplier;
    }

    return a.status.localeCompare(b.status) * multiplier;
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortKey(key);
    setSortDirection(key === 'status' ? 'asc' : 'desc');
  };

  const SortHeader = ({
    label,
    keyName,
    alignClass = 'text-left',
  }: {
    label: string;
    keyName: SortKey;
    alignClass?: string;
  }) => {
    const active = sortKey === keyName;
    return (
      <button
        type="button"
        onClick={() => toggleSort(keyName)}
        className={`inline-flex items-center gap-1 font-semibold text-muted-foreground text-xs uppercase tracking-wide transition-colors hover:text-foreground ${alignClass}`}
      >
        <span>{label}</span>
        {active ? (
          sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
        ) : (
          <ArrowUpDown size={14} />
        )}
      </button>
    );
  };

  return (
    <div className="section-card p-0 overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold text-foreground">
              {role === 'principal' ? 'School-wide Roster' : `Class ${teacherContext?.classId} Roster`}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} students enrolled</p>
          </div>
          <span className="badge-primary">{filtered.length} Students</span>
        </div>
        <div className="relative">
          <Icon name="MagnifyingGlassIcon" size={15} variant="outline" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or student ID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-y-auto scroll-thin" style={{ maxHeight: 'calc(100vh - 280px)' }}>
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-background z-10">
            <tr className="border-b border-border">
              <th className="text-left px-5 py-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Student</th>
              <th className="text-left px-3 py-2.5">
                <SortHeader label="GPA" keyName="gpa" />
              </th>
              <th className="text-left px-3 py-2.5">
                <SortHeader label="Att." keyName="attendance" />
              </th>
              <th className="text-left px-3 py-2.5">
                <SortHeader label="Status" keyName="status" />
              </th>
              <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-muted-foreground text-sm">
                  No students match your search
                </td>
              </tr>
            )}
            {sorted.map((s) => (
              <tr
                key={s.studentId}
                onClick={() => onSelect(s.studentId)}
                className={`table-row-hover border-b border-border last:border-0 transition-all cursor-pointer ${selectedId === s.studentId ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0" style={{ background: s.avatarBg }}>{s.initials}</div>
                    <div>
                      <p className="font-semibold text-foreground text-sm leading-tight">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.studentId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className={`font-bold font-tabular text-sm ${getStatusColor(s.status)}`}>
                    {s.gpa.toFixed(2)}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className={`font-tabular text-sm font-semibold ${getStatusColor(s.status)}`}>
                    {s.attendance}%
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className={`text-xs font-semibold ${getStatusColor(s.status)}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); onSelect(s.studentId); }}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted hover:border-primary/30 text-muted-foreground hover:text-primary transition-all btn-press"
                      title="View student profile"
                    >
                      <User size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedParent(s); }}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted hover:border-primary/30 text-muted-foreground hover:text-primary transition-all btn-press"
                      title="Contact parent"
                    >
                      <Mail size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Parent Contact Modal */}
      {selectedParent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm fade-in p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedParent(null)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-1">Contact Parent</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Parent/Guardian information for <span className="font-semibold text-foreground">{selectedParent.name}</span>
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/30">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Parent Name</p>
                    <p className="font-medium text-foreground">{selectedParent.parentName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/30">
                  <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone Number</p>
                    <p className="font-medium text-foreground">{selectedParent.parentPhone}</p>
                  </div>
                  <button className="px-3 py-1.5 text-xs font-semibold bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
                    Call
                  </button>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/30">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <MailIcon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email Address</p>
                    <p className="font-medium text-foreground truncate max-w-[180px]">{selectedParent.parentEmail}</p>
                  </div>
                  <button className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
