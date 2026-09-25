'use client';

/* ─── علاقه‌مندی‌ها — قرارداد یکسان با دمو: digikit-favs: number[] + رویداد 'favs:changed' ─── */

import { useCallback, useEffect, useState } from 'react';
import { DIGIKIT_STORAGE_EVENTS, DIGIKIT_STORAGE_KEYS } from '../utils/storage';

const read = (): number[] => {
  try {
    const value = JSON.parse(localStorage.getItem(DIGIKIT_STORAGE_KEYS.favorites) || '[]');
    return Array.isArray(value) ? value.filter((id): id is number => Number.isFinite(id)) : [];
  } catch {
    return [];
  }
};

export function useFavs() {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    const recompute = () => setIds(read());
    recompute();
    window.addEventListener(DIGIKIT_STORAGE_EVENTS.favorites, recompute);
    window.addEventListener('storage', recompute);
    return () => {
      window.removeEventListener(DIGIKIT_STORAGE_EVENTS.favorites, recompute);
      window.removeEventListener('storage', recompute);
    };
  }, []);

  const toggle = useCallback((id: number) => {
    const current = read();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    try {
      localStorage.setItem(DIGIKIT_STORAGE_KEYS.favorites, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setIds(next);
    window.dispatchEvent(new CustomEvent(DIGIKIT_STORAGE_EVENTS.favorites));
  }, []);

  const has = useCallback((id: number) => ids.includes(id), [ids]);

  return { ids, toggle, has };
}
