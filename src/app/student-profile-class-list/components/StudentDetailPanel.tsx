'use client';
import React, { useState } from 'react';
import { DBStudent } from '@/lib/mockDatabase';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';
import { User, X, Phone, Mail as MailIcon } from 'lucide-react';
import StudentGPAChart from './StudentGPAChart';
import StudentAttendanceChart from './StudentAttendanceChart';
import StudentAcademicsComboChart from './StudentAcademicsComboChart';

interface StudentDetailPanelProps {
  student: DBStudent;
  onClose: () => void;
}

const TABS = ['Overview', 'Academics', 'Attendance', 'Behaviour', 'Achievements'];

const statusBadge: Record<string, string> = {
  'On Track': 'badge-success',
  Monitor: 'badge-warning',
  'At Risk': 'badge-danger',
  Critical: 'badge-danger',
};

const gradeColor: Record<string, string> = {
  A: '#52c41a', B: '#5b1d8d', C: '#faad14', D: '#ff4d4f', F: '#cf1322',
};

export default function StudentDetailPanel({ student, onClose }: StudentDetailPanelProps) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className="section-card overflow-hidden">
      {/* Student Header */}
      <div className="px-6 pt-5 pb-4 border-b border-border" style={{ background: 'linear-gradient(135deg, rgba(91,29,141,0.06) 0%, rgba(255,217,0,0.04) 100%)' }}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex items-center justify-center rounded-2xl text-white font-extrabold text-xl flex-shrink-0"
              style={{ width: 56, height: 56, background: student.avatarBg }}
            >
              {student.initials}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-extrabold text-foreground">{student.name}</h2>
                <span className={statusBadge[student.status]}>{student.status}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{student.studentId} · {student.nationality} · Class 11A</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1"><Icon name="CalendarIcon" size={12} variant="outline" /> DOB: {student.dob}</span>
                <span className="flex items-center gap-1"><Icon name="EnvelopeIcon" size={12} variant="outline" /> {student.email}</span>
                <span className="flex items-center gap-1"><Icon name="TruckIcon" size={12} variant="outline" /> {student.busRoute}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowContactModal(true)}
              className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              title="Contact parent"
            >
              <Icon name="EnvelopeIcon" size={18} variant="outline" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
              title="Close panel"
            >
              <Icon name="XMarkIcon" size={18} variant="outline" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-card rounded-xl px-3 py-2.5 border border-border text-center">
            <p className="text-xs text-muted-foreground font-medium">GPA</p>
            <p className={`text-xl font-extrabold font-tabular ${student.gpa < 3.0 ? 'text-danger' : student.gpa >= 3.7 ? 'text-success' : 'text-foreground'}`}>
              {student.gpa.toFixed(2)}
            </p>
          </div>
          <div className="bg-card rounded-xl px-3 py-2.5 border border-border text-center">
            <p className="text-xs text-muted-foreground font-medium">Attendance</p>
            <p className={`text-xl font-extrabold font-tabular ${student.attendance < 80 ? 'text-danger' : student.attendance < 90 ? 'text-warning' : 'text-success'}`}>
              {student.attendance}%
            </p>
          </div>
          <div className="bg-card rounded-xl px-3 py-2.5 border border-border text-center">
            <p className="text-xs text-muted-foreground font-medium">Subjects</p>
            <p className="text-xl font-extrabold font-tabular text-foreground">{student.subjects.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border px-6 overflow-x-auto scroll-thin">
        {TABS.map((tab) => (
          <button
            key={`tab-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm whitespace-nowrap transition-all border-b-2 ${
              activeTab === tab 
                ? 'border-primary text-primary font-bold' 
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 overflow-y-auto scroll-thin" style={{ maxHeight: 'calc(100vh - 420px)' }}>
        {activeTab === 'Overview' && (
          <div className="space-y-5">
            {/* Bio */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Personal Information</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Gender:</span> <span className="font-medium ml-1">{student.gender}</span></div>
                <div><span className="text-muted-foreground">Nationality:</span> <span className="font-medium ml-1">{student.nationality}</span></div>
                <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium ml-1">{student.phone}</span></div>
                <div><span className="text-muted-foreground">Bus Route:</span> <span className="font-medium ml-1">{student.busRoute}</span></div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Parent/Guardian:</span>
                  <span className="font-medium ml-1">{student.parentName}</span>
                  <span className="text-muted-foreground ml-2">({student.parentEmail} · {student.parentPhone})</span>
                </div>
                {student.medicalNotes !== 'No known conditions' && (
                  <div className="col-span-2 flex items-start gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(250,173,20,0.08)', border: '1px solid rgba(250,173,20,0.25)' }}>
                    <Icon name="ExclamationTriangleIcon" size={14} variant="outline" className="text-warning mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-warning font-medium">{student.medicalNotes}</span>
                  </div>
                )}
              </div>
            </div>
            {/* GPA Trend */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Term 1 vs Term 2 GPA</p>
              <StudentGPAChart data={student.gpaHistory} />
            </div>
          </div>
        )}

        {activeTab === 'Academics' && (
          <div className="space-y-6">
            <div>
              <StudentAcademicsComboChart subjects={student.subjects} studentName={student.name} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">Grade Breakdown (Term 1 & Term 2)</p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-foreground border-b border-border pb-2">Term 1</h4>
                  {student.subjects.map((sub, i) => (
                    <div key={`t1-sub-${student.id}-${sub.name}`} className="flex items-center gap-3">
                      <div className="w-28 text-sm font-medium text-foreground truncate flex-shrink-0">{sub.name}</div>
                      <div className="flex-1">
                        <div className="progress-bar-track">
                          <div className="progress-bar-fill" style={{ width: `${sub.score}%`, background: gradeColor[sub.grade] }} />
                        </div>
                      </div>
                      <span className="text-sm font-bold font-tabular w-8 text-right" style={{ color: gradeColor[sub.grade] }}>{sub.score}%</span>
                      <span
                        className="w-6 h-6 flex items-center justify-center rounded-lg text-white text-[10px] font-bold flex-shrink-0"
                        style={{ background: gradeColor[sub.grade] }}
                      >
                        {sub.grade}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-foreground border-b border-border pb-2">Term 2 (Current)</h4>
                  {student.subjects.map((sub, i) => {
                    // Slight variation for Term 2 to look dynamic
                    const t2Score = Math.min(100, Math.max(0, sub.score + (i % 2 === 0 ? 3 : -2)));
                    const t2Grade = t2Score >= 90 ? 'A' : t2Score >= 80 ? 'B' : t2Score >= 70 ? 'C' : t2Score >= 60 ? 'D' : 'F';
                    
                    return (
                      <div key={`t2-sub-${student.id}-${sub.name}`} className="flex items-center gap-3">
                        <div className="w-28 text-sm font-medium text-foreground truncate flex-shrink-0">{sub.name}</div>
                        <div className="flex-1">
                          <div className="progress-bar-track">
                            <div className="progress-bar-fill" style={{ width: `${t2Score}%`, background: gradeColor[t2Grade] }} />
                          </div>
                        </div>
                        <span className="text-sm font-bold font-tabular w-8 text-right" style={{ color: gradeColor[t2Grade] }}>{t2Score}%</span>
                        <span
                          className="w-6 h-6 flex items-center justify-center rounded-lg text-white text-[10px] font-bold flex-shrink-0"
                          style={{ background: gradeColor[t2Grade] }}
                        >
                          {t2Grade}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Attendance' && (
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Monthly Attendance Rate</p>
            <StudentAttendanceChart data={student.attendanceHistory} />
            <div className="grid grid-cols-3 gap-3 text-center text-sm mt-2">
              <div className="px-3 py-2 rounded-xl" style={{ background: 'rgba(82,196,26,0.08)' }}>
                <p className="text-xs text-muted-foreground">Overall Rate</p>
                <p className="text-lg font-extrabold text-success font-tabular">{student.attendance}%</p>
              </div>
              <div className="px-3 py-2 rounded-xl" style={{ background: 'rgba(91,29,141,0.06)' }}>
                <p className="text-xs text-muted-foreground">Days Present</p>
                <p className="text-lg font-extrabold text-primary font-tabular">{Math.round(student.attendance * 0.25)}</p>
              </div>
              <div className="px-3 py-2 rounded-xl" style={{ background: 'rgba(255,77,79,0.06)' }}>
                <p className="text-xs text-muted-foreground">Days Absent</p>
                <p className="text-lg font-extrabold text-danger font-tabular">{Math.round((100 - student.attendance) * 0.25)}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Behaviour' && (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Behaviour & Incident Logs</p>
            {student.behaviorLogs.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(82,196,26,0.1)' }}>
                  <Icon name="CheckCircleIcon" size={24} variant="outline" className="text-success" />
                </div>
                <p className="font-semibold text-foreground">No behaviour logs recorded</p>
                <p className="text-sm text-muted-foreground mt-1">This student has a clean behaviour record this academic year.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {student.behaviorLogs.map((log, i) => (
                  <div
                    key={`log-${student.id}-${i}`}
                    className="flex gap-3 p-3 rounded-xl border"
                    style={{
                      background: log.severity === 'danger' ? 'rgba(255,77,79,0.04)' : 'rgba(250,173,20,0.04)',
                      borderColor: log.severity === 'danger' ? 'rgba(255,77,79,0.2)' : 'rgba(250,173,20,0.2)',
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ background: log.severity === 'danger' ? '#ff4d4f' : '#faad14' }}
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-foreground">{log.type}</span>
                        <span className="text-xs text-muted-foreground">{log.date}</span>
                      </div>
                      <p className="text-sm text-foreground">{log.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Achievements' && (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Awards & Achievements</p>
            {student.achievements.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(255,217,0,0.1)' }}>
                  <span className="text-2xl">🏅</span>
                </div>
                <p className="font-semibold text-foreground">No achievements logged yet</p>
                <p className="text-sm text-muted-foreground mt-1">Achievements are recorded when students complete milestones or win awards.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {student.achievements.map((a, i) => (
                  <div key={`ach-${student.id}-${i}`} className="flex items-start gap-3 p-3 rounded-xl border border-border hover:border-primary/30 transition-colors">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,217,0,0.16)' }}>
                      {a.icon.endsWith('Icon') ? (
                        <Icon name={a.icon} size={18} variant="outline" className="text-primary" />
                      ) : (
                        <span className="text-xl">{a.icon}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{a.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {a.date}
                            {a.tier ? ` · ${a.tier}` : ''}
                          </p>
                        </div>
                        {a.category && (
                          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-secondary text-primary whitespace-nowrap">
                            {a.category}
                          </span>
                        )}
                      </div>
                      {a.hasEvidence && (
                        <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                          <Icon name="DocumentIcon" size={13} variant="outline" />
                          {a.evidenceLabel}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Parent Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm fade-in p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-1">Contact Parent</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Parent/Guardian information for <span className="font-semibold text-foreground">{student.name}</span>
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/30">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Parent Name</p>
                    <p className="font-medium text-foreground">{student.parentName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/30">
                  <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone Number</p>
                    <p className="font-medium text-foreground">{student.parentPhone}</p>
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
                    <p className="font-medium text-foreground truncate max-w-[180px]">{student.parentEmail}</p>
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
