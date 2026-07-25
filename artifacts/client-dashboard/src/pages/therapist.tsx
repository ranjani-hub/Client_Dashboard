import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetTherapist } from '@workspace/api-client-react';
import { pageTransition, PageHeader } from '@/components/shared';
import { ShieldCheck, GraduationCap, Globe, HeartPulse, X, Mail, Video } from 'lucide-react';
import { Link } from 'wouter';

export default function TherapistPage() {
  const { data: apiTherapist, isLoading } = useGetTherapist();
  const [showFullProfile, setShowFullProfile] = useState(false);

  const mockTherapist = {
    id: 1,
    name: "Dr. Sarah Jenkins",
    title: "Licensed Clinical Psychologist (Ph.D., Psy.D.)",
    avatarUrl: "https://images.unsplash.com/photo-1594824813566-78a9c3756b57?w=300&auto=format&fit=crop&q=80",
    bio: "Dr. Sarah Jenkins specializes in Cognitive Behavioral Therapy (CBT), Mindfulness-Based Stress Reduction (MBSR), and trauma-informed care. With over 12 years of experience helping individuals navigate anxiety, depression, and life transitions, Dr. Jenkins works collaboratively with clients to build resilience and long-term coping strategies.",
    specializations: ["Cognitive Behavioral Therapy (CBT)", "Mindfulness & Stress Reduction", "Anxiety & Panic Disorders", "Depression & Mood Management"],
    languages: ["English", "Spanish"],
    yearsOfExperience: 12,
    isVerified: true,
    email: "dr.jenkins@hexpertify.com"
  };

  const therapist = apiTherapist || mockTherapist;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <PageHeader title="My Therapist" />
        <div className="h-[400px] bg-muted rounded-[24px]"></div>
      </div>
    );
  }

  return (
    <motion.div {...pageTransition} className="max-w-4xl mx-auto space-y-8 pb-12">
      <PageHeader title="My Therapist" description="Your dedicated partner in your wellness journey." />

      <div className="hex-card !p-8 md:!p-12 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          <div className="shrink-0 relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] overflow-hidden bg-muted shadow-xl shadow-primary/10">
              {therapist.avatarUrl ? (
                <img src={therapist.avatarUrl} alt={therapist.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-accent text-primary flex items-center justify-center text-4xl font-bold">
                  {therapist.name.charAt(0)}
                </div>
              )}
            </div>
            {therapist.isVerified && (
              <div className="absolute -bottom-3 -right-3 bg-white p-1 rounded-full shadow-md text-success">
                <ShieldCheck className="w-8 h-8 fill-success-bg" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">{therapist.name}</h2>
              <p className="text-xl text-primary font-medium">{therapist.title}</p>
            </div>

            <div className="flex flex-wrap gap-3 py-2">
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg text-sm font-medium text-foreground">
                <GraduationCap className="w-4 h-4 text-primary" />
                {therapist.yearsOfExperience} Years Experience
              </div>
              {therapist.languages?.map((lang) => (
                <div key={lang} className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg text-sm font-medium text-foreground">
                  <Globe className="w-4 h-4 text-primary" />
                  {lang}
                </div>
              ))}
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {therapist.specializations?.map((spec) => (
                  <span key={spec} className="bg-accent text-primary px-3 py-1 rounded-full text-sm font-semibold">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 flex flex-wrap gap-4 border-t border-border">
              <button 
                onClick={() => setShowFullProfile(true)}
                className="hex-button-primary flex-1 sm:flex-none"
              >
                View Full Profile
              </button>
              <Link href="/messages" className="hex-button-secondary flex-1 sm:flex-none gap-2">
                <Mail className="w-5 h-5" /> Message
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
          Request to change therapist
        </button>
      </div>

      {/* Profile Slide-over */}
      <AnimatePresence>
        {showFullProfile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
              onClick={() => setShowFullProfile(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-border bg-card">
                <h3 className="text-xl font-bold">Therapist Profile</h3>
                <button 
                  onClick={() => setShowFullProfile(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-[16px] overflow-hidden bg-muted">
                    {therapist.avatarUrl ? (
                      <img src={therapist.avatarUrl} alt={therapist.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-accent text-primary flex items-center justify-center text-2xl font-bold">
                        {therapist.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{therapist.name}</h4>
                    <p className="text-primary font-medium">{therapist.title}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold flex items-center gap-2 text-foreground">
                    <HeartPulse className="w-5 h-5 text-primary" /> About Me
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {therapist.bio || "No bio provided."}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-foreground">Approach & Methodology</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    I believe in a collaborative, client-centered approach. My goal is to create a safe, non-judgmental space where we can explore your thoughts and feelings together. I integrate evidence-based practices tailored to your unique needs.
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-border bg-card">
                <Link 
                  href="/sessions" 
                  onClick={() => setShowFullProfile(false)}
                  className="w-full hex-button-primary flex items-center justify-center gap-2"
                >
                  <Video className="w-5 h-5" /> Schedule Session
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
