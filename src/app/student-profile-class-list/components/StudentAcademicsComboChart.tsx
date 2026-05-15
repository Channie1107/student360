'use client';
import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList
} from 'recharts';

interface SubjectData {
  name: string;
  score: number;
}

interface ComboChartProps {
  subjects: SubjectData[];
  studentName: string;
}

export default function StudentAcademicsComboChart({ subjects, studentName }: ComboChartProps) {
  const [term, setTerm] = useState('Term 1');

  // Generate mock class average data for the demonstration
  const chartData = subjects.map((sub) => {
    // Determine a fake class average that looks realistic compared to the score
    const classAvg = Math.max(60, Math.min(95, Math.round(sub.score * 0.5 + 40 + (Math.random() * 10 - 5))));
    
    return {
      subject: sub.name.replace(' HL', '').replace(' SL', ''), // Shorten names for x-axis
      score: sub.score,
      classAvg: classAvg,
      diff: sub.score - classAvg
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const scoreData = payload.find((p: any) => p.dataKey === 'score');
      const avgData = payload.find((p: any) => p.dataKey === 'classAvg');
      const score = scoreData?.value;
      const avg = avgData?.value;
      const diff = score - avg;

      return (
        <div className="bg-card border border-border rounded-xl p-3 shadow-elevated text-sm min-w-[200px]">
          <p className="font-bold text-foreground mb-2 pb-2 border-b border-border">{label}</p>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#5b1d8d]"></span>
                <span className="text-muted-foreground">{studentName}&apos;s Score:</span>
              </span>
              <span className="font-bold text-primary">{score}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ffd900]"></span>
                <span className="text-muted-foreground">Class Avg:</span>
              </span>
              <span className="font-bold text-foreground">{avg}%</span>
            </div>
            <div className="pt-2 mt-2 border-t border-border/50 text-xs">
              {diff > 0 ? (
                <span className="text-success font-medium">+{diff}% above class average. Great job!</span>
              ) : diff < 0 ? (
                <span className="text-danger font-medium">{diff}% below class average. Needs attention.</span>
              ) : (
                <span className="text-foreground font-medium">Exactly at class average.</span>
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">GPA Performance by Subject</h3>
          <p className="text-xs text-muted-foreground">Comparison of individual scores vs class average</p>
        </div>
        <select 
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="text-xs border border-border rounded-lg px-2 py-1.5 bg-background text-foreground focus:outline-none focus:border-primary"
        >
          <option>Term 1</option>
          <option>Term 2</option>
          <option>Full Year</option>
        </select>
      </div>

      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis 
              dataKey="subject" 
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} 
              axisLine={false} 
              tickLine={false}
              dy={10}
            />
            <YAxis 
              domain={[0, 100]} 
              ticks={[0, 20, 40, 60, 80, 100]}
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} 
              axisLine={false} 
              tickLine={false} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
            
            <Bar dataKey="score" fill="#5b1d8d" radius={[4, 4, 0, 0]} maxBarSize={40}>
              <LabelList dataKey="score" position="top" fill="#5b1d8d" fontSize={11} fontWeight="bold" formatter={(val: number) => `${val}%`} />
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#5b1d8d" />
              ))}
            </Bar>
            
            <Line 
              type="monotone" 
              dataKey="classAvg" 
              stroke="#ffd900" 
              strokeWidth={3} 
              dot={{ fill: '#ffd900', stroke: '#fff', strokeWidth: 2, r: 5 }} 
              activeDot={{ r: 7, fill: '#ffd900', stroke: '#fff' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-border text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#5b1d8d]"></span>
          <span className="text-muted-foreground font-medium">{studentName}&apos;s Score</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ffd900]"></span>
          <span className="text-muted-foreground font-medium">Class Average</span>
        </div>
      </div>
    </div>
  );
}
