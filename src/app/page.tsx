import React from 'react';
import AppLayout from '@/components/AppLayout';
import FilterBar from '@/components/FilterBar';
import KPIBentoGrid from './components/KPIBentoGrid';
import AttendanceDonut from './components/AttendanceDonut';
import GPABarChart from './components/GPABarChart';
import TeacherComplianceTable from './components/TeacherComplianceTable';
import CriticalAlertsTimeline from './components/CriticalAlertsTimeline';
import DashboardHeader from './components/DashboardHeader';

export default function OverviewDashboardPage() {
  return (
    <AppLayout>
      <div className="px-6 lg:px-8 xl:px-10 py-5 max-w-screen-2xl mx-auto">
        <DashboardHeader />
        <FilterBar />
        <KPIBentoGrid />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
          <AttendanceDonut />
          <GPABarChart />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5">
          <div className="xl:col-span-2">
            <TeacherComplianceTable />
          </div>
          <div className="xl:col-span-1">
            <CriticalAlertsTimeline />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}