'use client';

/* ─── کاربر جاری — قرارداد یکسان با دمو: digikit-user: { name, id } ─── */

import { useCallback, useEffect, useState } from 'react';
import { DIGIKIT_STORAGE_EVENTS, DIGIKIT_STORAGE_KEYS } from '../utils/storage';

export interface DigiKitUser {
  name: string;
  id: string;
}

export function useUser() {
  const [user, setUser] = useState<DigiKitUser | null>(null);

  useEffect(() => {
    const syncFromStorage = () => {
      try {
        setUser(JSON.parse(localStorage.getItem(DIGIKIT_STORAGE_KEYS.user) || 'null'));
      } catch {
        setUser(null);
      }
    };
    syncFromStorage();
    window.addEventListener(DIGIKIT_STORAGE_EVENTS.user, syncFromStorage);
    window.addEventListener('storage', syncFromStorage);
    return () => {
      window.removeEventListener(DIGIKIT_STORAGE_EVENTS.user, syncFromStorage);
      window.removeEventListener('storage', syncFromStorage);
    };
  }, []);

  const login = useCallback((name: string, id: string) => {
    const next = { name, id };
    try {
      localStorage.setItem(DIGIKIT_STORAGE_KEYS.user, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setUser(next);
    window.dispatchEvent(new CustomEvent(DIGIKIT_STORAGE_EVENTS.user));
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(DIGIKIT_STORAGE_KEYS.user);
    } catch {
      /* ignore */
    }
    setUser(null);
    window.dispatchEvent(new CustomEvent(DIGIKIT_STORAGE_EVENTS.user));
  }, []);

  return { user, login, logout };
}
