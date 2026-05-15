'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useSchoolData } from '@/hooks/useSchoolData';
import DashboardHeader from './components/DashboardHeader';
import PrincipalExecutiveDashboard from './components/principal/PrincipalExecutiveDashboard';

// Dashboard Components
import KPIRow from './components/teacher/KPIRow';
import TeacherAttendanceDonut from './components/teacher/AttendanceDonut';
import TeacherGPABarChart from './components/teacher/GPABarChart';
import StudentsAtRiskTable from './components/teacher/StudentsAtRiskTable';
import AlertsTimeline from './components/teacher/AlertsTimeline';

export default function OverviewDashboardPage() {
  const { role, teacherContext } = useSchoolData();

  if (role === 'principal') {
    return (
      <AppLayout>
        <div className="mx-auto max-w-screen-2xl px-6 py-5 lg:px-8 xl:px-10">
          <PrincipalExecutiveDashboard />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-screen-2xl px-6 py-5 lg:px-8 xl:px-10">
        <DashboardHeader
          title={`Class Overview Dashboard (${teacherContext?.classId})`}
          subtitle={`Grade ${teacherContext?.gradeId} · Class ${teacherContext?.classId} · Academic Year ${teacherContext?.academicYear}`}
          breadcrumb="Overview"
        />

        <div className="space-y-5 mt-4">
          <KPIRow />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <div className="lg:col-span-2">
              <TeacherAttendanceDonut />
            </div>
            <div className="lg:col-span-3">
              <TeacherGPABarChart />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2">
              <StudentsAtRiskTable />
            </div>
            <div className="xl:col-span-1">
              <AlertsTimeline />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
