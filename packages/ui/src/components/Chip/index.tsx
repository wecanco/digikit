import type { MouseEventHandler, ReactNode } from 'react';
import styles from './styles.module.css';

export interface ChipProps {
  /** حالت انتخاب‌شده: قلاب --dk-primary-500 + پس‌زمینه --dk-primary-50 + متن --dk-primary-600 */
  active?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  className?: string;
  tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
}

/** چیپ فیلتر — پورت .chip/.chip-active (main.css:97-102). پیل با قلاب neutral-400 و متن ink-soft */
export function Chip({ active = false, onClick, children, className, tone = 'neutral' }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[styles.chip, styles[tone], active && styles.active, className].filter(Boolean).join(' ')}
    >
      {children}
    </button>
  );
}
