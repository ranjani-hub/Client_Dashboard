import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Sparkles, Bell } from 'lucide-react';

export default function Progress() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-[70vh] flex items-center justify-center"
    >
      <div className="text-center max-w-md px-4">
        {/* Icon */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center">
            <LineChart className="w-11 h-11 text-primary" strokeWidth={1.75} />
          </div>
          <span className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </span>
        </div>

        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-semibold mb-5">
          Coming Soon
        </span>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-3">
          Progress Insights
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          We're building a beautiful view of your wellness journey — mood trends,
          activity streaks, goal milestones, and personalised insights. It'll be
          ready soon.
        </p>

        {/* Notify button */}
        <button className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-white text-sm font-semibold hover:brightness-110 transition-all">
          <Bell className="w-4 h-4" />
          Notify me when it's ready
        </button>

        {/* Decorative dots */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {[0, 1, 2, 3, 4].map(i => (
            <motion.div
              key={i}
              className="rounded-full bg-primary/20"
              style={{ width: i === 2 ? 10 : 6, height: i === 2 ? 10 : 6 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
