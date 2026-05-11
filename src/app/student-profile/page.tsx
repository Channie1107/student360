import React from 'react';
import AppLayout from '@/components/AppLayout';
import FilterBar from '@/components/FilterBar';
import StudentSearchGateway from './components/StudentSearchGateway';
import StudentBioCard from './components/StudentBioCard';
import StudentInfoGrid from './components/StudentInfoGrid';

export default function StudentProfilePage() {
  return (
    <AppLayout>
      <div className="px-6 lg:px-8 xl:px-10 py-5 max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span className="font-medium">The Olympia Schools</span>
            <span>/</span>
            <span className="font-semibold" style={{ color: 'var(--primary)' }}>
              Student Profile
            </span>
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--primary)', letterSpacing: '-0.01em' }}
          >
            Student Profile
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Individual academic, behavioral, and extracurricular record
          </p>
        </div>
        <FilterBar />
        <StudentSearchGateway />
        <StudentBioCard />
        <StudentInfoGrid />
      </div>
    </AppLayout>
  );
}