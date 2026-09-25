'use client';

/* ─── سبد خرید — قرارداد ذخیره‌سازی یکسان با دموی Vite ───
   digikit-cart: number[] (آی‌دی‌ها به‌ترتیب اضافه)
   digikit-cart-qty: { [id]: qty } با محدودیت 1–5
   رویداد 'cart:changed' پس از هر تغییر (برای بج زنده) */

import { useCallback, useEffect, useState } from 'react';
import { DIGIKIT_STORAGE_EVENTS, DIGIKIT_STORAGE_KEYS } from '../utils/storage';

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode و غیره — بی‌صدا رد می‌شویم */
  }
};

const clamp = (n: number, min: number, max: number) => {
  const v = Math.trunc(n);
  if (!Number.isFinite(n)) return min;
  return Math.min(Math.max(v, min), max);
};

export function useCart() {
  const [ids, setIds] = useState<number[]>([]);
  const [qtys, setQtys] = useState<Record<string, number>>({});

  useEffect(() => {
    const syncFromStorage = () => {
      setIds(read<number[]>(DIGIKIT_STORAGE_KEYS.cart, []).filter((id) => Number.isFinite(id)));
      setQtys(read<Record<string, number>>(DIGIKIT_STORAGE_KEYS.cartQty, {}));
    };
    syncFromStorage();
    window.addEventListener(DIGIKIT_STORAGE_EVENTS.cart, syncFromStorage);
    window.addEventListener('storage', syncFromStorage);
    return () => {
      window.removeEventListener(DIGIKIT_STORAGE_EVENTS.cart, syncFromStorage);
      window.removeEventListener('storage', syncFromStorage);
    };
  }, []);

  const sync = useCallback((nextIds: number[], nextQtys: Record<string, number>) => {
    setIds(nextIds);
    setQtys(nextQtys);
    write(DIGIKIT_STORAGE_KEYS.cart, nextIds);
    write(DIGIKIT_STORAGE_KEYS.cartQty, nextQtys);
    window.dispatchEvent(new CustomEvent(DIGIKIT_STORAGE_EVENTS.cart));
  }, []);

  const readCart = useCallback(() => ({
    ids: read<number[]>(DIGIKIT_STORAGE_KEYS.cart, []).filter((id) => Number.isFinite(id)),
    qtys: read<Record<string, number>>(DIGIKIT_STORAGE_KEYS.cartQty, {}),
  }), []);

  const add = useCallback((id: number) => {
    const current = readCart();
    const nextIds = current.ids.includes(id) ? current.ids : [...current.ids, id];
    const nextQtys = { ...current.qtys, [id]: clamp((current.qtys[id] ?? 0) + 1, 1, 5) };
    sync(nextIds, nextQtys);
  }, [readCart, sync]);

  const remove = useCallback((id: number) => {
    const current = readCart();
    const nextIds = current.ids.filter((x) => x !== id);
    const nextQtys = { ...current.qtys };
    delete nextQtys[id];
    sync(nextIds, nextQtys);
  }, [readCart, sync]);

  const setQty = useCallback((id: number, qty: number) => {
    if (qty <= 0) {
      remove(id);
      return;
    }
    const current = readCart();
    const nextIds = current.ids.includes(id) ? current.ids : [...current.ids, id];
    sync(nextIds, { ...current.qtys, [id]: clamp(qty, 1, 5) });
  }, [readCart, sync, remove]);

  const clear = useCallback(() => {
    sync([], {});
  }, [sync]);

  const qtyOf = useCallback((id: number) => qtys[String(id)] ?? 0, [qtys]);

  return { ids, count: ids.length, add, remove, setQty, clear, qtyOf };
}

/** فقط تعداد آیتم‌های سبد — برای بج هدر/bottom-nav بدون رندر مجدد کل صفحه */
export function useCartCount(): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const recompute = () => setCount(read<number[]>(DIGIKIT_STORAGE_KEYS.cart, []).filter((id) => Number.isFinite(id)).length);
    recompute();
    window.addEventListener(DIGIKIT_STORAGE_EVENTS.cart, recompute);
    window.addEventListener('storage', recompute);
    return () => {
      window.removeEventListener(DIGIKIT_STORAGE_EVENTS.cart, recompute);
      window.removeEventListener('storage', recompute);
    };
  }, []);
  return count;
}
