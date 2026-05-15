import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '../styles/tailwind.css';
import { Toaster } from 'sonner';
import { RoleProvider } from '@/context/RoleContext';
import { SchoolDataProvider } from '@/hooks/useSchoolData';
import FirebaseAnalytics from '@/components/FirebaseAnalytics';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Student 360 — Olympia Schools Campus Intelligence',
  description:
    'Enterprise school management dashboard for The Olympia Schools Hanoi — monitor attendance, GPA, teacher compliance, and admissions from one platform.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className={plusJakartaSans.className}>
        <RoleProvider>
          <SchoolDataProvider>
            <FirebaseAnalytics />
            {children}
            <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                fontFamily: 'var(--font-plus-jakarta-sans)',
                fontSize: '14px',
              },
            }}
          />
          </SchoolDataProvider>
        </RoleProvider>

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fstudent3601893back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.18" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></body>
    </html>
  );
}
