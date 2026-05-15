'use client';
import React, { useState } from 'react';
import { Mail, User, X, Phone, Mail as MailIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useSchoolData } from '@/hooks/useSchoolData';
import { DBStudent } from '@/lib/mockDatabase';

const badgeMap: Record<string, string> = {
  danger: 'bg-red-100 text-red-700',
  warning: 'bg-orange-100 text-orange-700',
  muted: 'bg-green-100 text-green-700',
  success: 'bg-blue-100 text-blue-700',
};

const getStatusColor = (status: string) => {
  if (status === 'On Track') return 'text-success';
  if (status === 'Monitor' || status === 'Watch') return 'text-yellow-500';
  if (status === 'At Risk') return 'text-orange-500';
  if (status === 'Critical') return 'text-danger';
  return 'text-foreground';
};

export default function StudentsAtRiskTable() {
  const { students, role, teacherContext } = useSchoolData();
  const router = useRouter();
  const [selectedParent, setSelectedParent] = useState<DBStudent | null>(null);
  
  // Get at risk students from the filtered DB
  const AT_RISK_STUDENTS = students
    .filter(s => s.status === 'At Risk' || s.status === 'Critical')
    .sort((a, b) => a.gpa - b.gpa)
    .slice(0, 10); // Show top 10

  return (
    <>
      <div className="bg-card rounded-2xl shadow-card overflow-hidden h-full flex flex-col">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
          <h2 className="text-base font-bold text-foreground">Students at Risk</h2>
          <span className="text-xs text-muted-foreground mt-0.5 block">
            {role === 'principal' ? 'School-wide · Flagged for attention this term' : `Class ${teacherContext?.classId} · Flagged for attention this term`}
          </span>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-danger/10 text-danger">{AT_RISK_STUDENTS.length} Flagged</span>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide whitespace-nowrap">Student</th>
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide whitespace-nowrap">Attendance</th>
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide whitespace-nowrap">Last GPA</th>
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide whitespace-nowrap">Canvas Input</th>
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide whitespace-nowrap">Status</th>
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wide whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {AT_RISK_STUDENTS.map((s) => {
              const canvasInputPct = s.subjects?.length >= 5 ? 100 : Math.round((s.subjects?.length ?? 0) / 5 * 100);
              return (
              <tr key={s.id} className="border-b border-border row-hover transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0" 
                      style={{ background: s.avatarBg }}
                    >
                      {s.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm leading-tight">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.studentId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-tabular text-sm font-semibold ${getStatusColor(s.status)}`}>
                    {s.attendance}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-bold font-tabular text-sm ${getStatusColor(s.status)}`}>
                    {s.gpa.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3 min-w-[120px]">
                  <div className="flex flex-col gap-1.5 min-w-[120px]">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-semibold font-tabular text-foreground">
                        {canvasInputPct}%
                      </span>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        Canvas complete
                      </span>
                    </div>
                    <div className="compliance-progress-track">
                      <div
                        className="compliance-progress-fill"
                        style={{ width: `${canvasInputPct}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold ${getStatusColor(s.status)}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => router.push(role === 'principal' ? `/student-profile?studentId=${s.studentId}` : `/student-profile-class-list?studentId=${s.studentId}`)}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted hover:border-primary/30 text-muted-foreground hover:text-primary transition-all btn-press"
                      title="View student profile"
                    >
                      <User size={14} />
                    </button>
                    <button
                      onClick={() => setSelectedParent(s)}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted hover:border-primary/30 text-muted-foreground hover:text-primary transition-all btn-press"
                      title="Contact parent"
                    >
                      <Mail size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      </div>

      {/* Parent Contact Modal */}
      {selectedParent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm fade-in p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
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
    </>
  );
}
