'use client';

/* اوورلی جستجو (partials.js:71-109) — موبایل: شیت تمام‌صفحه z-70 (با پورتال به body
   تا از بافت انباشتِ z-40 هدر بیرون بماند)؛ دسکتاپ: دراپ‌داون زیر هدر */

import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { ChevronRight, Clock3, X } from 'lucide-react';
import { Input } from '../Input';
import { DEFAULT_RECENTS, POPULAR_CATS, POPULAR_PRODUCTS, TRENDING, miniPlaceholder } from './data';
import { DIGIKIT_STORAGE_KEYS } from '../../utils/storage';
import styles from './styles.module.css';

export interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  /** جستجوهای اخیر — اگر داده نشود از digikit-recents خوانده می‌شود. */
  recents?: string[];
  onSearch?(query: string): void;
}

function readRecents(fallback: string[]): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(DIGIKIT_STORAGE_KEYS.recents) || 'null');
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : fallback;
  } catch {
    return fallback;
  }
}

function saveRecents(items: string[]) {
  try {
    localStorage.setItem(DIGIKIT_STORAGE_KEYS.recents, JSON.stringify(items));
  } catch {
    /* storage may be unavailable in private browsing */
  }
}

export function SearchOverlay({ open, onClose, recents, onSearch }: SearchOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  /** نسخهٔ محلی جستجوهای اخیر — حذف آیتم‌ها فقط همین‌جا اعمال می‌شود */
  const [recentList, setRecentList] = useState<string[] | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* هر بار باز شدن: پاک‌سازی کوئری و حذف‌های محلی */
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setRecentList(recents ?? readRecents(DEFAULT_RECENTS));
  }, [open]);

  /* قفل اسکرول بدن + بستن با کلیک بیرون و Escape */
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const onDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (panelRef.current?.contains(target) || sheetRef.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const recentsList = recentList ?? recents ?? DEFAULT_RECENTS;
  const commitQuery = (value: string) => {
    const next = value.trim();
    if (!next) return;
    const nextRecents = [next, ...recentsList.filter((item) => item !== next)].slice(0, 8);
    setRecentList(nextRecents);
    saveRecents(nextRecents);
    onSearch?.(next);
  };

  /* ── موبایل: شیت تمام‌صفحه ── */
  const sheet = (
    <div ref={sheetRef} className={styles.sheet} role="dialog" aria-modal="true" aria-label="جستجو در دیجی‌کیت">
      <div className={styles.sheetHeader}>
        <button type="button" className={styles.backBtn} onClick={onClose} aria-label="بازگشت">
          <ChevronRight size={22} strokeWidth={1.7} aria-hidden="true" />
        </button>
        <Input
          variant="searchMuted"
          autoFocus
          className={styles.sheetInput}
          placeholder="جستجو در دیجی‌کیت"
          aria-label="جستجو در دیجی‌کیت"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commitQuery(query);
            }
          }}
        />
        {query !== '' && (
          <button type="button" className={styles.clearBtn} onClick={() => setQuery('')} aria-label="پاک کردن جستجو">
            <X size={20} strokeWidth={1.7} aria-hidden="true" />
          </button>
        )}
      </div>
      <div className={styles.sheetBody}>
        <div className={styles.sectionHead}>
          <Clock3 size={16} strokeWidth={1.7} className={styles.sectionIcon} aria-hidden="true" />
          <p className={styles.sectionTitle}>جستجوهای اخیر</p>
        </div>
        {recentsList.length === 0 ? (
          <p className={styles.empty}>جستجو اخیری ثبت نشده است</p>
        ) : (
          <div className={styles.recents}>
            {recentsList.map((q) => (
              <div key={q} className={styles.recentChip}>
                <button type="button" className={styles.recentText} onClick={() => commitQuery(q)}>
                  {q}
                </button>
                <button
                  type="button"
                  className={styles.recentX}
                  onClick={() => {
                    const next = recentsList.filter((x) => x !== q);
                    setRecentList(next);
                    saveRecents(next);
                  }}
                  aria-label={`حذف ${q}`}
                >
                  <X size={13} strokeWidth={2} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}
        <p className={`${styles.sectionTitle} ${styles.sectionGap}`}>دسته‌بندی‌های محبوب</p>
        <div className={styles.catsGrid}>
          {POPULAR_CATS.map((c) => (
            <button
              key={c.title}
              type="button"
              className={styles.catTile}
              style={{ backgroundColor: c.color }}
              onClick={() => commitQuery(c.title)}
            >
              <span className={styles.catIcon} aria-hidden="true">
                {c.icon}
              </span>
              <span className={styles.catTitle}>{c.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {mounted && createPortal(sheet, document.body)}
      {/* ── دسکتاپ: دراپ‌داون زیر هدر ── */}
      <div ref={panelRef} className={styles.panel} role="dialog" aria-label="جستجوهای پیشنهادی">
        <p className={styles.sectionTitle}>جستجوهای پرطرفدار</p>
        <div className={styles.trendingGrid}>
          {TRENDING.map((t, i) => (
            <button key={t} type="button" className={styles.trendItem} onClick={() => commitQuery(t)}>
              <span className={styles.trendNum}>{i + 1}</span>
              <span className={styles.trendLabel}>{t}</span>
            </button>
          ))}
        </div>
        <div className={styles.products}>
          {POPULAR_PRODUCTS.map((p) => (
            <button key={p.seed} type="button" className={styles.miniCard} onClick={() => commitQuery(p.title)}>
              <img className={styles.miniImg} src={miniPlaceholder(p.seed, p.label)} alt={p.title} loading="lazy" />
              <span className={styles.miniTitle}>{p.title}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
