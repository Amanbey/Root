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
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{t('card_back_to_diagnose')}</span>
      </Link>

      <Link href="/diagnose">
        <Button size="sm" variant="outline" className="border-slate-800 bg-slate-900 text-xs h-8">
          <MessageSquarePlus className="w-3.5 h-3.5 mr-1 text-emerald-400" />
          <span>{t('action_ask_question')}</span>
        </Button>
      </Link>
    </div>
  );
}
