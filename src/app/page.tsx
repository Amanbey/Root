'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Bot, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  LogIn,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/shared/navbar';
import { useLanguage } from '@/lib/i18n/language-context';
import { createClient } from '@/lib/supabase/client';
import { getActiveOfflineFarmerSync, createGuestOfflineSession } from '@/lib/offline/auth';

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTarget, setAuthTarget] = useState<string>('/diagnose');

  useEffect(() => {
    // Check if offline farmer session exists synchronously
    const offlineFarmer = getActiveOfflineFarmerSync();
    if (offlineFarmer) {
      setIsAuthenticated(true);
      return;
    }

    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        setIsAuthenticated(!!user);
      });
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  const handleActionClick = (target: string, e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setAuthTarget(target);
      setShowAuthModal(true);
    } else {
      router.push(target);
    }
  };

  const agentRoles = [
    {
      role: t('home_agent_orchestrator_title'),
      desc: t('home_agent_orchestrator_desc'),
      icon: '🧠',
      tag: t('home_agent_orchestrator_tag'),
      accent: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    },
    {
      role: t('home_agent_diagnostic_title'),
      desc: t('home_agent_diagnostic_desc'),
      icon: '🔬',
      tag: t('home_agent_diagnostic_tag'),
      accent: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400',
    },
    {
      role: t('home_agent_context_title'),
      desc: t('home_agent_context_desc'),
      icon: '🌍',
      tag: t('home_agent_context_tag'),
      accent: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400',
    },
    {
      role: t('home_agent_knowledge_title'),
      desc: t('home_agent_knowledge_desc'),
      icon: '🤝',
      tag: t('home_agent_knowledge_tag'),
      accent: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400',
    },
    {
      role: t('home_agent_advisor_title'),
      desc: t('home_agent_advisor_desc'),
      icon: '📋',
      tag: t('home_agent_advisor_tag'),
      accent: 'from-lime-500/20 to-emerald-500/10 border-lime-500/30 text-lime-400',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      {/* Unified Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-12 pb-12 sm:pb-16 w-full space-y-10 sm:space-y-12">
        <section className="text-center space-y-5 sm:space-y-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{t('home_badge')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            {t('home_hero_title')} <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 bg-clip-text text-transparent">
              {t('home_hero_highlight')}
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-base leading-relaxed px-1">
            {t('home_hero_description')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-2">
            <Button
              size="lg"
              onClick={(e) => handleActionClick('/diagnose', e)}
              className="w-full sm:w-auto min-h-[48px] bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold px-6 border border-emerald-400/40 hover:border-emerald-300 shadow-xl shadow-emerald-950/60 hover:shadow-[0_0_25px_-3px_rgba(16,185,129,0.5)] hover:ring-2 hover:ring-emerald-400/50 hover:-translate-y-1 active:scale-95 transition-all duration-300"
            >
              {t('home_btn_ask')}
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            {isAuthenticated ? (
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="w-full sm:w-auto min-h-[48px] border border-slate-700 bg-slate-900/60 hover:bg-slate-800 hover:border-emerald-400 hover:ring-1 hover:ring-emerald-400/40 hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.35)] hover:text-white text-slate-200 hover:-translate-y-1 active:scale-95 transition-all duration-300"
              >
                {t('home_btn_dashboard')}
              </Button>
            ) : (
              <Link href="/register?redirectTo=/diagnose" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto min-h-[48px] border border-slate-700 bg-slate-900/60 hover:bg-slate-800 hover:border-emerald-400 hover:ring-1 hover:ring-emerald-400/40 hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.35)] hover:text-white text-slate-200 hover:-translate-y-1 active:scale-95 transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4 mr-1.5 text-emerald-400" />
                  {t('auth_modal_register_btn')}
                </Button>
              </Link>
            )}
          </div>

          {/* Quick Helper for First-Time vs Returning Users */}
          {!isAuthenticated && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-400 animate-in fade-in duration-300">
              <span className="text-slate-400">{t('auth_already_registered_prompt')}?</span>
              <Link
                href="/login?redirectTo=/diagnose"
                className="text-emerald-400 font-semibold hover:underline flex items-center gap-1"
              >
                <LogIn className="w-3 h-3" />
                {t('auth_tab_login')}
              </Link>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">{t('auth_new_user_prompt')}?</span>
              <Link
                href="/register?redirectTo=/diagnose"
                className="text-teal-300 font-semibold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-teal-400" />
                {t('auth_tab_register')}
              </Link>
            </div>
          )}

          {/* Quick Metrics with Radiant Edge Elevation */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 text-center">
            <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:ring-1 hover:ring-emerald-400/40 hover:bg-slate-900/90 hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.35)] cursor-default">
              <div className="text-lg sm:text-xl font-bold text-emerald-400">{t('home_metric_offline')}</div>
              <div className="text-[11px] text-slate-400">{t('home_metric_offline_sub')}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400 hover:ring-1 hover:ring-amber-400/40 hover:bg-slate-900/90 hover:shadow-[0_0_20px_-3px_rgba(245,158,11,0.35)] cursor-default">
              <div className="text-lg sm:text-xl font-bold text-amber-400">{t('home_metric_agents')}</div>
              <div className="text-[11px] text-slate-400">{t('home_metric_agents_sub')}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 transition-all duration-300 hover:-translate-y-1 hover:border-teal-400 hover:ring-1 hover:ring-teal-400/40 hover:bg-slate-900/90 hover:shadow-[0_0_20px_-3px_rgba(20,184,166,0.35)] cursor-default">
              <div className="text-lg sm:text-xl font-bold text-teal-400">{t('home_metric_cost')}</div>
              <div className="text-[11px] text-slate-400">{t('home_metric_cost_sub')}</div>
            </div>
          </div>
        </section>

        {/* Multi-Agent Architecture Showcase with Radiant Edge Glow */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-400" />
                {t('home_council_title')}
              </h2>
              <p className="text-xs text-slate-400">
                {t('home_council_subtitle')}
              </p>
            </div>
            <Badge variant="secondary" className="bg-slate-800/90 text-slate-300 text-[11px] border border-slate-700/60">
              Ollama + Local LLM
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {agentRoles.map((agent) => (
              <Card 
                key={agent.role}
                className={`group bg-slate-900/70 border border-slate-800 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.35)] hover:border-emerald-400/80 hover:ring-1 hover:ring-emerald-400/40 ${agent.accent}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl p-2 rounded-xl bg-slate-950/50 border border-slate-800 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:border-emerald-500/40">
                      {agent.icon}
                    </span>
                    <Badge variant="outline" className="text-[10px] uppercase font-semibold tracking-wider">
                      {agent.tag}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-bold text-white mt-2 group-hover:text-emerald-300 transition-colors">
                    {agent.role}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs text-slate-300 leading-normal">
                    {agent.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}

            {/* Structured Advice Card Preview */}
            <Card className="group bg-gradient-to-br from-emerald-950/70 via-slate-900/80 to-slate-950 border border-emerald-500/40 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.45)] hover:border-emerald-400 hover:ring-1 hover:ring-emerald-400/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl p-2 rounded-xl bg-emerald-950/50 border border-emerald-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    💡
                  </span>
                  <Badge className="bg-emerald-500 text-slate-950 font-bold text-[10px]">
                    {t('card_confirmed')}
                  </Badge>
                </div>
                <CardTitle className="text-sm font-bold text-emerald-300 mt-2">
                  {t('card_title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-slate-300">
                  {t('dash_subtitle')}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t('card_cached_badge')}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Offline First Principles */}
        <section className="rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 p-6 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            {t('prof_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="space-y-1.5">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {t('status_cached_ready')}
              </p>
              <p className="text-slate-400">
                {t('offline_screen_description')}
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                {t('home_badge')}
              </p>
              <p className="text-slate-400">
                {t('home_hero_description')}
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                {t('comm_badge')}
              </p>
              <p className="text-slate-400">
                {t('comm_subtitle')}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 pt-6 pb-8 md:pb-6 text-center text-xs text-slate-500">
        <p>{t('footer_text')}</p>
      </footer>

      {/* Interactive Auth Gateway Modal for First-Time or Unauthenticated Users */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-emerald-500/50 shadow-2xl shadow-emerald-950/80 ring-1 ring-emerald-400/40 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-2 pt-1">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/60 border border-emerald-400/40">
                <Bot className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {t('auth_modal_title')}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                {t('auth_modal_subtitle')}
              </p>
            </div>

            {/* Gateway Choices */}
            <div className="space-y-3 pt-2">
              {/* Option 1: Already registered -> Sign In */}
              <Link
                href={`/login?redirectTo=${encodeURIComponent(authTarget)}`}
                className="w-full block"
              >
                <Button
                  size="lg"
                  className="w-full min-h-[48px] bg-slate-900 hover:bg-slate-800 text-white font-bold border border-slate-700 hover:border-emerald-400 hover:ring-1 hover:ring-emerald-400/40 hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.35)] justify-between px-4 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2.5">
                    <LogIn className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="text-xs sm:text-sm">{t('auth_modal_login_btn')}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              {/* Option 2: New user -> Register */}
              <Link
                href={`/register?redirectTo=${encodeURIComponent(authTarget)}`}
                className="w-full block"
              >
                <Button
                  size="lg"
                  className="w-full min-h-[48px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold border border-emerald-400/40 hover:border-emerald-300 shadow-lg shadow-emerald-950/50 hover:shadow-[0_0_25px_-3px_rgba(16,185,129,0.45)] hover:ring-1 hover:ring-emerald-400/50 justify-between px-4 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-300 group-hover:rotate-12 transition-transform" />
                    <span className="text-xs sm:text-sm">{t('auth_modal_register_btn')}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              {/* Option 3: Continue as Guest / Offline */}
              <button
                type="button"
                onClick={async () => {
                  setShowAuthModal(false);
                  await createGuestOfflineSession();
                  window.location.href = authTarget;
                }}
                className="w-full text-center text-xs text-slate-400 hover:text-emerald-400 transition-colors py-2 flex items-center justify-center gap-1.5"
              >
                <span>⚡ {t('auth_btn_continue_offline')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
