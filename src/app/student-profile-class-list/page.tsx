import React, { Suspense } from 'react';
import AppLayout from '@/components/AppLayout';
import StudentProfileScreen from './components/StudentProfileScreen';
import DashboardHeader from '@/app/components/DashboardHeader';

export default function StudentProfileClassListPage() {
  return (
    <AppLayout>
      <div className="px-6 lg:px-8 xl:px-10 py-5 max-w-screen-2xl mx-auto">
        <DashboardHeader 
          title="Student Profile & Class List" 
          subtitle="Class 11A" 
          breadcrumb="Student Profile"
        />
        <Suspense fallback={null}>
          <StudentProfileScreen />
        </Suspense>
      </div>
    </AppLayout>
  );
}
