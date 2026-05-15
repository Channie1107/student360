import { DBStudent } from '@/lib/mockDatabase';

export type ComplianceState = 'COMPLIANT' | 'IN PROGRESS' | 'MISSING DATA';
export type SubjectName = 'Mathematics' | 'English A' | 'Physics' | 'Chemistry' | 'History';

export interface ComplianceSubjectCell {
  subject: SubjectName;
  state: ComplianceState;
  score: number;
}

export interface StudentCompliance {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  studentId: string;
  busRoute: string;
  busState: ComplianceState;
  busLabel: string;
  sisHealthState: ComplianceState;
  sisAttendance: number;
  sisAttendanceState: ComplianceState;
  hasMismatch: boolean;
  reconciliationState: ComplianceState;
  canvasGradebook: number;
  canvasState: ComplianceState;
  subjects: ComplianceSubjectCell[];
  overallState: ComplianceState;
}

export interface ComplianceSummary {
  total: number;
  attendanceAverage: number;
  canvasAverage: number;
  compliantCount: number;
  inProgressCount: number;
  mismatchCount: number;
}

export const STATE_COLORS: Record<ComplianceState, string> = {
  COMPLIANT: '#52c41a',
  'IN PROGRESS': '#faad14',
  'MISSING DATA': '#ff4d4f',
};

const SUBJECTS: SubjectName[] = ['Mathematics', 'English A', 'Physics', 'Chemistry', 'History'];

export function buildComplianceData(students: DBStudent[]): StudentCompliance[] {
  return students
    .slice()
    .sort((a, b) => a.studentId.localeCompare(b.studentId))
    .slice(0, 23)
    .map((student, index) => {
      const sisAttendance = student.attendance;
      const canvasGradebookScores = student.subjects.slice(0, SUBJECTS.length).map((subject) => subject.score);
      const canvasInputCompleteness = Math.round((canvasGradebookScores.length / SUBJECTS.length) * 100);
      const canvasGradebook = canvasInputCompleteness;
      const sisAttendanceState: ComplianceState = 'COMPLIANT';
      const canvasState: ComplianceState = canvasInputCompleteness === 100 ? 'COMPLIANT' : canvasInputCompleteness >= 80 ? 'IN PROGRESS' : 'MISSING DATA';
      const sisHealthState: ComplianceState = 'COMPLIANT';
      const reconciliationState: ComplianceState = 'COMPLIANT';
      const busState = 'COMPLIANT';

      return {
        id: student.id,
        name: student.name,
        initials: student.initials,
        avatarBg: student.avatarBg,
        studentId: student.studentId,
        busRoute: student.busRoute,
        busState,
        busLabel: 'Morning & Afternoon: Verified',
        sisHealthState,
        sisAttendance,
        sisAttendanceState,
        hasMismatch: false,
        reconciliationState,
        canvasGradebook,
        canvasState,
        subjects: SUBJECTS.map((subject, subjectIndex) => ({
          subject,
          state: canvasState,
          score: canvasGradebookScores[subjectIndex] ?? 0,
        })),
        overallState: reconciliationState,
      };
    });
}

export function summarizeCompliance(rows: StudentCompliance[]): ComplianceSummary {
  const total = rows.length;

  if (total === 0) {
    return {
      total: 0,
      attendanceAverage: 0,
      canvasAverage: 0,
      compliantCount: 0,
      inProgressCount: 0,
      mismatchCount: 0,
    };
  }

  const attendanceAverage = Math.round(rows.reduce((sum, row) => sum + row.sisAttendance, 0) / total);
  const canvasAverage = Math.round(rows.reduce((sum, row) => sum + row.canvasGradebook, 0) / total);
  const compliantCount = rows.filter((row) => row.overallState === 'COMPLIANT').length;
  const mismatchCount = rows.filter((row) => row.overallState === 'MISSING DATA').length;
  const inProgressCount = total - compliantCount - mismatchCount;

  return {
    total,
    attendanceAverage,
    canvasAverage,
    compliantCount,
    inProgressCount,
    mismatchCount,
  };
}
