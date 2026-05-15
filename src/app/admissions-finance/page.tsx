import React from 'react';
import AppLayout from '@/components/AppLayout';
import AdmissionsFinanceHub from '@/app/components/principal/AdmissionsFinanceHub';

export default function AdmissionsFinancePage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-screen-2xl px-6 py-5 lg:px-8 xl:px-10">
        <AdmissionsFinanceHub />
      </div>
    </AppLayout>
  );
}
