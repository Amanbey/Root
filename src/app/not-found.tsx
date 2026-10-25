'use client';

import Link from 'next/link';
import { Sprout, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/language-context';

export default function NotFound() {
  const { t, language } = useLanguage();

  const title = language === 'am'
    ? 'ገጹ አልተገኘም'
    : language === 'om'
    ? 'Fuulli Hin Argamne'
    : 'Field Not Found';

  const description = language === 'am'
    ? 'የፈለጉት የሰብል ምርመራ ወይም ገጽ አልተገኘም ወይም ተንቀሳቅሷል።'
    : language === 'om'
    ? 'Qorannoon midhaanii yookiin fuulli barbaaddan hin jiru yookiin jijjiirameera.'
    : 'The crop diagnosis or page you are looking for does not exist or has been moved.';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 selection:bg-emerald-500 selection:text-slate-950">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-950/60">
          <Sprout className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400">
            404
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed px-4">
            {description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/diagnose" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto min-h-[44px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>{t('action_ask_question')}</span>
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto min-h-[44px] border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              <span>{t('auth_return_home')}</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
