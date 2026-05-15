'use client';
import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { MockDB, DBStudent, DBAchievement, DBBehaviorLog } from '../lib/mockDatabase';
import { useRole } from '../context/RoleContext';

export interface SystemAlert {
  id: string;
  dotColor: string;
  time: string;
  message: string;
  action: string | null;
  actionHref: string | null;
  severity: string;
  isSystem?: boolean;
}

const TEACHER_CONTEXT = {
  gradeId: '11',
  classId: '11A',
  academicYear: '25-26',
  teacherName: 'Mr. James Wilson'
};

interface Stats {
  total: number;
  avgGpa: string;
  avgAttendance: number;
  atRiskCount: number;
}

interface SchoolDataContextProps {
  students: DBStudent[];
  stats: Stats;
  alerts: SystemAlert[];
  role: string;
  grades: string[];
  classes: string[];
  selectedGrade: string;
  setSelectedGrade: (val: string) => void;
  selectedClass: string;
  setSelectedClass: (val: string) => void;
  academicYear: string;
  setAcademicYear: (val: string) => void;
  teacherContext: typeof TEACHER_CONTEXT | null;
  addAchievement: (studentId: string, achievement: DBAchievement) => void;
  updateAchievement: (studentId: string, achievementId: string, achievement: DBAchievement) => void;
  addBehaviorLog: (studentId: string, log: DBBehaviorLog) => void;
  updateBehaviorLog: (studentId: string, logId: string, log: DBBehaviorLog) => void;
}

const SchoolDataContext = createContext<SchoolDataContextProps | undefined>(undefined);

export function SchoolDataProvider({ children }: { children: ReactNode }) {
  const { role } = useRole();
  const [allStudents, setAllStudents] = useState<DBStudent[]>(MockDB.students);
  
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [academicYear, setAcademicYear] = useState<string>('25-26');

  const filteredStudents = useMemo(() => {
    let students = allStudents;

    if (role === 'teacher') {
      students = students.filter(s => 
        s.classId === TEACHER_CONTEXT.classId && 
        s.academicYear === TEACHER_CONTEXT.academicYear
      );
    } else {
      if (academicYear !== 'All') students = students.filter(s => s.academicYear === academicYear);
      if (selectedGrade !== 'All') students = students.filter(s => s.gradeId === selectedGrade);
      if (selectedClass !== 'All') students = students.filter(s => s.classId === selectedClass);
    }

    return students;
  }, [allStudents, role, selectedGrade, selectedClass, academicYear]);

  const addAchievement = (studentId: string, achievement: DBAchievement) => {
    const id = achievement.id ?? `ach-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setAllStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.studentId === studentId || student.id === studentId
          ? { ...student, achievements: [{ ...achievement, id }, ...student.achievements] }
          : student
      )
    );
  };

  const updateAchievement = (studentId: string, achievementId: string, achievement: DBAchievement) => {
    setAllStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.studentId === studentId || student.id === studentId
          ? {
              ...student,
              achievements: student.achievements.map((item) => ((item.id ?? '') === achievementId ? { ...item, ...achievement, id: achievementId } : item)),
            }
          : student
      )
    );
  };

  const addBehaviorLog = (studentId: string, log: DBBehaviorLog) => {
    const id = log.id ?? `beh-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setAllStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.studentId === studentId || student.id === studentId
          ? { ...student, behaviorLogs: [{ ...log, id }, ...student.behaviorLogs] }
          : student
      )
    );
  };

  const updateBehaviorLog = (studentId: string, logId: string, log: DBBehaviorLog) => {
    setAllStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.studentId === studentId || student.id === studentId
          ? {
              ...student,
              behaviorLogs: student.behaviorLogs.map((item) => ((item.id ?? '') === logId ? { ...item, ...log, id: logId } : item)),
            }
          : student
      )
    );
  };

  const stats = useMemo(() => {
    if (filteredStudents.length === 0) return { total: 0, avgGpa: '0.00', avgAttendance: 0, atRiskCount: 0 };
    
    let totalGpa = 0;
    let totalAtt = 0;
    let atRisk = 0;

    filteredStudents.forEach(s => {
      totalGpa += s.gpa;
      totalAtt += s.attendance;
      if (s.status === 'At Risk' || s.status === 'Critical') atRisk++;
    });

    return {
      total: filteredStudents.length,
      avgGpa: (totalGpa / filteredStudents.length).toFixed(2),
      avgAttendance: Math.round(totalAtt / filteredStudents.length),
      atRiskCount: atRisk,
    };
  }, [filteredStudents]);

  const alerts = useMemo(() => {
    const ALERTS: SystemAlert[] = [{
      id: 'alert-000',
      dotColor: 'var(--success)',
      time: 'Just now',
      message: 'Gate Entry: Attendance data synced successfully from Main Gate.',
      action: null,
      actionHref: null,
      severity: 'success',
      isSystem: true,
    }];

    const atRiskStudents = filteredStudents
      .filter(s => s.status === 'At Risk' || s.status === 'Critical' || s.gpa < 3.1 || s.attendance < 85)
      .sort((a, b) => a.gpa - b.gpa);

    if (atRiskStudents.length > 0) {
      const highlighted = atRiskStudents.slice(0, 3);
      ALERTS.push({
        id: 'alert-001',
        dotColor: 'var(--danger)',
        time: '2 hours ago',
        message: `${highlighted.length} Class ${TEACHER_CONTEXT.classId} students are trending at risk after lower GPA and attendance this term.`,
        action: 'View Students',
        actionHref: role === 'principal' ? '/student-profile' : '/student-profile-class-list',
        severity: 'danger',
      });
    }

    ALERTS.push({
      id: 'alert-004',
      dotColor: 'var(--primary)',
      time: 'System Notice',
      message: 'System Update: New curriculum framework is now available in the Transcript Hub.',
      action: 'View Changes',
      actionHref: '/transcript-hub',
      severity: 'info',
      isSystem: true,
    });

    return ALERTS.slice(0, 3);
  }, [filteredStudents, role]);

  return (
    <SchoolDataContext.Provider value={{
      students: filteredStudents,
      stats,
      alerts,
      role,
      grades: MockDB.grades,
      classes: MockDB.classes,
      selectedGrade, setSelectedGrade,
      selectedClass, setSelectedClass,
      academicYear, setAcademicYear,
      teacherContext: role === 'teacher' ? TEACHER_CONTEXT : null,
      addAchievement,
      updateAchievement,
      addBehaviorLog,
      updateBehaviorLog
    }}>
      {children}
    </SchoolDataContext.Provider>
  );
}

export function useSchoolData() {
  const context = useContext(SchoolDataContext);
  if (!context) throw new Error('useSchoolData must be used within SchoolDataProvider');
  return context;
}
