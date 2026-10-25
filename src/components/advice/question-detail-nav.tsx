'use client';

import Link from 'next/link';
import { ArrowLeft, MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/language-context';

export function QuestionDetailNav() {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-between">
      <Link
        href="/diagnose"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-300 transition-colors p-1 rounded-lg hover:bg-slate-900/60"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{t('card_back_to_diagnose')}</span>
      </Link>

      <Link href="/diagnose">
        <Button size="sm" variant="outline" className="border-slate-800 hover:border-emerald-500/50 hover:ring-1 hover:ring-emerald-400/30 hover:shadow-[0_0_15px_-3px_rgba(16,185,129,0.25)] bg-slate-900 text-xs h-8">
          <MessageSquarePlus className="w-3.5 h-3.5 mr-1 text-emerald-400" />
          <span>{t('action_ask_question')}</span>
        </Button>
      </Link>
    </div>
  );
}
