'use client';

import { useLanguage } from '@/lib/i18n/language-context';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-slate-900 pt-6 pb-28 md:pb-8 text-center text-xs text-slate-500">
      {t('footer_text')}
    </footer>
  );
}
