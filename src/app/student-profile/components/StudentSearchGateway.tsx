'use client';

import React, { useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';

const recentStudents = [
  { id: 'student-PRE43178', studentId: 'PRE43178', name: 'Evelyn Harper', grade: 'Grade 11', class: '11A' },
  { id: 'student-PRE43102', studentId: 'PRE43102', name: 'Nguyen Bao Long', grade: 'Grade 12', class: '12DP' },
  { id: 'student-PRE43215', studentId: 'PRE43215', name: 'Sofia Tran', grade: 'Grade 10', class: '10B' },
  { id: 'student-PRE43089', studentId: 'PRE43089', name: 'James Pham', grade: 'Grade 11', class: '11B' },
];

export default function StudentSearchGateway() {
  const [query, setQuery] = useState('PRE43178 - Evelyn Harper');
  const [focused, setFocused] = useState(false);

  return (
    <div className="bg-card rounded-2xl shadow-card p-4 mb-5 fade-in">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[260px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e?.target?.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Search by Student ID (PRE-XXXXX) or name..."
            className="w-full pl-9 pr-9 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
          {/* Dropdown */}
          {focused && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-modal z-50 overflow-hidden">
              <div className="px-3 py-2 border-b border-border">
                <span className="text-2xs font-600 text-muted-foreground uppercase tracking-wide">
                  Recent Students
                </span>
              </div>
              {recentStudents?.map((s) => (
                <button
                  key={s?.id}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted transition-colors text-left"
                  onClick={() => setQuery(`${s?.studentId} - ${s?.name}`)}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #7b2db8, #5b1d8d)' }}
                    >
                      {s?.name?.split(' ')?.map((n) => n?.[0])?.join('')?.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{s?.name}</p>
                      <p className="text-2xs text-muted-foreground">{s?.studentId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{s?.grade}</p>
                    <p className="text-2xs text-muted-foreground">{s?.class}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              className="appearance-none bg-white border border-border rounded-xl pl-3 pr-7 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            >
              <option>Grade 11</option>
              <option>Grade 10</option>
              <option>Grade 12</option>
            </select>
            <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
          <button
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white btn-press transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            Load Profile
          </button>
        </div>
      </div>
    </div>
  );
}