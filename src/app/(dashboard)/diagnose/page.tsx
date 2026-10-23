import { getCurrentFarmerProfile } from '@/app/auth/actions';
import { Navbar } from '@/components/shared/navbar';
import { QuestionForm } from '@/app/(dashboard)/diagnose/question-form';
import { Bot } from 'lucide-react';

export default async function DiagnosePage() {
  const profile = await getCurrentFarmerProfile();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      <Navbar userEmail={profile?.email} farmerName={profile?.full_name} />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-6 sm:py-8 w-full space-y-6">
        {/* Title Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Bot className="w-3.5 h-3.5" />
            <span>Multi-Agent Advisory System • ደረጃ 1</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Diagnose Crop Problem <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              የሰብል ችግር ምርመራ
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400">
            Submit your crop symptoms or upload a field photo. Root’s Diagnostic Agent will analyze the pathogen and generate a structured Advice Card.
          </p>
        </div>

        {/* Form */}
        <QuestionForm initialProfile={profile} />

        {/* Guarantees */}
        <div className="max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-4 text-center text-[11px] text-slate-400">
          <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <span className="font-semibold text-emerald-400 block">⚡ Instant Response</span>
            <span>Local Ollama & Offline Engine</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <span className="font-semibold text-amber-400 block">🌿 0 ETB Cost</span>
            <span>Pesticide-free organic remedies</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80 col-span-2 sm:col-span-1">
            <span className="font-semibold text-teal-400 block">📡 100% Offline</span>
            <span>Saved to local device cache</span>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        Root Ethiopia • Agricultural Advisory Intelligence
      </footer>
    </div>
  );
}
