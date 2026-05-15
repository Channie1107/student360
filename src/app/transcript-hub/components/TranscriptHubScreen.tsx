'use client';

import React, { useEffect, useMemo, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardHeader from '@/app/components/DashboardHeader';
import { useSchoolData } from '@/hooks/useSchoolData';
import AppImage from '@/components/ui/AppImage';
import { toast } from 'sonner';
import { ChevronDown, Download, Globe, Lock, Printer, User } from 'lucide-react';

type TranscriptRow = {
  subject: string;
  term: string;
  credits: number;
  rawScore: string;
  gradePoint: number;
  letterGrade: string;
};

type TranscriptStudent = {
  name: string;
  studentId: string;
  dob: string;
  nationality: string;
  academicYear: string;
  subjects: { name: string; grade: string; score: number }[];
  gpa: number;
};

function GradeBadge({ grade }: { grade: string }) {
  const tone =
    grade.startsWith('A')
      ? 'bg-green-50 text-green-700 border-green-200'
      : grade.startsWith('B')
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : grade.startsWith('C')
          ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
          : 'bg-red-50 text-red-700 border-red-200';

  return (
    <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none ${tone}`}>
      {grade}
    </span>
  );
}

function SelectBox({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <div className="mt-2 relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-border bg-white px-3 py-2 pr-9 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {children}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
    </label>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  tone = 'secondary',
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  tone?: 'primary' | 'secondary';
}) {
  const className =
    tone === 'primary'
      ? 'bg-primary text-white hover:bg-primary/90'
      : 'bg-white text-primary border border-border hover:bg-muted';

  return (
    <button
      onClick={onClick}
      className={`inline-flex min-h-[68px] items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm btn-press ${className}`}
    >
      {icon}
      {label}
    </button>
  );
}

function buildTranscriptRows(student: TranscriptStudent | null): TranscriptRow[] {
  const subjects = student?.subjects ?? [];

  const mapGradePoint = (score: number) => {
    if (score >= 93) return 4.0;
    if (score >= 90) return 3.7;
    if (score >= 87) return 3.3;
    if (score >= 83) return 3.0;
    if (score >= 80) return 2.7;
    if (score >= 77) return 2.3;
    if (score >= 73) return 2.0;
    if (score >= 70) return 1.7;
    if (score >= 67) return 1.3;
    if (score >= 65) return 1.0;
    return 0.0;
  };

  const mapLetter = (point: number) => {
    if (point >= 4.0) return 'A';
    if (point >= 3.7) return 'A-';
    if (point >= 3.3) return 'B+';
    if (point >= 3.0) return 'B';
    if (point >= 2.7) return 'B-';
    if (point >= 2.3) return 'C+';
    if (point >= 2.0) return 'C';
    if (point >= 1.7) return 'C-';
    if (point >= 1.0) return 'D';
    return 'F';
  };

  const fallbackSubjects = [
    'Mathematics',
    'Physics',
    'English Literature',
    'Chemistry',
    'World History & Civics',
    'Digital Literacy',
  ];

  return Array.from({ length: 6 }, (_, index) => {
    const source = subjects[index];
    const score = source?.score ?? Math.max(72, Math.min(98, 84 + index * 2));
    const gradePoint = mapGradePoint(score);
    return {
      subject: source?.name ?? fallbackSubjects[index],
      term: 'Full Year',
      credits: 1.0,
      rawScore: `${score}%`,
      gradePoint,
      letterGrade: mapLetter(gradePoint),
    };
  });
}

export default function TranscriptHubScreen() {
  const { students } = useSchoolData();
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [documentStatus, setDocumentStatus] = useState('Pending Verified');
  const [printMode, setPrintMode] = useState('Print with Official Watermark');

  const classStudents = useMemo(
    () =>
      [...students]
        .filter((student) => student.classId === '11A' && student.academicYear === '25-26')
        .sort((a, b) => a.name.localeCompare(b.name)),
    [students]
  );

  useEffect(() => {
    if (!selectedStudentId && classStudents.length > 0) {
      setSelectedStudentId(classStudents[0].studentId);
    }
  }, [classStudents, selectedStudentId]);

  const selectedStudent = useMemo(
    () => classStudents.find((student) => student.studentId === selectedStudentId) ?? classStudents[0] ?? null,
    [classStudents, selectedStudentId]
  );

  const transcriptStudent = useMemo<TranscriptStudent | null>(() => {
    if (!selectedStudent) return null;
    return {
      name: selectedStudent.name,
      studentId: selectedStudent.studentId,
      dob: selectedStudent.dob,
      nationality: selectedStudent.nationality,
      academicYear: '2025-2026',
      subjects: selectedStudent.subjects,
      gpa: selectedStudent.gpa,
    };
  }, [selectedStudent]);

  const transcriptRows = useMemo(() => buildTranscriptRows(transcriptStudent), [transcriptStudent]);

  const summary = useMemo(() => {
    const totalCredits = transcriptRows.reduce((sum, row) => sum + row.credits, 0);
    const gpa =
      transcriptRows.length > 0
        ? transcriptRows.reduce((sum, row) => sum + row.gradePoint * row.credits, 0) / totalCredits
        : transcriptStudent?.gpa ?? 3.62;
    return {
      credits: `${totalCredits.toFixed(1)} Credits`,
      gpa: `${gpa.toFixed(2).replace('.', ',')} / 4.00`,
    };
  }, [transcriptRows, transcriptStudent]);

  return (
    <AppLayout>
      <div className="mx-auto max-w-screen-2xl px-6 py-5 lg:px-8 xl:px-10">
        <DashboardHeader
          title="Transcript Hub & Conversion Engine (11A)"
          subtitle="Formal transcript generation and academic audit workspace"
          breadcrumb="Transcript Hub"
        />

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-4">
            <div className="rounded-xl border border-border bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Grade / Class</p>
              <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Lock size={14} className="text-primary" />
                Grade: 11 &gt; Class: 11A
              </div>
            </div>

            <SelectBox label="Target Student" value={selectedStudent?.studentId ?? ''} onChange={setSelectedStudentId}>
              {classStudents.map((student) => (
                <option key={student.studentId} value={student.studentId}>
                  {student.name} - {student.studentId}
                </option>
              ))}
            </SelectBox>

            <div className="rounded-xl border border-border bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Conversion Target</p>
              <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Globe size={14} className="text-primary" />
                US Standard System (4.0 Scale &amp; Letter Grade Mapping)
              </div>
            </div>

            <div className="rounded-xl border border-border bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Active Scope</p>
              <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <User size={14} className="text-primary" />
                {classStudents.length} students in roster
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mx-auto max-w-4xl rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-accent bg-white p-2 shadow-sm">
                <AppImage
                  src="/assets/images/image-1778473951253.png"
                  alt="Olympia Schools crest"
                  width={44}
                  height={44}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">The Olympia Schools</p>
              <p className="mt-1 text-sm text-slate-500">
                Hanoi Campus · Academic Records Office · Trung Van Urban Area, Nam Tu Liem District, Hanoi
              </p>
              <h1 className="mt-5 text-2xl font-black tracking-tight text-slate-900">OFFICIAL ACADEMIC TRANSCRIPT</h1>
              <p className="mt-1 text-sm font-medium text-primary">US Standard System (4.0 Scale &amp; Letter Grade Mapping)</p>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="grid gap-4 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Selected Student</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">{transcriptStudent?.name ?? '—'}</p>
                  <p className="text-sm text-slate-500">{transcriptStudent?.studentId ?? '—'}</p>
                </div>
                <div className="rounded-xl border border-white bg-white px-3 py-2">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">DOB</p>
                  <p className="mt-1 font-semibold text-slate-900">{transcriptStudent?.dob ?? '—'}</p>
                </div>
                <div className="rounded-xl border border-white bg-white px-3 py-2">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Nationality</p>
                  <p className="mt-1 font-semibold text-slate-900">{transcriptStudent?.nationality ?? '—'}</p>
                </div>
                <div className="rounded-xl border border-white bg-white px-3 py-2">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Academic Year</p>
                  <p className="mt-1 font-semibold text-slate-900">{transcriptStudent?.academicYear ?? '2025-2026'}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                    <th className="px-4 py-3 font-semibold">Standardized Subject Name (English)</th>
                    <th className="px-4 py-3 font-semibold">Term Duration</th>
                    <th className="px-4 py-3 font-semibold">Earned Credits</th>
                    <th className="px-4 py-3 font-semibold">Raw Canvas Score</th>
                    <th className="px-4 py-3 font-semibold">Converted US Grade Point</th>
                    <th className="px-4 py-3 font-semibold">Converted Letter Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {transcriptRows.map((row) => (
                    <tr key={row.subject} className="align-top">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-900">{row.subject}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">{row.term}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-900">{row.credits.toFixed(1)} Credit</td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-900">{row.rawScore}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-900">{row.gradePoint.toFixed(2).replace('.', ',')}</td>
                      <td className="px-4 py-4">
                        <GradeBadge grade={row.letterGrade} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-5">
              <div className="text-left">
                <p className="text-lg font-black uppercase tracking-[0.18em] text-slate-700">SUMMARY:</p>
                <ul className="mt-3 space-y-2 text-base text-slate-900">
                  <li className="flex items-baseline gap-2">
                    <span className="font-bold">Total Credits Earned:</span>
                    <span className="font-bold" style={{ color: '#5b1d8d' }}>{summary.credits}</span>
                  </li>
                  <li className="flex items-baseline gap-2">
                    <span className="font-bold">Real-time Weighted Cumulative GPA:</span>
                    <span className="font-bold" style={{ color: '#5b1d8d' }}>{summary.gpa}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <SelectBox label="Document Status" value={documentStatus} onChange={setDocumentStatus}>
              <option value="Verified">Verified</option>
              <option value="Pending Verified">Pending Verified</option>
            </SelectBox>

            <SelectBox label="Print Mode" value={printMode} onChange={setPrintMode}>
              <option value="Print with Official Watermark">Print with Official Watermark</option>
              <option value="Print without Watermark">Print without Watermark</option>
            </SelectBox>

            <ActionButton
              icon={<Download size={16} />}
              label="Export PDF"
              tone="primary"
              onClick={() => toast.success('PDF export queued')}
            />

            <ActionButton
              icon={<Printer size={16} />}
              label="Print"
              onClick={() => toast.success('Print queued')}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
