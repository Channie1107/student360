import React, { Suspense } from 'react';
import AppLayout from '@/components/AppLayout';
import ComplianceScreen from './components/ComplianceScreen';

export default function ClassComplianceDataEntryAuditPage() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-[#f8f9fa] px-6 lg:px-8 xl:px-10 py-5">
        <Suspense fallback={null}>
          <ComplianceScreen />
        </Suspense>
      </div>
    </AppLayout>
  );
}
