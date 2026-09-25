'use client';

import { useRef, type KeyboardEvent } from 'react';
import styles from './styles.module.css';

export interface TabItem {
  id: string;
  title: string;
}

export interface TabsProps {
  items: TabItem[];
  active: string;
  onChange(id: string): void;
}

/* تب‌های متنی با خط زیرین — ردیف gap-4 با خط پایه neutral-300؛
   تب فعال: متن ink بولد + میله ۲px قرمز (الگوی تب‌های پروفایل) */
export function Tabs({ items, active, onChange }: TabsProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowLeft' ? 1 : event.key === 'ArrowRight' ? -1 : 0;
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + direction + items.length) % items.length;
    refs.current[next]?.focus();
    onChange(items[next].id);
  };

  return (
    <div className={styles.tabs} role="tablist" aria-label="بخش‌های صفحه">
      {items.map((t) => {
        const isActive = t.id === active;
        const index = items.indexOf(t);
        return (
          <button
            key={t.id}
            ref={(element) => { refs.current[index] = element; }}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            className={isActive ? styles.tabActive : styles.tab}
            onClick={() => onChange(t.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {t.title}
          </button>
        );
      })}
    </div>
  );
}
