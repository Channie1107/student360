'use client';
import React, { useState } from 'react';
import ClassRosterTable from './ClassRosterTable';
import StudentDetailPanel from './StudentDetailPanel';
import { useSchoolData } from '@/hooks/useSchoolData';
import { useSearchParams } from 'next/navigation';

export default function StudentProfileScreen() {
  const { students, teacherContext, role, academicYear } = useSchoolData();
  const searchParams = useSearchParams();
  const initialStudentId = searchParams.get('studentId');
  
  const [selectedId, setSelectedId] = useState<string | null>(initialStudentId);
  const [search, setSearch] = useState('');

  const selectedStudent = students?.find((s) => s?.studentId === selectedId) ?? null;

  return (
    <div className="px-6 py-5 max-w-screen-2xl mx-auto">
      {/* Scope Banner */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm locked-filter">
          <span className="font-semibold">Academic Year: {academicYear}</span>
        </div>
        <span className="text-muted-foreground">›</span>
        {role === 'teacher' && teacherContext && (
          <>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm locked-filter">
              <span className="font-semibold">Grade: {teacherContext.gradeId}</span>
            </div>
            <span className="text-muted-foreground">›</span>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm locked-filter">
              <span className="font-semibold">Class: {teacherContext.classId}</span>
            </div>
            <span className="text-muted-foreground">›</span>
          </>
        )}
        <div className="px-3 py-1.5 rounded-lg text-sm border border-primary/30 bg-primary/5 text-primary font-semibold">
          {selectedStudent ? selectedStudent?.name : 'Select a student →'}
        </div>
      </div>
      <div className={`grid gap-5 ${selectedStudent ? 'grid-cols-1 xl:grid-cols-5' : 'grid-cols-1'}`}>
        <div className={selectedStudent ? 'xl:col-span-2' : 'col-span-1'}>
          <ClassRosterTable
            search={search}
            onSearchChange={setSearch}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
        {selectedStudent && (
          <div className="xl:col-span-3">
            <StudentDetailPanel student={selectedStudent} onClose={() => setSelectedId(null)} />
          </div>
        )}
      </div>
    </div>
  );
}