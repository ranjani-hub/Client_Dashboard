import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard,
  User,
  Video,
  Activity as ActivityIcon,
  ClipboardList,
  LineChart,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
} from 'lucide-react';
import { useGetClientProfile } from '@workspace/api-client-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_SECTIONS = [
  {
    label: 'OVERVIEW',
    items: [
      { path: '/', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/therapist', label: 'My Therapist', icon: User },
      { path: '/sessions', label: 'Sessions', icon: Video },
    ],
  },
  {
    label: 'MY CARE',
    items: [
      { path: '/activities', label: 'Activities', icon: ActivityIcon },
      { path: '/assessments', label: 'Assessments', icon: ClipboardList },
      { path: '/progress', label: 'Progress', icon: LineChart },
    ],
  },
  {
    label: 'RESOURCES',
    items: [
      { path: '/resources', label: 'Resources', icon: BookOpen },
      { path: '/messages', label: 'Messages', icon: MessageSquare },
      { path: '/profile', label: 'Profile', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const [location] = useLocation();
  const { data: profile } = useGetClientProfile();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <>
      <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-sidebar hidden md:flex flex-col z-40">
        {/* Logo */}
        <div className="px-6 py-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <div className="leading-tight">
            <p className="text-white font-bold text-[15px] tracking-tight">Hexpertify</p>
            <p className="text-sidebar-foreground/40 text-[10px] font-medium tracking-widest uppercase">Client Suite</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-5 overflow-y-auto pb-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest text-sidebar-foreground/35 uppercase select-none">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.path;

                  return (
                    <Link key={item.path} href={item.path} className="block">
                      <div
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 cursor-pointer text-sm font-medium
                          ${isActive
                            ? 'bg-sidebar-primary text-white'
                            : 'text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-white'
                          }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom: logout + user */}
        <div className="px-3 pb-4 space-y-1 border-t border-sidebar-border pt-4">
          <button
            onClick={() => setShowLogout(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sidebar-foreground/50 hover:bg-red-500/15 hover:text-red-300 text-sm font-medium cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" strokeWidth={2} />
            <span>Sign out</span>
          </button>

          {profile && (
            <Link href="/profile" className="block">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-sidebar-primary/60 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {profile.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate leading-tight">{profile.name}</p>
                  <p className="text-xs text-sidebar-foreground/40 truncate leading-tight mt-0.5">{profile.email}</p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <AnimatePresence>
        {showLogout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLogout(false)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-border"
            >
              <div className="w-11 h-11 rounded-xl bg-red-50 text-destructive flex items-center justify-center mb-4">
                <LogOut className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-1.5">Sign out</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Are you sure you want to sign out? You'll need to sign back in to access your dashboard.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowLogout(false)} className="flex-1 hex-button-outline">
                  Cancel
                </button>
                <button
                  onClick={() => setShowLogout(false)}
                  className="flex-1 h-[40px] sm:h-[44px] px-5 rounded-lg bg-destructive text-white text-sm font-semibold flex items-center justify-center transition-all duration-200 hover:brightness-110"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function TopNav() {
  const { data: profile } = useGetClientProfile();

  return (
    <header className="h-[60px] bg-white border-b border-border sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <button className="md:hidden text-foreground">
          <Menu className="w-5 h-5" />
        </button>
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-muted/60 text-muted-foreground px-3 py-2 rounded-lg border border-border w-60 focus-within:w-72 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search className="w-3.5 h-3.5 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none flex-1 text-sm placeholder:text-muted-foreground/60"
          />
          <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-white px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors relative">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary ring-2 ring-white"></span>
        </button>

        {/* Mobile avatar */}
        {profile && (
          <Link href="/profile" className="block md:hidden">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                {profile.name.charAt(0)}
              </div>
            )}
          </Link>
        )}
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-[240px] flex flex-col min-h-screen">
        <TopNav />
        <main className="flex-1 p-5 md:p-7 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
