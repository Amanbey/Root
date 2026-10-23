'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOutAction } from '@/app/auth/actions';

interface SignOutButtonProps {
  variant?: 'outline' | 'ghost' | 'default' | 'destructive';
  className?: string;
  showText?: boolean;
}

export function SignOutButton({
  variant = 'outline',
  className = '',
  showText = true,
}: SignOutButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOutAction();
      router.push('/login');
      router.refresh();
    });
  };

  return (
    <Button
      variant={variant}
      size="sm"
      disabled={isPending}
      onClick={handleSignOut}
      className={`border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80 ${className}`}
      title="Sign Out"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      {showText && <span className="ml-2 text-xs">Sign Out</span>}
    </Button>
  );
}
