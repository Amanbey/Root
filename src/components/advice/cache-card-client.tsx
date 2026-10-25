'use client';

import { useEffect } from 'react';
import { AdviceCard } from '@/lib/types';
import { cacheAdviceCardLocally } from '@/lib/offline/db';

export function CacheCardClient({ card }: { card: AdviceCard | null }) {
  useEffect(() => {
    if (card && typeof window !== 'undefined') {
      cacheAdviceCardLocally(card);
    }
  }, [card]);

  return null;
}
