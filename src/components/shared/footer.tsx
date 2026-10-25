'use client';

import { useLanguage } from '@/lib/i18n/language-context';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
      {t('footer_text')}
    </footer>
  );
}
