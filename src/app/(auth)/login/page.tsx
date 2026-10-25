'use client';

import { useState, useTransition, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Leaf, Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signInAction } from '@/app/auth/actions';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirectTo') || '/profile';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('redirectTo', redirectTo);

    startTransition(async () => {
      const result = await signInAction(null, formData);
      if (result && !result.success) {
        setErrorMessage(result.error || 'Failed to sign in. Please verify your credentials.');
      } else if (result?.redirectTo) {
        router.push(result.redirectTo);
      }
    });
  };

  return (
    <Card className="w-full max-w-md bg-slate-900/80 border-slate-800 shadow-2xl backdrop-blur-md">
      <CardHeader className="space-y-1 text-center pb-4">
        <CardTitle className="text-xl font-bold text-white">
          Farmer Sign In • ይግቡ
        </CardTitle>
        <CardDescription className="text-xs text-slate-400">
          Access your field diagnoses, advice cards, and offline sync
        </CardDescription>
      </CardHeader>

      <CardContent>
        {searchParams?.get('registered') === 'check-email' && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs">
            ✓ Registration successful! You can now sign in with your credentials below.
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="farmer@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-950/70 border-slate-800 text-white placeholder:text-slate-500 text-base sm:text-sm h-11 sm:h-10 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Password
              </Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-950/70 border-slate-800 text-white placeholder:text-slate-500 text-base sm:text-sm h-11 sm:h-10 focus:border-emerald-500"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full min-h-[44px] h-11 sm:h-10 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 touch-manipulation"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 text-center text-xs text-slate-400 pt-0">
        <p>
          Don&apos;t have an account yet?{' '}
          <Link href="/register" className="text-emerald-400 font-semibold hover:underline">
            Register Farmer Profile
          </Link>
        </p>
        <Link href="/" className="text-slate-500 hover:text-slate-300 text-[11px] pt-1">
          ← Return to Home
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950 flex flex-col justify-center items-center p-4">
      {/* Top Brand Logo */}
      <div className="mb-6 text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/60 border border-emerald-400/40">
            <Leaf className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <h1 className="font-black text-2xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              Root
            </h1>
            <p className="text-[11px] text-slate-400 -mt-1 font-medium">
              የኢትዮጵያ አርሶ አደሮች ረዳት
            </p>
          </div>
        </Link>
      </div>

      <Suspense fallback={<div className="text-slate-400 text-sm">Loading sign in form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
