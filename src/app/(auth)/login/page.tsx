'use client';

import { useState, useTransition, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Leaf, 
  Lock, 
  Mail, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  WifiOff, 
  CheckCircle2, 
  Sparkles,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signInAction } from '@/app/auth/actions';
import { signInOffline, createGuestOfflineSession } from '@/lib/offline/auth';
import { useLanguage } from '@/lib/i18n/language-context';
import { LanguageSwitcher } from '@/components/shared/language-switcher';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirectTo') || '/profile';
  const { t } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showOfflineOption, setShowOfflineOption] = useState(false);

  // Monitor online / offline network state reactively
  useEffect(() => {
    const updateOnlineStatus = () => {
      const offline = typeof navigator !== 'undefined' ? !navigator.onLine : false;
      setIsOffline(offline);
      if (offline) setShowOfflineOption(true);
    };

    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Offline Login Handler
  const handleOfflineSignIn = async (userEmail: string, userPass?: string) => {
    try {
      const result = await signInOffline(userEmail, userPass);
      if (result.success && result.profile) {
        setErrorMessage(null);
        setSuccessMessage(t('auth_offline_login_success'));
        setTimeout(() => {
          router.push(redirectTo);
        }, 600);
        return true;
      } else {
        setShowOfflineOption(true);
        setErrorMessage(t('auth_offline_no_account_found'));
        return false;
      }
    } catch {
      setShowOfflineOption(true);
      setErrorMessage(t('auth_offline_no_account_found'));
      return false;
    }
  };

  // Instant Guest / Field Offline Session Handler
  const handleContinueOffline = async () => {
    setErrorMessage(null);
    setSuccessMessage(t('auth_offline_login_success'));
    try {
      await createGuestOfflineSession(
        email.trim() || undefined,
        email.trim() ? email.split('@')[0].replace(/[._-]/g, ' ') : undefined
      );
      setTimeout(() => {
        router.push(redirectTo);
      }, 500);
    } catch {
      router.push(redirectTo);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // If device is offline, authenticate strictly locally without touching the network
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      handleOfflineSignIn(email, password);
      return;
    }

    // If online, attempt Supabase server action with graceful offline fallback
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('redirectTo', redirectTo);

    startTransition(async () => {
      try {
        const result = await signInAction(null, formData);
        if (result && !result.success) {
          // If server rejects credentials or server error
          setErrorMessage(result.error || 'Failed to sign in. Please verify your credentials.');
        } else if (result?.redirectTo) {
          router.push(result.redirectTo);
        }
      } catch (networkError) {
        // Network fetch threw (e.g. WiFi with no internet access or sudden disconnection)
        console.warn('[Login] Network fetch failed, activating offline login mode:', networkError);
        setIsOffline(true);
        setShowOfflineOption(true);
        const loggedIn = await handleOfflineSignIn(email, password);
        if (!loggedIn) {
          setErrorMessage(t('auth_offline_no_account_found'));
        }
      }
    });
  };

  return (
    <Card className="w-full max-w-md bg-slate-900/80 border border-slate-800 hover:border-emerald-400/80 hover:ring-1 hover:ring-emerald-400/40 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] shadow-2xl backdrop-blur-md transition-all duration-300">
      {/* Auth Gateway Mode Tabs (Sign In vs Register) */}
      <div className="p-3 pb-0">
        <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
          <button
            type="button"
            className="py-2 text-xs font-bold rounded-lg bg-emerald-500 text-slate-950 shadow-md transition-all duration-200 cursor-default"
          >
            {t('auth_tab_login')}
          </button>
          <Link
            href={`/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`}
            className="py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg text-center transition-all duration-200 flex items-center justify-center"
          >
            {t('auth_tab_register')}
          </Link>
        </div>
      </div>

      <CardHeader className="space-y-1 text-center pb-4 pt-3">
        <CardTitle className="text-xl font-bold text-white">
          {t('auth_login_title')}
        </CardTitle>
        <CardDescription className="text-xs text-slate-400">
          {t('auth_login_header_sub')}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contextual Banner if user arrived from clicking 'Ask a Question' */}
        {redirectTo === '/diagnose' && (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/70 via-teal-950/60 to-slate-900 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="font-bold text-white text-[12px]">{t('auth_intent_diagnose_title')}</p>
              <p className="text-[11px] text-slate-300 leading-snug">{t('auth_intent_diagnose_desc')}</p>
            </div>
          </div>
        )}

        {/* Offline Mode Active Banner */}
        {isOffline && (
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs space-y-2 shadow-sm animate-in fade-in duration-300">
            <div className="flex items-center gap-2 font-semibold text-amber-300">
              <WifiOff className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{t('auth_offline_badge')}</span>
            </div>
            <p className="text-[11px] text-amber-200/90 leading-relaxed">
              {t('auth_offline_notice')}
            </p>
            <Button
              type="button"
              onClick={handleContinueOffline}
              size="sm"
              className="w-full mt-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border border-amber-300 shadow-md flex items-center justify-center gap-1.5 text-xs h-8"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('auth_btn_continue_offline')}</span>
            </Button>
          </div>
        )}

        {/* Account created notice */}
        {searchParams?.get('registered') === 'check-email' && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs">
            ✓ {t('auth_reg_success_msg')}
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
            {showOfflineOption && (
              <Button
                type="button"
                onClick={handleContinueOffline}
                size="sm"
                className="w-full mt-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold border border-emerald-400/40 text-xs h-8"
              >
                <span>{t('auth_btn_continue_offline')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              {t('auth_email')}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="farmer@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-950/70 border-slate-800 text-white placeholder:text-slate-500 text-base sm:text-sm h-11 sm:h-10 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                {t('auth_password')}
              </Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-950/70 border-slate-800 text-white placeholder:text-slate-500 text-base sm:text-sm h-11 sm:h-10 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full min-h-[44px] h-11 sm:h-10 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold border border-emerald-400/40 hover:border-emerald-300 shadow-lg shadow-emerald-950/50 hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.45)] hover:ring-1 hover:ring-emerald-400/50 flex items-center justify-center gap-2 touch-manipulation hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t('auth_btn_logging_in')}</span>
              </>
            ) : (
              <>
                <span>{isOffline ? t('auth_btn_login') : t('auth_btn_login')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          {/* Quick Offline Bypass Option */}
          {!isOffline && (
            <button
              type="button"
              onClick={handleContinueOffline}
              className="w-full text-center text-[11px] text-slate-400 hover:text-emerald-400 transition-colors pt-1"
            >
              {t('auth_btn_continue_offline')} →
            </button>
          )}
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 text-center text-xs text-slate-400 pt-0">
        <p>
          {t('auth_no_account')}{' '}
          <Link
            href={`/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`}
            className="text-emerald-400 font-semibold hover:underline"
          >
            {t('auth_register_farmer_link')}
          </Link>
        </p>
        <Link href="/" className="text-slate-500 hover:text-slate-300 text-[11px] pt-1">
          ← {t('auth_return_home')}
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950 flex flex-col justify-center items-center p-4 relative">
      {/* Top Bar with Language Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      {/* Top Brand Logo */}
      <div className="mb-6 text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/60 border border-emerald-400/40">
            <Leaf className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <h1 className="font-black text-2xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              {t('brand_name')}
            </h1>
            <p className="text-[11px] text-slate-400 -mt-1 font-medium">
              {t('brand_tagline')}
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
