'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle, XCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface TeacherRecord {
  id: string;
  name: string;
  initials: string;
  department: string;
  deptColor: string;
  attendanceLogged: boolean;
  attendanceNote: string;
  canvasGrading: number;
  totalAssignments: number;
}

const teacherData: TeacherRecord[] = [
  {
    id: 'teacher-001',
    name: 'Dr. Sarah Jenkins',
    initials: 'SJ',
    department: 'Science',
    deptColor: 'bg-blue-100 text-blue-700',
    attendanceLogged: true,
    attendanceNote: 'Logged 8:15 AM',
    canvasGrading: 80,
    totalAssignments: 25,
  },
  {
    id: 'teacher-002',
    name: 'Robert Chen',
    initials: 'RC',
    department: 'Science',
    deptColor: 'bg-blue-100 text-blue-700',
    attendanceLogged: false,
    attendanceNote: 'Missing 12:30 PM',
    canvasGrading: 92,
    totalAssignments: 24,
  },
  {
    id: 'teacher-003',
    name: 'Nguyen Thi Lan',
    initials: 'NL',
    department: 'Mathematics',
    deptColor: 'bg-orange-100 text-orange-700',
    attendanceLogged: true,
    attendanceNote: 'Logged 7:55 AM',
    canvasGrading: 92,
    totalAssignments: 30,
  },
  {
    id: 'teacher-004',
    name: 'Dr. Sarah Jenkins',
    initials: 'SJ',
    department: 'History',
    deptColor: 'bg-amber-100 text-amber-700',
    attendanceLogged: false,
    attendanceNote: 'Missing 12:30 PM',
    canvasGrading: 92,
    totalAssignments: 22,
  },
  {
    id: 'teacher-005',
    name: 'Pham Van Duc',
    initials: 'PD',
    department: 'Mathematics',
    deptColor: 'bg-orange-100 text-orange-700',
    attendanceLogged: true,
    attendanceNote: 'Logged 8:05 AM',
    canvasGrading: 60,
    totalAssignments: 18,
  },
  {
    id: 'teacher-006',
    name: 'Dr. Sarah Jenkins',
    initials: 'SJ',
    department: 'Science',
    deptColor: 'bg-blue-100 text-blue-700',
    attendanceLogged: false,
    attendanceNote: 'Missing 12:30 PM',
    canvasGrading: 83,
    totalAssignments: 28,
  },
  {
    id: 'teacher-007',
    name: 'Tran Minh Khoa',
    initials: 'TK',
    department: 'History',
    deptColor: 'bg-amber-100 text-amber-700',
    attendanceLogged: true,
    attendanceNote: 'Logged 8:20 AM',
    canvasGrading: 60,
    totalAssignments: 20,
  },
  {
    id: 'teacher-008',
    name: 'Le Thu Hoa',
    initials: 'LH',
    department: 'English',
    deptColor: 'bg-green-100 text-green-700',
    attendanceLogged: true,
    attendanceNote: 'Logged 8:00 AM',
    canvasGrading: 75,
    totalAssignments: 32,
  },
];

export default function TeacherComplianceTable() {
  const [sortField, setSortField] = useState<'name' | 'canvasGrading'>('canvasGrading');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: 'name' | 'canvasGrading') => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sorted = [...teacherData].sort((a, b) => {
    if (sortField === 'name') {
      return sortDir === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    return sortDir === 'asc'
      ? a.canvasGrading - b.canvasGrading
      : b.canvasGrading - a.canvasGrading;
  });

  const handleRemind = (teacher: TeacherRecord) => {
    // Backend integration point: POST /api/compliance/remind { teacherId: teacher.id }
    toast.success(`Auto-reminder sent to ${teacher.name}`, {
      description: 'Attendance log reminder delivered via email',
      duration: 3000,
    });
  };

  return (
    <div className="bg-card rounded-2xl shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">Teacher Compliance Matrix</h2>
        <span className="text-xs text-muted-foreground">
          Deadline: 12:30 PM daily
        </span>
      </div>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">
                <button
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                  onClick={() => handleSort('name')}
                >
                  Teacher
                  {sortField === 'name' ? (
                    sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                  ) : (
                    <ChevronDown size={12} className="opacity-30" />
                  )}
                </button>
              </th>
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">
                Department
              </th>
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">
                Attendance Input
              </th>
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">
                <button
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                  onClick={() => handleSort('canvasGrading')}
                >
                  Canvas Grading
                  {sortField === 'canvasGrading' ? (
                    sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                  ) : (
                    <ChevronDown size={12} className="opacity-30" />
                  )}
                </button>
              </th>
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((teacher) => (
              <tr
                key={teacher.id}
                className="border-b border-border row-hover"
              >
                {/* Teacher */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #7b2db8, #5b1d8d)' }}
                    >
                      {teacher.initials}
                    </div>
                    <span className="font-medium text-foreground text-sm">{teacher.name}</span>
                  </div>
                </td>
                {/* Department */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${teacher.deptColor}`}
                  >
                    {teacher.department}
                  </span>
                </td>
                {/* Attendance */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {teacher.attendanceLogged ? (
                      <CheckCircle size={14} className="text-success flex-shrink-0" />
                    ) : (
                      <XCircle size={14} className="text-danger flex-shrink-0" />
                    )}
                    <div>
                      <span
                        className={`text-xs font-semibold ${
                          teacher.attendanceLogged ? 'text-success' : 'text-danger'
                        }`}
                      >
                        {teacher.attendanceLogged ? 'Logged' : 'Missing'}
                      </span>
                      <p className="text-2xs text-muted-foreground">{teacher.attendanceNote}</p>
                    </div>
                  </div>
                </td>
                {/* Canvas Grading */}
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1 min-w-[100px]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold font-tabular text-foreground">
                        {teacher.canvasGrading}%
                      </span>
                      <span className="text-2xs text-muted-foreground">
                        Total assignments
                      </span>
                    </div>
                    <div className="compliance-progress-track">
                      <div
                        className="compliance-progress-fill"
                        style={{ width: `${teacher.canvasGrading}%` }}
                      />
                    </div>
                  </div>
                </td>
                {/* Actions */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleRemind(teacher)}
                    className="p-1.5 rounded-lg border border-border hover:bg-muted hover:border-primary/30 transition-all btn-press"
                    title={`Send attendance reminder to ${teacher.name}`}
                  >
                    <Mail size={14} className="text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}