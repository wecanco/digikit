'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import type { Category } from '../../types';
import { DEFAULT_CATEGORIES } from './data';
import styles from './styles.module.css';

export interface MegaMenuProps {
  open: boolean;
  onClose: () => void;
  /** دسته‌های مگامنو — اگر خالی باشد از DEFAULT_CATEGORIES استفاده می‌شود */
  categories: Category[];
}

/** مگامنوی دسکتاپ — پنل ۸۵۰px زیر ردیف دسته‌های هدر؛ سوییچ دسته با hover، بستن با کلیک بیرون و Escape */
export function MegaMenu({ open, onClose, categories }: MegaMenuProps) {
  const cats = categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  const [active, setActive] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  /* باز شدن پنل → دستهٔ فعال به اولین گره برمی‌گردد */
  useEffect(() => {
    if (open) setActive(0);
  }, [open]);

  /* بستن با کلیک بیرون پنل + Escape */
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const current = cats[Math.min(active, cats.length - 1)];

  return (
    <div ref={panelRef} className={styles.panel} role="region" aria-label="دسته‌بندی کالاها">
      <nav className={styles.cats} aria-label="دسته‌های اصلی">
        <ul className={styles.catsList}>
          {cats.map((c, i) => (
            <li key={c.id}>
              <a
                href={`/search?cat=${c.id}`}
                className={[styles.cat, i === active ? styles.catActive : ''].filter(Boolean).join(' ')}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className={styles.tile} style={{ backgroundColor: `${c.color}1f` }}>
                  <span className={styles.tileIcon} aria-hidden="true">
                    {c.icon}
                  </span>
                </span>
                <span className={styles.catTitle}>{c.title}</span>
                <ChevronLeft className={styles.chev} size={16} strokeWidth={1.7} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.subs}>
        <a className={styles.all} href={`/search?cat=${current.id}`}>
          همه کالاهای {current.title}
        </a>
        <ul className={styles.subsGrid}>
          {current.subs.map((s) => (
            <li key={s}>
              <a className={styles.sub} href={`/search?cat=${current.id}&q=${encodeURIComponent(s)}`}>
                {s}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
