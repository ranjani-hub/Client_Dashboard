import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGetProgress } from '@workspace/api-client-react';
import { pageTransition, staggerContainer, staggerItem, PageHeader } from '@/components/shared';
import { Trophy, Flame, CalendarCheck, Heart, Sparkles, TrendingUp } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

export default function ProgressPage() {
  const { data: progress, isLoading } = useGetProgress();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <PageHeader title="Your Progress" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded-[24px]"></div>)}
        </div>
        <div className="h-80 bg-muted rounded-[24px]"></div>
      </div>
    );
  }

  if (!progress) return null;

  return (
    <motion.div {...pageTransition} className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <PageHeader 
          title="Your Progress" 
          description="Celebrate how far you've come. Every step counts." 
        />
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold flex items-center gap-2 w-fit">
          <Sparkles className="w-5 h-5" /> Wellness Score: {progress.wellnessScore}/100
        </div>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={staggerItem} className="hex-card bg-gradient-to-br from-success-bg to-white border border-success/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-success/20 text-success flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Goals Achieved</h3>
              <p className="text-sm text-muted-foreground">Milestones reached</p>
            </div>
          </div>
          <p className="text-4xl font-black text-foreground">{progress.goalsAchieved}</p>
        </motion.div>

        <motion.div variants={staggerItem} className="hex-card bg-gradient-to-br from-warning-bg to-white border border-warning/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-warning/20 text-warning flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Current Streak</h3>
              <p className="text-sm text-muted-foreground">Consecutive days</p>
            </div>
          </div>
          <p className="text-4xl font-black text-foreground">{progress.currentStreak}</p>
        </motion.div>

        <motion.div variants={staggerItem} className="hex-card bg-gradient-to-br from-blue-50 to-white border border-blue-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Attendance</h3>
              <p className="text-sm text-muted-foreground">Session completion</p>
            </div>
          </div>
          <p className="text-4xl font-black text-foreground">{progress.attendanceRate}%</p>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="hex-card !p-6 md:!p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" /> Mood Trend
              </h3>
              <p className="text-muted-foreground text-sm mt-1">Your self-reported mood over time</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progress.moodTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 'dataMax']} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="hex-card !p-6 md:!p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" /> Activity Completion
              </h3>
              <p className="text-muted-foreground text-sm mt-1">Weekly exercises finished</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progress.activityCompletion} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <RechartsTooltip 
                  cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                  {progress.activityCompletion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="hsl(var(--success))" fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {progress.goalProgress && progress.goalProgress.length > 0 && (
        <div className="hex-card !p-6 md:!p-8">
          <h3 className="text-xl font-bold mb-6">Current Goals</h3>
          <div className="space-y-6">
            {progress.goalProgress.map((goal, i) => {
              const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span>{goal.name}</span>
                    <span className="text-primary">{goal.current} / {goal.target}</span>
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
