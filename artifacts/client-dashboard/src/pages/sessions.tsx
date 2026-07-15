import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGetSessions, useCancelSession } from '@workspace/api-client-react';
import { pageTransition, staggerContainer, staggerItem, PageHeader } from '@/components/shared';
import { Calendar, Clock, Video, XCircle, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import { getGetSessionsQueryKey } from '@workspace/api-client-react';

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const { data: sessions, isLoading } = useGetSessions({ status: activeTab });
  const cancelMutation = useCancelSession();
  const queryClient = useQueryClient();

  const handleCancel = (id: number) => {
    if (confirm('Are you sure you want to cancel this session?')) {
      cancelMutation.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSessionsQueryKey({ status: 'upcoming' }) });
          queryClient.invalidateQueries({ queryKey: getGetSessionsQueryKey({ status: 'cancelled' }) });
        }
      });
    }
  };

  return (
    <motion.div {...pageTransition} className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <PageHeader title="Sessions" description="Manage your therapy appointments." />
        <button className="hex-button-primary">Book New Session</button>
      </div>

      <div className="flex gap-2 p-1 bg-muted/50 rounded-xl w-fit">
        {(['upcoming', 'past', 'cancelled'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm capitalize transition-all ${
              activeTab === tab 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map(i => <div key={i} className="h-48 bg-muted rounded-[24px]"></div>)}
        </div>
      ) : sessions?.length === 0 ? (
        <div className="hex-card !py-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-accent text-primary flex items-center justify-center mb-6">
            <Calendar className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No {activeTab} sessions</h3>
          <p className="text-muted-foreground max-w-md">
            {activeTab === 'upcoming' 
              ? "You don't have any sessions scheduled right now. Book one when you're ready." 
              : `You don't have any ${activeTab} sessions to show here.`}
          </p>
        </div>
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-4">
          {sessions?.map((session) => (
            <motion.div key={session.id} variants={staggerItem} className="hex-card flex flex-col sm:flex-row gap-6">
              {/* Date Block */}
              <div className="w-full sm:w-32 shrink-0 bg-accent rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-primary font-bold uppercase tracking-wider text-sm">
                  {format(new Date(session.scheduledAt), 'MMM')}
                </span>
                <span className="text-4xl font-black text-primary my-1">
                  {format(new Date(session.scheduledAt), 'd')}
                </span>
                <span className="text-primary/70 font-medium text-sm">
                  {format(new Date(session.scheduledAt), 'EEEE')}
                </span>
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">Therapy Session</h3>
                    <div className="flex items-center gap-4 text-muted-foreground text-sm font-medium">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {format(new Date(session.scheduledAt), 'h:mm a')}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {session.durationMinutes} min
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.therapistAvatarUrl ? (
                      <img src={session.therapistAvatarUrl} alt={session.therapistName} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                        {session.therapistName.charAt(0)}
                      </div>
                    )}
                    <span className="font-semibold text-sm hidden sm:inline-block">{session.therapistName}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border mt-auto">
                  {activeTab === 'upcoming' && (
                    <>
                      {session.joinUrl ? (
                        <a href={session.joinUrl} target="_blank" rel="noreferrer" className="hex-button-primary flex-1 sm:flex-none gap-2">
                          <Video className="w-5 h-5" /> Join Session
                        </a>
                      ) : (
                        <button disabled className="h-[48px] px-6 rounded-full bg-muted text-muted-foreground font-semibold flex items-center justify-center flex-1 sm:flex-none cursor-not-allowed">
                          Link available soon
                        </button>
                      )}
                      <div className="flex gap-3 w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto">
                        <button className="hex-button-outline flex-1 sm:flex-none gap-2 text-sm">
                          <RefreshCw className="w-4 h-4" /> Reschedule
                        </button>
                        <button 
                          onClick={() => handleCancel(session.id)}
                          disabled={cancelMutation.isPending}
                          className="h-[48px] px-6 rounded-full bg-red-50 text-destructive font-semibold flex items-center justify-center flex-1 sm:flex-none hover:bg-red-100 transition-colors text-sm gap-2"
                        >
                          <XCircle className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    </>
                  )}
                  {activeTab === 'past' && (
                    <div className="flex items-center gap-2 text-success font-medium bg-success-bg px-4 py-2 rounded-lg text-sm">
                      <CheckCircle2 className="w-4 h-4" /> Completed
                    </div>
                  )}
                  {activeTab === 'cancelled' && (
                    <div className="flex items-center gap-2 text-destructive font-medium bg-red-50 px-4 py-2 rounded-lg text-sm">
                      <AlertCircle className="w-4 h-4" /> Cancelled
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
