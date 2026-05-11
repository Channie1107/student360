'use client';

import React, { useState } from 'react';
import { Mail, Search, CheckCircle, XCircle, ChevronUp, ChevronDown, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface ComplianceRow {
  id: string;
  name: string;
  initials: string;
  department: string;
  deptColor: string;
  subject: string;
  grade: string;
  attendanceLogged: boolean;
  attendanceTime: string;
  canvasGrading: number;
  canvasStatus: 'current' | 'overdue' | 'pending';
  lastUpdated: string;
}

const complianceRows: ComplianceRow[] = [
  {
    id: 'cr-001',
    name: 'Dr. Sarah Jenkins',
    initials: 'SJ',
    department: 'Science',
    deptColor: 'bg-blue-100 text-blue-700',
    subject: 'IB Biology HL',
    grade: 'Gr 11–12',
    attendanceLogged: true,
    attendanceTime: '08:15 AM',
    canvasGrading: 80,
    canvasStatus: 'current',
    lastUpdated: '11 May 2026',
  },
  {
    id: 'cr-002',
    name: 'Robert Chen',
    initials: 'RC',
    department: 'Science',
    deptColor: 'bg-blue-100 text-blue-700',
    subject: 'Physics in English',
    grade: 'Gr 10–11',
    attendanceLogged: false,
    attendanceTime: 'Not logged',
    canvasGrading: 92,
    canvasStatus: 'current',
    lastUpdated: '10 May 2026',
  },
  {
    id: 'cr-003',
    name: 'Nguyen Thi Lan',
    initials: 'NL',
    department: 'Mathematics',
    deptColor: 'bg-orange-100 text-orange-700',
    subject: 'IB Mathematics HL',
    grade: 'Gr 11–12',
    attendanceLogged: true,
    attendanceTime: '07:55 AM',
    canvasGrading: 92,
    canvasStatus: 'current',
    lastUpdated: '11 May 2026',
  },
  {
    id: 'cr-004',
    name: 'Pham Van Duc',
    initials: 'PD',
    department: 'Mathematics',
    deptColor: 'bg-orange-100 text-orange-700',
    subject: 'Standard Math Grade 8',
    grade: 'Gr 8',
    attendanceLogged: true,
    attendanceTime: '08:05 AM',
    canvasGrading: 60,
    canvasStatus: 'overdue',
    lastUpdated: '09 May 2026',
  },
  {
    id: 'cr-005',
    name: 'Le Thu Hoa',
    initials: 'LH',
    department: 'English',
    deptColor: 'bg-green-100 text-green-700',
    subject: 'Academic English Grade 10',
    grade: 'Gr 10',
    attendanceLogged: true,
    attendanceTime: '08:00 AM',
    canvasGrading: 75,
    canvasStatus: 'current',
    lastUpdated: '11 May 2026',
  },
  {
    id: 'cr-006',
    name: 'Tran Minh Khoa',
    initials: 'TK',
    department: 'History',
    deptColor: 'bg-amber-100 text-amber-700',
    subject: 'IB History HL',
    grade: 'Gr 11–12',
    attendanceLogged: true,
    attendanceTime: '08:20 AM',
    canvasGrading: 60,
    canvasStatus: 'overdue',
    lastUpdated: '08 May 2026',
  },
  {
    id: 'cr-007',
    name: 'Vo Bich Ngoc',
    initials: 'VN',
    department: 'Vietnamese',
    deptColor: 'bg-red-100 text-red-700',
    subject: 'Vietnamese Literature Gr 9',
    grade: 'Gr 9',
    attendanceLogged: false,
    attendanceTime: 'Not logged',
    canvasGrading: 45,
    canvasStatus: 'overdue',
    lastUpdated: '07 May 2026',
  },
  {
    id: 'cr-008',
    name: 'James Wilson',
    initials: 'JW',
    department: 'Homeroom',
    deptColor: 'bg-purple-100 text-purple-700',
    subject: 'Class 11A Homeroom',
    grade: 'Gr 11',
    attendanceLogged: true,
    attendanceTime: '07:48 AM',
    canvasGrading: 100,
    canvasStatus: 'current',
    lastUpdated: '11 May 2026',
  },
  {
    id: 'cr-009',
    name: 'Dr. Anh Tuan Phan',
    initials: 'AP',
    department: 'Science',
    deptColor: 'bg-blue-100 text-blue-700',
    subject: 'IB Chemistry HL',
    grade: 'Gr 12',
    attendanceLogged: false,
    attendanceTime: 'Not logged',
    canvasGrading: 55,
    canvasStatus: 'pending',
    lastUpdated: '10 May 2026',
  },
  {
    id: 'cr-010',
    name: 'Mai Phuong Thao',
    initials: 'MT',
    department: 'Arts',
    deptColor: 'bg-pink-100 text-pink-700',
    subject: 'Visual Arts Grade 7–8',
    grade: 'Gr 7–8',
    attendanceLogged: true,
    attendanceTime: '08:10 AM',
    canvasGrading: 88,
    canvasStatus: 'current',
    lastUpdated: '11 May 2026',
  },
];

const canvasStatusLabel: Record<string, { label: string; cls: string }> = {
  current: { label: 'Current', cls: 'text-success bg-success-bg' },
  overdue: { label: 'Overdue', cls: 'text-danger bg-danger-bg' },
  pending: { label: 'Pending', cls: 'text-warning bg-warning-bg' },
};

export default function ComplianceDataTable() {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState<'name' | 'canvasGrading'>('canvasGrading');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handleSort = (field: 'name' | 'canvasGrading') => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const filtered = complianceRows
    .filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.subject.toLowerCase().includes(search.toLowerCase());
      const matchDept = filterDept === 'all' || r.department === filterDept;
      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'missing' && !r.attendanceLogged) ||
        (filterStatus === 'logged' && r.attendanceLogged) ||
        (filterStatus === 'overdue' && r.canvasStatus === 'overdue');
      return matchSearch && matchDept && matchStatus;
    })
    .sort((a, b) => {
      if (sortField === 'name') {
        return sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      return sortDir === 'asc'
        ? a.canvasGrading - b.canvasGrading
        : b.canvasGrading - a.canvasGrading;
    });

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedRows(
      selectedRows.length === filtered.length ? [] : filtered.map((r) => r.id)
    );
  };

  const handleRemind = (row: ComplianceRow) => {
    // Backend integration point: POST /api/compliance/remind { teacherId: row.id }
    toast.success(`Auto-reminder sent to ${row.name}`, {
      description: `Attendance log reminder for ${row.subject}`,
      duration: 3000,
    });
  };

  const handleBulkRemind = () => {
    // Backend integration point: POST /api/compliance/remind-bulk { teacherIds: selectedRows }
    toast.success(`Reminders sent to ${selectedRows.length} teachers`, {
      duration: 3000,
    });
    setSelectedRows([]);
  };

  const departments = Array.from(new Set(complianceRows.map((r) => r.department)));

  return (
    <div className="bg-card rounded-2xl shadow-card overflow-hidden mb-5">
      {/* Table Controls */}
      <div className="px-5 py-4 border-b border-border flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search teacher or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-muted-foreground" />
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={`dept-${d}`} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
          >
            <option value="all">All Status</option>
            <option value="logged">Attendance Logged</option>
            <option value="missing">Attendance Missing</option>
            <option value="overdue">Canvas Overdue</option>
          </select>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {filtered.length} of {complianceRows.length} teachers
          </span>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedRows.length > 0 && (
        <div
          className="px-5 py-3 flex items-center gap-3 border-b border-border slide-up"
          style={{ backgroundColor: 'var(--secondary)' }}
        >
          <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
            {selectedRows.length} selected
          </span>
          <button
            onClick={handleBulkRemind}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white btn-press"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <Mail size={13} />
            Send Bulk Reminder
          </button>
          <button
            onClick={() => setSelectedRows([])}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear selection
          </button>
        </div>
      )}

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={selectedRows.length === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  className="rounded"
                />
              </th>
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Teacher
                  {sortField === 'name' ? (
                    sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />
                  ) : (
                    <ChevronDown size={11} className="opacity-30" />
                  )}
                </button>
              </th>
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">
                Department
              </th>
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">
                Subject / Grade
              </th>
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">
                Attendance Input
              </th>
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">
                <button
                  onClick={() => handleSort('canvasGrading')}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Canvas Grading
                  {sortField === 'canvasGrading' ? (
                    sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />
                  ) : (
                    <ChevronDown size={11} className="opacity-30" />
                  )}
                </button>
              </th>
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">
                Last Updated
              </th>
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle size={32} className="text-muted-foreground/30" />
                    <p className="text-sm font-semibold text-muted-foreground">
                      No compliance records match this filter
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Try adjusting the department or status filter above
                    </p>
                  </div>
                </td>
              </tr>
            )}
            {filtered.map((row) => {
              const isSelected = selectedRows.includes(row.id);
              return (
                <tr
                  key={row.id}
                  className={`border-b border-border row-hover transition-colors ${
                    isSelected ? 'bg-secondary/40' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(row.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #7b2db8, #5b1d8d)' }}
                      >
                        {row.initials}
                      </div>
                      <span className="font-medium text-foreground text-sm">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${row.deptColor}`}
                    >
                      {row.department}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-foreground font-medium">{row.subject}</p>
                    <p className="text-2xs text-muted-foreground">{row.grade}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {row.attendanceLogged ? (
                        <CheckCircle size={14} className="text-success flex-shrink-0" />
                      ) : (
                        <XCircle size={14} className="text-danger flex-shrink-0" />
                      )}
                      <div>
                        <span
                          className={`text-xs font-semibold ${
                            row.attendanceLogged ? 'text-success' : 'text-danger'
                          }`}
                        >
                          {row.attendanceLogged ? 'Logged' : 'Missing'}
                        </span>
                        <p className="text-2xs text-muted-foreground">{row.attendanceTime}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1 min-w-[120px]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold font-tabular text-foreground">
                          {row.canvasGrading}%
                        </span>
                        <span
                          className={`text-2xs font-semibold px-1.5 py-0.5 rounded-full ${
                            canvasStatusLabel[row.canvasStatus].cls
                          }`}
                        >
                          {canvasStatusLabel[row.canvasStatus].label}
                        </span>
                      </div>
                      <div className="compliance-progress-track">
                        <div
                          className="compliance-progress-fill"
                          style={{
                            width: `${row.canvasGrading}%`,
                            backgroundColor:
                              row.canvasStatus === 'overdue' ?'var(--danger)'
                                : row.canvasStatus === 'pending' ?'var(--warning)' :'var(--primary)',
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground">{row.lastUpdated}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleRemind(row)}
                      className="p-1.5 rounded-lg borderborder-border hover:bg-muted hover:border-primary/30 transition-all btn-press"
                      title={`Send attendance reminder to ${row.name}`}
                    >
                      <Mail size={14} className="text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-5 py-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Showing {filtered.length} of {complianceRows.length} records
        </span>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((page) => (
            <button
              key={`page-${page}`}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                page === 1
                  ? 'text-white' :'text-muted-foreground hover:bg-muted'
              }`}
              style={page === 1 ? { backgroundColor: 'var(--primary)' } : {}}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}