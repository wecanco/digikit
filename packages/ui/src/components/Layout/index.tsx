'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { ChevronUp } from 'lucide-react';
import type { Category } from '../../types';
import { CampaignStrip } from '../CampaignStrip';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { BottomNav } from '../BottomNav';
import styles from './styles.module.css';

export interface LayoutProps {
  children: ReactNode;
  /** شناسه تب فعال هدر و نویگیشن پایین */
  active?: string;
  /** دسته‌بندی‌های مگامنو دسکتاپ */
  categories?: Category[];
  /** بیشینه پهنای ظرف main — پیش‌فرض 1352 مثل #main دموی وانیلا */
  maxWidth?: number;
  /** کلاس اضافه برای <main> */
  className?: string;
  style?: CSSProperties;
}

/** پوسته صفحه دیجی‌کیت — ساختار inject() در layout.js به‌صورت شل React:
 *  نوار کمپین + هدر + main + فوتر + نویگیشن پایین موبایل + دکمه شناور
 *  «بازگشت به بالا» (الگوی initScrollTop در ui.js:254-265). */
export function Layout({ children, active, categories, maxWidth = 1352, className, style }: LayoutProps) {
  const [showTop, setShowTop] = useState(false);

  /* نمایش بعد از 400px اسکرول — listener غیرفعال‌سازی‌شونده با سینک اولیه،
     دقیقاً مثل toggle در initScrollTop */
  useEffect(() => {
    const toggle = () => setShowTop(window.scrollY >= 400);
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
    return () => window.removeEventListener('scroll', toggle);
  }, []);

  return (
    <>
      <CampaignStrip />
      <Header active={active} categories={categories} />
      {/* mx-auto w-full px-0 lg:px-4 مثل #main در index.html دموی وانیلا */}
      <main
        className={[styles.main, className].filter(Boolean).join(' ')}
        style={{ ...style, maxWidth }}
      >
        {children}
      </main>
      <Footer />
      <BottomNav active={active} />
      <button
        type="button"
        className={[styles.top, !showTop && styles.topHidden].filter(Boolean).join(' ')}
        aria-label="بازگشت به بالا"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ChevronUp size={20} strokeWidth={2} />
      </button>
    </>
  );
}
