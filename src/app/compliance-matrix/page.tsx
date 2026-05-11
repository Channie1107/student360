import React from 'react';
import AppLayout from '@/components/AppLayout';
import FilterBar from '@/components/FilterBar';
import ComplianceHeader from './components/ComplianceHeader';
import ComplianceKPICards from './components/ComplianceKPICards';
import ComplianceDataTable from './components/ComplianceDataTable';
import DataIntegrationAlert from './components/DataIntegrationAlert';

export default function ComplianceMatrixPage() {
  return (
    <AppLayout>
      <div className="px-6 lg:px-8 xl:px-10 py-5 max-w-screen-2xl mx-auto">
        <ComplianceHeader />
        <FilterBar />
        <ComplianceKPICards />
        <ComplianceDataTable />
        <DataIntegrationAlert />
      </div>
    </AppLayout>
  );
}