'use client';

import Link from 'next/link';
import { WifiOff, RefreshCw, BookmarkCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function OfflinePage() {
  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-slate-950 to-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6">
      <header className="pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <span className="font-bold text-lg">🌱</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-emerald-400">Root Advisory</h1>
            <p className="text-xs text-slate-400">የግብርና ምክር አገልግሎት</p>
          </div>
        </div>
      </header>

      <main className="my-auto max-w-md mx-auto w-full space-y-6 text-center">
        <div className="inline-flex p-4 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 animate-pulse">
          <WifiOff className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Working Offline
          </h2>
          <p className="text-amber-400 font-medium text-sm">
            መስመር ላይ አይደለም • Offline Mode Active
          </p>
          <p className="text-sm text-slate-300">
            Internet connection is weak or disconnected. Your local advisory cache remains active and secure on your device.
          </p>
        </div>

        <Card className="bg-slate-900/60 border-slate-800 text-left text-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-emerald-400" />
              Available While Offline
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              You can still take full advantage of these features:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <p>Review previously downloaded crop disease Advice Cards</p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <p>Draft new crop questions; they will auto-sync when network returns</p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <p>View local pest prevention techniques & seed guidance</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={handleRetry}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Check Connection
          </Button>

          <Link href="/" className="w-full">
            <Button
              variant="outline"
              className="w-full border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Home
            </Button>
          </Link>
        </div>
      </main>

      <footer className="text-center text-xs text-slate-500 pb-2">
        Root Ethiopia • Offline-First Agricultural Platform
      </footer>
    </div>
  );
}
