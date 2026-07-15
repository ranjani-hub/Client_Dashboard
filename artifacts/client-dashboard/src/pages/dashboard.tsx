import React from 'react';
import { motion } from 'framer-motion';
import { useGetDashboard } from '@workspace/api-client-react';
import { pageTransition, staggerContainer, staggerItem } from '@/components/shared';
import { Activity as ActivityIcon, CheckCircle2, Flame, Target, Calendar, MessageSquare, PlayCircle, ExternalLink, ArrowRight, BookOpen } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Link } from 'wouter';

export default function Dashboard() {
  const { data, isLoading } = useGetDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-48 bg-muted rounded-[24px]"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted rounded-[20px]"></div>)}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const {
    clientName,
    activitiesCompleted,
    currentStreak,
    goalsAchieved,
    upcomingSession,
    todayTasks,
    recentMessage,
    sharedResources
  } = data;

  return (
    <motion.div {...pageTransition} className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-primary/90 to-primary text-white p-8 md:p-10 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Good morning, {clientName}</h1>
            <p className="text-primary-foreground/90 text-lg leading-relaxed">
              "The beautiful thing about learning is that no one can take it away from you."
            </p>
          </div>
          
          {upcomingSession && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 min-w-[280px]">
              <p className="text-sm text-primary-foreground/80 font-medium uppercase tracking-wider mb-2">Next Session</p>
              <div className="flex items-center gap-3 mb-4">
                {upcomingSession.therapistAvatarUrl ? (
                  <img src={upcomingSession.therapistAvatarUrl} alt={upcomingSession.therapistName} className="w-12 h-12 rounded-full border-2 border-white/30" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    {upcomingSession.therapistName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold">{upcomingSession.therapistName}</p>
                  <p className="text-sm text-primary-foreground/90">
                    {format(new Date(upcomingSession.scheduledAt), 'MMM d, h:mm a')}
                  </p>
                </div>
              </div>
              {upcomingSession.joinUrl ? (
                <a href={upcomingSession.joinUrl} target="_blank" rel="noreferrer" className="w-full h-10 rounded-full bg-white text-primary font-semibold flex items-center justify-center hover:bg-white/90 transition-colors">
                  Join Session
                </a>
              ) : (
                <div className="w-full h-10 rounded-full bg-white/20 text-white font-medium flex items-center justify-center">
                  Link available soon
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Progress Snapshots */}
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Activities Done', value: activitiesCompleted, icon: CheckCircle2, color: 'text-success', bg: 'bg-success-bg' },
          { label: 'Day Streak', value: currentStreak, icon: Flame, color: 'text-warning', bg: 'bg-warning-bg' },
          { label: 'Goals Achieved', value: goalsAchieved, icon: Target, color: 'text-primary', bg: 'bg-accent' },
          { label: 'Upcoming', value: upcomingSession ? 1 : 0, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' }
        ].map((stat, i) => (
          <motion.div key={i} variants={staggerItem} className="hex-card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Today's Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Today's Focus</h2>
            <Link href="/activities" className="text-primary font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {todayTasks.length > 0 ? (
              todayTasks.map((task) => (
                <div key={task.id} className="hex-card !p-5 flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary">
                      <ActivityIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">{task.estimatedMinutes} mins • {task.difficulty}</p>
                    </div>
                  </div>
                  <Link href="/activities" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                    <PlayCircle className="w-5 h-5" />
                  </Link>
                </div>
              ))
            ) : (
              <div className="hex-card !py-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-success-bg text-success flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg mb-1">All caught up!</h3>
                <p className="text-muted-foreground">You've completed all tasks for today. Enjoy your rest.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Message & Quick Actions */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Messages</h2>
              <Link href="/messages" className="text-primary font-medium hover:underline text-sm">Open</Link>
            </div>
            
            {recentMessage ? (
              <Link href="/messages" className="block">
                <div className="hex-card !p-5 cursor-pointer hover:border-primary/20 border border-transparent">
                  <div className="flex items-center gap-3 mb-3">
                    {recentMessage.senderAvatarUrl ? (
                      <img src={recentMessage.senderAvatarUrl} className="w-10 h-10 rounded-full" alt="" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-accent text-primary flex items-center justify-center font-bold">
                        {recentMessage.senderName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-sm">{recentMessage.senderName}</p>
                      <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(recentMessage.sentAt), { addSuffix: true })}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground line-clamp-2">{recentMessage.content}</p>
                </div>
              </Link>
            ) : (
              <div className="hex-card !p-6 text-center">
                <p className="text-muted-foreground text-sm">No recent messages.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shared Resources */}
      {sharedResources.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recommended for You</h2>
            <Link href="/resources" className="text-primary font-medium text-sm hover:underline">View Library</Link>
          </div>
          
          <div className="flex overflow-x-auto pb-6 -mx-2 px-2 gap-4 snap-x">
            {sharedResources.map((resource) => (
              <div key={resource.id} className="snap-start shrink-0 w-[280px] hex-card !p-4 flex flex-col">
                {resource.thumbnailUrl ? (
                  <div className="w-full h-32 rounded-xl bg-muted mb-4 overflow-hidden">
                    <img src={resource.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-32 rounded-xl bg-accent text-primary flex items-center justify-center mb-4">
                    <BookOpen className="w-10 h-10 opacity-50" />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-accent text-primary rounded-md">
                    {resource.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{resource.readingMinutes} min</span>
                </div>
                <h3 className="font-semibold leading-tight mb-4 flex-1 line-clamp-2">{resource.title}</h3>
                <Link href="/resources" className="text-sm text-primary font-medium flex items-center gap-1">
                  Open Resource <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}
