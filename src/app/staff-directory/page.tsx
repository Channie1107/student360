import React from 'react';
import AppLayout from '@/components/AppLayout';
import StaffDirectoryScreen from '@/app/components/principal/StaffDirectoryScreen';

export default function StaffDirectoryPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-screen-2xl px-6 py-5 lg:px-8 xl:px-10">
        <StaffDirectoryScreen />
      </div>
    </AppLayout>
  );
}
