'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardHeader from '@/app/components/DashboardHeader';
import { useRole } from '@/context/RoleContext';
import { toast } from 'sonner';
import { Eye, EyeOff, LockKeyhole, User, Mail, IdCard, ShieldCheck } from 'lucide-react';

function ReadOnlyField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-slate-100 px-4 py-3">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default function SettingsScreen() {
  const { role } = useRole();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const profile =
    role === 'principal'
      ? {
          fullName: 'Dr. Helena Vance',
          academicId: 'EMP99001',
          email: 'helena.vance@olympiaschools.edu',
          assignedRole: 'Senior Principal',
          subtitle: 'Principal account profile and security management',
        }
      : {
          fullName: 'Mr. James Wilson',
          academicId: 'EMP88210',
          email: 'james.wilson@olympiaschools.edu',
          assignedRole: 'Homeroom Teacher - Grade 11A',
          subtitle: 'Account profile and security management',
        };

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please complete all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }

    toast.success('Password update queued.');
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-screen-2xl px-6 py-5 lg:px-8 xl:px-10">
        <DashboardHeader
          title="Settings"
          subtitle={profile.subtitle}
          breadcrumb="Settings"
        />

        <section className="mt-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: 'var(--primary)' }}>
                  Profile Information
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Verified SIS-linked identity and assignment data for the active account.
                </p>
              </div>

              <div className="space-y-3">
                <ReadOnlyField icon={<User size={13} className="text-slate-500" />} label="Full Name" value={profile.fullName} />
                <ReadOnlyField icon={<IdCard size={13} className="text-slate-500" />} label="Academic ID" value={profile.academicId} />
                <ReadOnlyField icon={<Mail size={13} className="text-slate-500" />} label="Primary Email" value={profile.email} />
                <ReadOnlyField icon={<ShieldCheck size={13} className="text-slate-500" />} label="Assigned Role" value={profile.assignedRole} />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: 'var(--primary)' }}>
                    Change Password
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Update your account password for the active session.
                  </p>
                </div>
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <LockKeyhole size={16} />
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Current Password</span>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-xl border border-border bg-white px-4 py-3 pr-12 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((value) => !value)}
                      className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 transition-colors hover:text-slate-700"
                      aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">New Password</span>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-xl border border-border bg-white px-4 py-3 pr-12 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((value) => !value)}
                      className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 transition-colors hover:text-slate-700"
                      aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Confirm New Password</span>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-border bg-white px-4 py-3 pr-12 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 transition-colors hover:text-slate-700"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleUpdatePassword}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-sm btn-press"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
