'use client';

/* شمارش‌معکوس — پورت countdown از ui.js (خطوط 149-171): تیک هر ثانیه، ارقام لاتین (مثل مرجع)،
   سطر ltr تا ترتیب HH:MM:SS در صفحه rtl حفظ شود؛ در صفر متوقف می‌شود و onEnd یک‌بار صدا می‌خورد */
import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';

export type CountdownTheme = 'onRed' | 'heroWhite' | 'white';

export interface CountdownProps {
  /** ساعت باقی‌مانده تا پایان — پیش‌فرض ۵ (اعشار مجاز، مثل 5.7 دمو) */
  hoursAhead?: number;
  /** onRed: جعبه‌های شیشه‌ای روی باند قرمز؛ heroWhite: ارقام لخت سفید روی باند شگفت‌انگیز؛ white: متن سفید روی زمینه شفاف */
  theme?: CountdownTheme;
  /** وقتی شمارش به صفر رسید یک‌بار صدا زده می‌شود */
  onEnd?: () => void;
  className?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

export function Countdown({ hoursAhead = 5, theme = 'onRed', onEnd, className }: CountdownProps) {
  const endedRef = useRef(false);
  const [remaining, setRemaining] = useState<number>(() => Math.max(0, hoursAhead * 3_600_000));

  useEffect(() => {
    endedRef.current = false;
    const end = Date.now() + hoursAhead * 3_600_000;
    const tick = () => setRemaining(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [hoursAhead]);

  const d = remaining;
  const ended = d <= 0;

  useEffect(() => {
    if (ended && !endedRef.current) {
      endedRef.current = true;
      onEnd?.();
    }
  }, [ended, onEnd]);

  const h = Math.floor(d / 3_600_000);
  const m = Math.floor((d % 3_600_000) / 60_000);
  const s = Math.floor((d % 60_000) / 1000);

  const bare = theme !== 'onRed';
  const cell = (v: number) =>
    bare ? <span className={styles.bare}>{pad(v)}</span> : <span className={styles.box}>{pad(v)}</span>;

  return (
    <div className={[styles.row, className].filter(Boolean).join(' ')} dir="ltr">
      {cell(h)}
      <span className={styles.sep}>:</span>
      {cell(m)}
      <span className={styles.sep}>:</span>
      {cell(s)}
    </div>
  );
}
