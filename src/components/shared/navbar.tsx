'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, User, MessageSquarePlus, Users, LogIn } from 'lucide-react';
import { SignOutButton } from '@/components/shared/sign-out-button';
import { createClient } from '@/lib/supabase/client';

interface NavbarProps {
  userEmail?: string | null;
  farmerName?: string | null;
}

export function Navbar({ userEmail: propEmail, farmerName: propName }: NavbarProps) {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(propEmail || null);
  const [farmerName, setFarmerName] = useState<string | null>(propName || null);

  useEffect(() => {
    if (propEmail) setUserEmail(propEmail);
    if (propName) setFarmerName(propName);

    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setUserEmail(user.email || null);
          if (!propName) {
            setFarmerName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Farmer');
          }
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUserEmail(session.user.email || null);
          setFarmerName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Farmer');
        } else if (_event === 'SIGNED_OUT') {
          setUserEmail(null);
          setFarmerName(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (e) {
      console.warn('Navbar auth subscription fallback:', e);
    }
  }, [propEmail, propName]);

  const navLinks = [
    { href: '/diagnose', label: 'Diagnose', amharic: 'ምርመራ', icon: MessageSquarePlus },
    { href: '/community', label: 'Community', amharic: 'ማህበረሰብ', icon: Users },
    { href: '/profile', label: 'Farmer Profile', amharic: 'መገለጫ', icon: User },
  ];

  const mobileNavLinks = [
    { href: '/', label: 'Home', amharic: 'መነሻ', icon: Leaf },
    { href: '/diagnose', label: 'Diagnose', amharic: 'ምርመራ', icon: MessageSquarePlus },
    { href: '/community', label: 'Community', amharic: 'ማህበረሰብ', icon: Users },
    { href: '/profile', label: 'Profile', amharic: 'መገለጫ', icon: User },
  ];

  const isLoggedIn = !!userEmail || !!farmerName;

  const isRouteActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Navbar for All Devices */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-950/40 border border-emerald-400/40 group-hover:scale-105 transition-transform">
              <Leaf className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                Root
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-medium hidden sm:block">
                የግብርና ምክር
              </span>
            </div>
          </Link>

          {/* Desktop & Tablet Links (md: >= 768px) */}
          <nav aria-label="Desktop navigation" className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = isRouteActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Auth Info / Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {isLoggedIn ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-200 hover:border-emerald-500/40 transition-colors"
                  title="Farmer Profile (መገለጫ)"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                    {(farmerName || userEmail || 'F')[0].toUpperCase()}
                  </div>
                  <span className="font-medium truncate max-w-[50px] xs:max-w-[80px] sm:max-w-[130px]">
                    {farmerName || userEmail?.split('@')[0]}
                  </span>
                </Link>
                <SignOutButton
                  showText={true}
                  text="Logout"
                  className="bg-red-950/40 border-red-500/40 text-red-200 hover:bg-red-900/70 hover:text-white active:scale-95 px-2.5 sm:px-3 py-1 text-xs font-semibold h-8 min-h-[32px] rounded-lg shadow-sm shadow-red-950/40 shrink-0"
                />
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/50 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Persistent Mobile Bottom Navigation Bar (< 768px) */}
      <nav
        aria-label="Mobile bottom navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-xl flex items-center justify-around h-16 safe-area-pb px-2"
      >
        {mobileNavLinks.map((link) => {
          const Icon = link.icon;
          const isActive = isRouteActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all touch-manipulation min-h-[48px] ${
                isActive
                  ? 'text-emerald-400 font-bold bg-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight leading-none">
                {link.label}
              </span>
              <span className="text-[8px] opacity-70 leading-none mt-0.5">
                {link.amharic}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
