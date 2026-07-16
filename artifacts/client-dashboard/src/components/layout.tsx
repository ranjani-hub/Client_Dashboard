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
  Calendar,
  Flag,
  Plus,
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

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

export function Sidebar() {
  const [location] = useLocation();
  const { data: profile } = useGetClientProfile();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <>
      <aside className="fixed left-0 top-0 bottom-0 w-[220px] bg-sidebar border-r border-sidebar-border hidden md:flex flex-col z-40">
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <div className="leading-tight">
            <p className="text-foreground font-bold text-[14px] tracking-tight">Hexpertify</p>
            <p className="text-muted-foreground text-[9px] font-semibold tracking-widest uppercase">Client Suite</p>
          </div>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 px-3 space-y-4 overflow-y-auto pb-4">
          {NAV_SECTIONS.map(section => (
            <div key={section.label}>
              <p className="px-3 mb-1 text-[9px] font-bold tracking-widest text-muted-foreground/50 uppercase select-none">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const Icon = item.icon;
                  const isActive = location === item.path;
                  return (
                    <Link key={item.path} href={item.path} className="block">
                      <div
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 cursor-pointer text-[13px] font-medium
                          ${isActive
                            ? 'bg-primary text-white'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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

        {/* Bottom */}
        <div className="px-3 pb-4 border-t border-sidebar-border pt-3 space-y-1">
          {/* My Profile link */}
          <Link href="/profile" className="block">
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer text-[13px] font-medium">
              <User className="w-4 h-4 shrink-0" strokeWidth={2} />
              <span>My Profile</span>
            </div>
          </Link>

          {/* User card */}
          {profile && (
            <div className="px-3 py-2.5 rounded-lg bg-muted/60 mt-1">
              <div className="flex items-center gap-2.5 mb-2">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                    {initials(profile.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-foreground truncate leading-tight">{profile.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">Client</p>
                </div>
              </div>

              {/* Available toggle row */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-medium">Available</span>
                {/* Simple toggle pill */}
                <div className="w-8 h-4 rounded-full bg-primary flex items-center justify-end pr-0.5 cursor-pointer">
                  <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
                </div>
              </div>
            </div>
          )}

          {/* Sign out */}
          <button
            onClick={() => setShowLogout(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 text-muted-foreground hover:bg-red-50 hover:text-destructive text-[13px] font-medium cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" strokeWidth={2} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Logout dialog */}
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
              onClick={e => e.stopPropagation()}
              className="bg-card w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-border"
            >
              <div className="w-11 h-11 rounded-xl bg-red-50 text-destructive flex items-center justify-center mb-4">
                <LogOut className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-1.5">Sign out</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Are you sure you want to sign out?
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowLogout(false)} className="flex-1 hex-button-outline">
                  Cancel
                </button>
                <button
                  onClick={() => setShowLogout(false)}
                  className="flex-1 h-[40px] sm:h-[44px] px-5 rounded-lg bg-destructive text-white text-sm font-semibold flex items-center justify-center transition-all hover:brightness-110"
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
    <header className="h-[60px] bg-card border-b border-border sticky top-0 z-30 flex items-center justify-between px-5 gap-4">
      {/* Mobile menu */}
      <button className="md:hidden text-muted-foreground">
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="flex items-center gap-2 bg-background text-muted-foreground px-3 py-2 rounded-lg border border-border w-full focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search className="w-3.5 h-3.5 shrink-0" />
          <input
            type="text"
            placeholder="Search sessions, activities, notes..."
            className="bg-transparent border-none outline-none flex-1 text-sm placeholder:text-muted-foreground/60"
          />
          <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground shrink-0">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1.5">
        {/* Icon buttons */}
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Calendar className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Flag className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary ring-[1.5px] ring-card" />
        </button>

        {/* Quick action button */}
        <button className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-primary text-white text-[13px] font-semibold hover:brightness-110 transition-all">
          <Plus className="w-3.5 h-3.5" />
          Quick action
        </button>

        {/* User avatar */}
        {profile && (
          <Link href="/profile" className="block ml-1">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                {initials(profile.name)}
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
      <div className="md:ml-[220px] flex flex-col min-h-screen">
        <TopNav />
        <main className="flex-1 p-5 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
