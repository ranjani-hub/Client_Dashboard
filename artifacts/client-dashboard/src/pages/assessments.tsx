import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetAssessments, useSubmitAssessment, getGetAssessmentsQueryKey } from '@workspace/api-client-react';
import { pageTransition, staggerContainer, staggerItem, PageHeader } from '@/components/shared';
import { ClipboardList, Clock, Calendar, CheckCircle2, TrendingUp, X } from 'lucide-react';
import { format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export default function AssessmentsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const { data: assessments, isLoading } = useGetAssessments();
  const submitMutation = useSubmitAssessment();
  const queryClient = useQueryClient();
  const [activeAssessmentId, setActiveAssessmentId] = useState<number | null>(null);
  const [score, setScore] = useState<string>('');

  const pending = assessments?.filter(a => a.status === 'pending') || [];
  const completed = assessments?.filter(a => a.status === 'completed') || [];

  const handleSubmit = (id: number) => {
    const numScore = parseInt(score, 10);
    if (isNaN(numScore)) return;

    submitMutation.mutate({ id, data: { score: numScore } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAssessmentsQueryKey() });
        setActiveAssessmentId(null);
        setScore('');
        setActiveTab('completed');
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <PageHeader title="Assessments" />
        <div className="h-64 bg-muted rounded-[24px]"></div>
      </div>
    );
  }

  return (
    <motion.div {...pageTransition} className="max-w-5xl mx-auto space-y-8 pb-12">
      <PageHeader 
        title="Check-ins & Assessments" 
        description="Routine check-ins help us understand your progress and adjust your care." 
      />

      <div className="flex gap-2 p-1 bg-muted/50 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'pending' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Pending ({pending.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'completed' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Completed
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'pending' ? (
          <motion.div key="pending" variants={staggerContainer} initial="hidden" animate="show" exit={{ opacity: 0 }} className="space-y-4">
            {pending.length === 0 ? (
              <div className="hex-card !py-16 text-center">
                <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
                <h3 className="text-xl font-bold">No pending assessments</h3>
                <p className="text-muted-foreground mt-2">You're all up to date. We'll notify you when it's time for the next check-in.</p>
              </div>
            ) : (
              pending.map((assessment) => {
                const isCompleting = activeAssessmentId === assessment.id;
                
                return (
                  <motion.div key={assessment.id} variants={staggerItem} className="hex-card">
                    <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-accent rounded-lg text-primary">
                            <ClipboardList className="w-5 h-5" />
                          </div>
                          <h3 className="text-xl font-bold">{assessment.name}</h3>
                          <span className="px-2 py-1 bg-muted text-xs font-bold rounded text-muted-foreground">
                            {assessment.type}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-4 max-w-2xl">
                          {assessment.description || "A standard check-in to help us track how you're feeling."}
                        </p>
                        <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" /> {assessment.estimatedMinutes} min
                          </span>
                          {assessment.dueDate && (
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" /> Due {format(new Date(assessment.dueDate), 'MMM d')}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="w-full md:w-auto min-w-[200px]">
                        {isCompleting ? (
                          <div className="bg-muted/30 p-4 rounded-xl border border-border">
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-sm font-bold">Enter Score</label>
                              <button onClick={() => setActiveAssessmentId(null)}><X className="w-4 h-4 text-muted-foreground" /></button>
                            </div>
                            <input 
                              type="number" 
                              value={score} 
                              onChange={(e) => setScore(e.target.value)} 
                              className="hex-input w-full mb-3" 
                              placeholder="e.g. 15"
                            />
                            <button 
                              onClick={() => handleSubmit(assessment.id)}
                              disabled={!score || submitMutation.isPending}
                              className="w-full hex-button-primary h-10"
                            >
                              Submit
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setActiveAssessmentId(assessment.id)} className="w-full md:w-auto hex-button-primary">
                            Start Check-in
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        ) : (
          <motion.div key="completed" variants={staggerContainer} initial="hidden" animate="show" exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completed.length === 0 ? (
              <div className="col-span-full hex-card !py-16 text-center">
                <p className="text-muted-foreground">You haven't completed any assessments yet.</p>
              </div>
            ) : (
              completed.map((assessment) => (
                <motion.div key={assessment.id} variants={staggerItem} className="hex-card flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        {assessment.name} <CheckCircle2 className="w-4 h-4 text-success" />
                      </h3>
                      {assessment.completedAt && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Completed {format(new Date(assessment.completedAt), 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                    {assessment.score !== undefined && assessment.score !== null && (
                      <div className="text-center">
                        <div className="text-2xl font-black text-primary">{assessment.score}</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Score</div>
                      </div>
                    )}
                  </div>

                  {assessment.scoreHistory && assessment.scoreHistory.length > 1 && (
                    <div className="mt-auto pt-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Score History
                      </h4>
                      <div className="h-16 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={assessment.scoreHistory}>
                            <YAxis domain={['dataMin - 2', 'dataMax + 2']} hide />
                            <Line 
                              type="monotone" 
                              dataKey="score" 
                              stroke="hsl(var(--primary))" 
                              strokeWidth={3} 
                              dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }} 
                              activeDot={{ r: 6 }} 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
