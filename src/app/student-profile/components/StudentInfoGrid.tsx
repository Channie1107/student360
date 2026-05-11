'use client';

import dynamic from 'next/dynamic';
import SafetyHealthLog from './SafetyHealthLog';
import BehavioralCompliance from './BehavioralCompliance';
import ExtracurricularAchievements from './ExtracurricularAchievements';

const LongitudinalGPAChart = dynamic(() => import('./LongitudinalGPAChart'), { ssr: false });

export default function StudentInfoGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <LongitudinalGPAChart />
      <SafetyHealthLog />
      <BehavioralCompliance />
      <ExtracurricularAchievements />
    </div>
  );
}