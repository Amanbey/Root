'use client';

import { useState } from 'react';
import { LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOutAction } from '@/app/auth/actions';
import { createClient } from '@/lib/supabase/client';

interface SignOutButtonProps {
  variant?: 'outline' | 'ghost' | 'default' | 'destructive';
  className?: string;
  showText?: boolean;
  text?: string;
}

export function SignOutButton({
  variant = 'outline',
  className = '',
  showText = true,
  text = 'Logout',
}: SignOutButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleSignOut = async () => {
    if (isPending) return;
    setIsPending(true);

    try {
      // 1. Immediately wipe client-side session storage/cookies (sub-10ms)
      const supabase = createClient();
      await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
      
      // Proactively clear any localStorage auth keys
      if (typeof window !== 'undefined' && window.localStorage) {
        for (let i = window.localStorage.length - 1; i >= 0; i--) {
          const key = window.localStorage.key(i);
          if (key && (key.includes('supabase') || key.includes('sb-') || key.includes('auth'))) {
            window.localStorage.removeItem(key);
          }
        }
      }
    } catch {
      // Ignore client signout fallback
    }

    try {
      // 2. Clear server-side session cookies with fast 200ms race timeout
      await Promise.race([
        signOutAction(),
        new Promise((resolve) => setTimeout(resolve, 200)),
      ]);
    } catch {
      // Ignore server signout fallback
    }

    // 3. Immediately hard-navigate to login page, cleanly wiping in-memory state
    window.location.href = '/login';
  };

  return (
    <Button
      variant={variant}
      size="sm"
      disabled={isPending}
      onClick={handleSignOut}
      className={`border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80 touch-manipulation ${className}`}
      title="Logout (ውጣ)"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin text-slate-400 shrink-0" />
      ) : (
        <LogOut className="w-3.5 h-3.5 shrink-0" />
      )}
      {showText && (
        <span className="ml-1.5 text-xs font-semibold">
          {isPending ? 'Logging out...' : text}
        </span>
      )}
    </Button>
  );
}

export const LogoutButton = SignOutButton;
