'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './styles.module.css';

export interface ScrollCarouselProps {
  children: ReactNode;
  /** نمایش فلش‌های هاور (فقط ≥۱۰۲۴px) */
  arrows?: boolean;
}

/* کاروسل اسکرول افقی بومی — ترک بدون اسکرول‌بار + فلش‌های دایره‌ای ۴۴px در هاور
   (ui.js:174-198). در RTL جهت inline-end فیزیکی «چپ» است: دکمه بعدی سمت چپ
   می‌نشیند و اسکرول به چپ یعنی scrollLeft منفی. */
export function ScrollCarousel({ children, arrows = true }: ScrollCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  /* به‌روزرسانی حالت غیرفعال فلش‌ها — |scrollLeft| در RTL و LTR هر دو پوشش می‌دهد:
     RTL: 0 (ابتدای راست) → منفی؛ LTR: 0 → مثبت */
  const sync = () => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 1) {
      setAtStart(true);
      setAtEnd(true);
      return;
    }
    const pos = Math.abs(el.scrollLeft);
    setAtStart(pos < 1);
    setAtEnd(pos > max - 1);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(sync);
      ro.observe(el);
    }
    return () => ro?.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* امضای دیرشکن: علامت مثبت = حرکت به inline-end (بعدی) */
  const shift = (sign: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === 'rtl';
    const delta = el.clientWidth * 0.8;
    el.scrollBy({ left: delta * sign * (rtl ? -1 : 1), behavior: 'smooth' });
  };

  return (
    <div className={styles.carousel}>
      <div ref={trackRef} className={styles.track} onScroll={sync}>
        {children}
      </div>
      {arrows && (
        <>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowPrev}`}
            aria-label="قبلی"
            onClick={() => shift(-1)}
            disabled={atStart}
          >
            <ChevronRight size={20} strokeWidth={2.2} />
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowNext}`}
            aria-label="بعدی"
            onClick={() => shift(1)}
            disabled={atEnd}
          >
            <ChevronLeft size={20} strokeWidth={2.2} />
          </button>
        </>
      )}
    </div>
  );
}
