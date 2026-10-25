'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, User, MessageSquarePlus, Users, LogIn, LayoutDashboard } from 'lucide-react';
import { SignOutButton } from '@/components/shared/sign-out-button';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { useLanguage } from '@/lib/i18n/language-context';
import { createClient } from '@/lib/supabase/client';
import { getActiveOfflineFarmerSync } from '@/lib/offline/auth';

interface NavbarProps {
  userEmail?: string | null;
  farmerName?: string | null;
  avatarUrl?: string | null;
}

export function Navbar({ userEmail: propEmail, farmerName: propName, avatarUrl: propAvatar }: NavbarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [userEmail, setUserEmail] = useState<string | null>(propEmail || null);
  const [farmerName, setFarmerName] = useState<string | null>(propName || null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(propAvatar || null);

  useEffect(() => {
    if (propEmail) setUserEmail(propEmail);
    if (propName) setFarmerName(propName);
    if (propAvatar) setAvatarUrl(propAvatar);

    if (!propEmail && !propName) {
      const offlineFarmer = getActiveOfflineFarmerSync();
      if (offlineFarmer) {
        setUserEmail(offlineFarmer.email || null);
        setFarmerName(offlineFarmer.full_name || 'Farmer');
        if (offlineFarmer.avatar_url) setAvatarUrl(offlineFarmer.avatar_url);
      }
    }

    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setUserEmail(user.email || null);
          if (!propName) {
            setFarmerName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Farmer');
          }
          if (!propAvatar && user.user_metadata?.avatar_url) {
            setAvatarUrl(user.user_metadata.avatar_url);
          }
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUserEmail(session.user.email || null);
          setFarmerName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Farmer');
          if (session.user.user_metadata?.avatar_url) {
            setAvatarUrl(session.user.user_metadata.avatar_url);
          }
        } else if (_event === 'SIGNED_OUT') {
          setUserEmail(null);
          setFarmerName(null);
          setAvatarUrl(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (e) {
      console.warn('Navbar auth subscription fallback:', e);
    }
  }, [propEmail, propName, propAvatar]);

  const navLinks = [
    { href: '/dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
    { href: '/diagnose', label: t('nav_diagnose'), icon: MessageSquarePlus },
    { href: '/community', label: t('nav_community'), icon: Users },
    { href: '/profile', label: t('nav_profile'), icon: User },
  ];

  const mobileNavLinks = [
    { href: '/dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
    { href: '/diagnose', label: t('nav_diagnose'), icon: MessageSquarePlus },
    { href: '/community', label: t('nav_community'), icon: Users },
    { href: '/profile', label: t('nav_profile'), icon: User },
  ];

  const isLandingPage = pathname === '/';
  const isLoggedIn = !!userEmail || !!farmerName;
  const showDashboardNav = !isLandingPage && isLoggedIn;

  const isRouteActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Navbar for All Devices */}
      <header className="border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md sticky top-0 z-50 w-full transition-colors duration-200">
        <div className="w-full max-w-6xl mx-auto px-2.5 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Brand Logo with Dynamic Hover Micro-Animation & Radiant Edge */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 group shrink-0 transition-transform">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-950/40 border border-emerald-400/40 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.5)] group-hover:border-emerald-300 group-hover:ring-2 group-hover:ring-emerald-400/40 transition-all duration-300 ease-out">
              <Leaf className="w-4 h-4 text-slate-950 stroke-[2.5] group-hover:scale-105 transition-transform" />
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-teal-200 transition-all truncate block">
                {t('brand_name')}
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-medium hidden sm:block group-hover:text-slate-300 transition-colors truncate">
                {t('brand_tagline')}
              </span>
            </div>
          </Link>

          {/* Desktop & Tablet Links (md: >= 768px) - ONLY visible in user dashboards after sign in */}
          {showDashboardNav && (
            <nav aria-label="Desktop navigation" className="hidden md:flex items-center gap-1 lg:gap-1.5 shrink min-w-0">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = isRouteActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group relative flex items-center gap-1 lg:gap-1.5 px-2 lg:px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/70 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/90 hover:border-emerald-500/50 hover:shadow-[0_0_15px_-3px_rgba(16,185,129,0.25)] hover:ring-1 hover:ring-emerald-400/30 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:scale-115 ${
                      isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400'
                    }`} />
                    <span className="relative z-10 truncate">{link.label}</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-2.5 right-2.5 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Language Switcher & User Auth Info with Enhanced Radiant Edges */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Global Language Selector Dropdown */}
            <LanguageSwitcher />

            {isLoggedIn ? (
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                {isLandingPage && (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold border border-emerald-400/40 shadow-sm transition-all duration-200"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t('nav_dashboard')}</span>
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="group flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 hover:border-emerald-400/80 hover:bg-slate-900 hover:shadow-[0_0_18px_-3px_rgba(16,185,129,0.35)] hover:ring-1 hover:ring-emerald-400/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 shrink-0"
                  title="Farmer Profile"
                >
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt={farmerName || 'Farmer'}
                      className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-500/50 group-hover:ring-emerald-400 group-hover:scale-110 transition-all shrink-0"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 group-hover:bg-emerald-500/30 group-hover:scale-110 transition-all">
                      {(farmerName || userEmail || 'F')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium truncate max-w-[36px] xs:max-w-[50px] sm:max-w-[70px] md:max-w-[85px] lg:max-w-[120px] group-hover:text-emerald-300 transition-colors">
                    {farmerName || userEmail?.split('@')[0]}
                  </span>
                </Link>
                <SignOutButton
                  showText={true}
                  text={t('nav_sign_out')}
                  textClassName="hidden lg:inline"
                  className="bg-red-950/40 border border-red-500/40 text-red-200 hover:bg-red-900/70 hover:text-white hover:border-red-400 hover:shadow-[0_0_18px_-3px_rgba(239,68,68,0.4)] hover:-translate-y-0.5 active:scale-95 px-2 sm:px-2.5 py-1 text-xs font-semibold h-8 min-h-[32px] rounded-xl shadow-sm shrink-0 transition-all duration-200"
                />
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <Link
                  href="/login"
                  className="px-2 sm:px-2.5 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 text-xs font-semibold transition-all duration-200"
                >
                  {t('auth_tab_login')}
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold border border-emerald-400/40 hover:border-emerald-300 shadow-md shadow-emerald-950/50 hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.45)] hover:ring-1 hover:ring-emerald-400/50 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t('auth_tab_register')}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Persistent Mobile Bottom Navigation Bar (< 768px) - ONLY visible in user dashboards after sign in */}
      {showDashboardNav && (
        <nav
          aria-label="Mobile bottom navigation"
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-xl flex items-center justify-around h-16 safe-area-pb px-1 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]"
        >
          {mobileNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = isRouteActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex-1 flex flex-col items-center justify-center py-1 mx-0.5 rounded-xl transition-all duration-200 touch-manipulation min-h-[48px] active:scale-90 ${
                  isActive
                    ? 'text-emerald-300 font-bold bg-emerald-500/15 border border-emerald-500/40 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent hover:border-emerald-500/30'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-115 ${
                  isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'
                }`} />
                <span className="text-[10px] mt-0.5 tracking-tight leading-none text-center truncate max-w-[65px]">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>
      )}
    </>
  );
}
