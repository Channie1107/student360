'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useSchoolData } from '@/hooks/useSchoolData';
import DashboardHeader from './components/DashboardHeader';
import PrincipalFilterBar from '@/components/FilterBar';

// Dashboard Components
import KPIRow from './components/teacher/KPIRow';
import TeacherAttendanceDonut from './components/teacher/AttendanceDonut';
import TeacherGPABarChart from './components/teacher/GPABarChart';
import StudentsAtRiskTable from './components/teacher/StudentsAtRiskTable';
import AlertsTimeline from './components/teacher/AlertsTimeline';

export default function OverviewDashboardPage() {
  const { role, teacherContext } = useSchoolData();

  return (
    <AppLayout>
      <div className="px-6 lg:px-8 xl:px-10 py-5 max-w-screen-2xl mx-auto">
        <DashboardHeader
          title={role === 'principal' ? "School Overview Dashboard" : `Class Overview Dashboard (${teacherContext?.classId})`}
          subtitle={role === 'principal' ? "Olympia Schools · Unified Dashboard" : `Grade ${teacherContext?.gradeId} · Class ${teacherContext?.classId} · Academic Year ${teacherContext?.academicYear}`}
          breadcrumb="Overview"
        />
        
        <div className="space-y-5 mt-4">
          {/* Show global filters only for principal */}
          {role === 'principal' && <PrincipalFilterBar />}
          
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