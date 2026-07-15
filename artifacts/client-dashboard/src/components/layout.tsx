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
  X
} from 'lucide-react';
import { useGetClientProfile } from '@workspace/api-client-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: LayoutDashboard },
  { path: '/therapist', label: 'My Therapist', icon: User },
  { path: '/sessions', label: 'Sessions', icon: Video },
  { path: '/activities', label: 'Activities', icon: ActivityIcon },
  { path: '/assessments', label: 'Assessments', icon: ClipboardList },
  { path: '/progress', label: 'Progress', icon: LineChart },
  { path: '/resources', label: 'Resources', icon: BookOpen },
  { path: '/messages', label: 'Messages', icon: MessageSquare },
  { path: '/profile', label: 'Profile', icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();
  const { data: profile } = useGetClientProfile();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <>
      <aside className="fixed left-0 top-0 bottom-0 w-[250px] bg-white border-r border-border hidden md:flex flex-col z-40 shadow-sm">
        <div className="p-8">
          <div className="flex items-center gap-3 text-primary font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white">
              <span className="text-lg">H</span>
            </div>
            Hexpertify
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pb-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link key={item.path} href={item.path} className="block">
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? 'bg-accent text-primary font-semibold' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground font-medium'
                    }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}

          <div className="pt-6 pb-2">
            <div className="h-px bg-border w-full" />
          </div>

          <button
            onClick={() => setShowLogout(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-muted-foreground hover:bg-red-50 hover:text-destructive font-medium cursor-pointer"
          >
            <LogOut className="w-5 h-5" strokeWidth={2} />
            <span>Logout</span>
          </button>
        </nav>

        {profile && (
          <div className="p-4 mt-auto">
            <Link href="/profile" className="block">
              <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted transition-colors cursor-pointer">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {profile.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{profile.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
                </div>
              </div>
            </Link>
          </div>
        )}
      </aside>

      {/* Logout Confirmation Dialog */}
      <AnimatePresence>
        {showLogout && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowLogout(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card w-full max-w-sm rounded-[24px] shadow-2xl p-6"
              >
                <div className="w-12 h-12 rounded-full bg-red-50 text-destructive flex items-center justify-center mb-4">
                  <LogOut className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Log out</h3>
                <p className="text-muted-foreground mb-8">
                  Are you sure you want to log out? You'll need to sign back in to access your dashboard.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLogout(false)}
                    className="flex-1 hex-button-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowLogout(false);
                      // Handle actual logout if auth existed
                    }}
                    className="flex-1 h-[44px] sm:h-[48px] px-6 rounded-full bg-destructive text-white font-semibold flex items-center justify-center transition-all duration-200 hover:brightness-92"
                  >
                    Log Out
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function TopNav() {
  const { data: profile } = useGetClientProfile();

  return (
    <header className="h-[70px] bg-white/80 backdrop-blur-xl border-b border-border sticky top-0 z-30 flex items-center justify-between px-6 md:px-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-foreground">
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden md:flex items-center gap-2 bg-muted/50 text-muted-foreground px-4 py-2 rounded-full border border-border w-64 focus-within:w-80 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search className="w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none flex-1 text-sm placeholder:text-muted-foreground/70"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary ring-2 ring-white"></span>
        </button>
        
        {profile && (
          <Link href="/profile" className="block md:hidden">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
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
      <div className="md:ml-[250px] flex flex-col min-h-screen">
        <TopNav />
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
