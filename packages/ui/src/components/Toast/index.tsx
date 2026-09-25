'use client';

/* توست — پورت toast() از ui.js (خطوط 199-207) به‌صورت ToastProvider + useToast:
   زمینه + کانتینر fixed بدون پورتال، پشته توست‌ها، حذف خودکار پس از ۳ ثانیه،
   انیمیشن slide-up؛ زمینه سفید با آیکون رنگی بر اساس نوع (موفق/خطا/اطلاع) */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';
import styles from './styles.module.css';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastApi {
  /** نمایش توست — نوع پیش‌فرض 'success' */
  show: (msg: string, type?: ToastType) => void;
}

interface ToastItem {
  id: number;
  msg: string;
  type: ToastType;
}

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const seq = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (msg: string, type: ToastType = 'success') => {
      const id = ++seq.current;
      setToasts((list) => [...list, { id, msg, type }]);
      timers.current.set(id, setTimeout(() => dismiss(id), 3000));
    },
    [dismiss],
  );

  /* پاک‌سازی همه تایمرها هنگام unmount پرووایدر */
  useEffect(
    () => () => {
      timers.current.forEach((timer) => clearTimeout(timer));
      timers.current.clear();
    },
    [],
  );

  const api = useMemo<ToastApi>(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className={styles.stack} aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={styles.toast}>
            {t.type === 'success' && <CheckCircle2 size={18} className={styles.iconSuccess} aria-hidden />}
            {t.type === 'error' && <X size={18} className={styles.iconError} aria-hidden />}
            {t.type === 'info' && <Info size={18} className={styles.iconInfo} aria-hidden />}
            <span className={styles.msg}>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** دسترسی به show() — باید داخل <ToastProvider> استفاده شود */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast باید داخل <ToastProvider> استفاده شود');
  return ctx;
}
