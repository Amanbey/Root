'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, User, MessageSquarePlus, Users, LogIn } from 'lucide-react';
import { SignOutButton } from '@/components/shared/sign-out-button';

interface NavbarProps {
  userEmail?: string | null;
  farmerName?: string | null;
}

export function Navbar({ userEmail, farmerName }: NavbarProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/diagnose', label: 'Diagnose', icon: MessageSquarePlus },
    { href: '/community', label: 'Community', icon: Users },
    { href: '/profile', label: 'Farmer Profile', icon: User },
  ];

  const isLoggedIn = !!userEmail || !!farmerName;

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-950/40 border border-emerald-400/40 group-hover:scale-105 transition-transform">
            <Leaf className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              Root
            </span>
            <span className="text-[10px] text-slate-400 block -mt-1 font-medium">
              የግብርና ምክር
            </span>
          </div>
        </Link>

        {/* Desktop / Tablet Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User Auth Info / Actions */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-200 hover:border-emerald-500/40 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                  {(farmerName || userEmail || 'F')[0].toUpperCase()}
                </div>
                <span className="font-medium hidden sm:inline truncate max-w-[120px]">
                  {farmerName || userEmail?.split('@')[0]}
                </span>
              </Link>
              <SignOutButton showText={false} />
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/50 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
