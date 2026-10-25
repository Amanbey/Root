'use client';

import Link from 'next/link';
import { 
  Bot, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/shared/navbar';

export default function HomePage() {
  const agentRoles = [
    {
      role: 'Orchestrator Agent',
      desc: 'Coordinates specialized agents, synthesizes findings, and manages real-time farmer timelines.',
      icon: '🧠',
      tag: 'Lead Coordinator',
      accent: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    },
    {
      role: 'Diagnostic Agent',
      desc: 'Analyzes visual symptoms, blight patterns, pest infestations, and crop leaf discolorations.',
      icon: '🔬',
      tag: 'Vision & Symptom AI',
      accent: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400',
    },
    {
      role: 'Local Context Agent',
      desc: 'Adapts advice to Ethiopian agro-ecological zones (Weyna Dega, Dega, Kolla), soils & rainy seasons.',
      icon: '🌍',
      tag: 'Ethiopian Agronomy',
      accent: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400',
    },
    {
      role: 'Community Knowledge Agent',
      desc: 'Matches current problem against peer-verified farmer solutions stored in vector memory.',
      icon: '🤝',
      tag: 'Local Farmer Memory',
      accent: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400',
    },
    {
      role: 'Advisor Agent',
      desc: 'Produces actionable, low-cost, pesticide-safe step-by-step Advice Cards with zero jargon.',
      icon: '📋',
      tag: 'Structured Cards',
      accent: 'from-lime-500/20 to-emerald-500/10 border-lime-500/30 text-lime-400',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      {/* Unified Navbar (Top & Mobile Bottom Navigation) */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-12 pb-24 sm:pb-16 w-full space-y-10 sm:space-y-12">
        <section className="text-center space-y-5 sm:space-y-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Offline-First Multi-Agent Agronomy</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Practical Crop Advice, <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 bg-clip-text text-transparent">
              Even With Zero Internet.
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-base leading-relaxed px-1">
            Diagnose pest damage, blight, and nutrient deficiencies directly in the field. 
            Root deploys an offline-first team of specialized AI agents running on local Ollama intelligence and peer-verified Ethiopian agricultural knowledge.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-2">
            <Link href="/diagnose" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto min-h-[48px] bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold px-6 shadow-xl shadow-emerald-950/60">
                Ask a Crop Question
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto min-h-[48px] border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200">
                Farmer Dashboard
              </Button>
            </Link>
          </div>

          {/* Quick Metrics / Guarantees */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 text-center">
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <div className="text-lg sm:text-xl font-bold text-emerald-400">100%</div>
              <div className="text-[11px] text-slate-400">Offline Usable</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <div className="text-lg sm:text-xl font-bold text-amber-400">5+</div>
              <div className="text-[11px] text-slate-400">Collaborative Agents</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <div className="text-lg sm:text-xl font-bold text-teal-400">0 ETB</div>
              <div className="text-[11px] text-slate-400">Farmer Cost</div>
            </div>
          </div>
        </section>

        {/* Multi-Agent Architecture Showcase */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-400" />
                Collaborative Agent Council
              </h2>
              <p className="text-xs text-slate-400">
                How specialized agents collaborate before delivering your verified Advice Card
              </p>
            </div>
            <Badge variant="secondary" className="bg-slate-800/90 text-slate-300 text-[11px]">
              Ollama + Local LLM
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {agentRoles.map((agent) => (
              <Card 
                key={agent.role}
                className={`bg-slate-900/70 border backdrop-blur-sm transition-all hover:translate-y-[-2px] hover:shadow-lg ${agent.accent}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl p-2 rounded-lg bg-slate-950/50 border border-slate-800">
                      {agent.icon}
                    </span>
                    <Badge variant="outline" className="text-[10px] uppercase font-semibold tracking-wider">
                      {agent.tag}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-bold text-white mt-2">
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
            <Card className="bg-gradient-to-br from-emerald-950/70 via-slate-900/80 to-slate-950 border-emerald-500/40 flex flex-col justify-between">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl p-2 rounded-lg bg-emerald-950/50 border border-emerald-500/30">
                    💡
                  </span>
                  <Badge className="bg-emerald-500 text-slate-950 font-bold text-[10px]">
                    Actionable Result
                  </Badge>
                </div>
                <CardTitle className="text-sm font-bold text-emerald-300 mt-2">
                  Structured Advice Cards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-slate-300">
                  Every run outputs practical cards with clear confidence scores, urgency indicators, organic remedies, and step-by-step guides.
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Saveable to local device memory
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Offline First & Low-Literacy Principles */}
        <section className="rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 p-6 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Designed For The Realities Of Ethiopian Smallholders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="space-y-1.5">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                No Continuous Data Plan Needed
              </p>
              <p className="text-slate-400">
                PWA caching stores UI, models, and past cards. Offline queries queue safely in IndexedDB until sync.
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Visual & High-Contrast Design
              </p>
              <p className="text-slate-400">
                Color-coded risk badges, intuitive agro-icons, and simple card summaries make advice readable even in direct sunlight.
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                Community Feedback Loop
              </p>
              <p className="text-slate-400">
                Farmers vote whether treatments worked, training the community vector store for nearby farms.
              </p>
            </div>
          </div>
        </section>
      </main>



      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>Root – Offline-First Multi-Agent Agricultural Advisory Platform</p>
        <p className="mt-1 text-[11px] text-slate-600">Built for Ethiopian smallholder farmers • Powered by Ollama & Supabase</p>
      </footer>
    </div>
  );
}
