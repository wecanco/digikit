/* ورودی متن + پیل جستجوی دسکتاپ — پورت .input-base/.input-search/.input-search-muted
   از main.css (خطوط 131-142) و ردیف جستجوی هدر دسکتاپ از partials.js (خطوط 121-130) */
import { forwardRef, type ReactNode } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';
import styles from './styles.module.css';

export type InputVariant = 'base' | 'search' | 'searchMuted';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** base: فرم عمومی؛ search: جستجوی دسکتاپ (پدینگ افقی ۱۶px)؛ searchMuted: پیل خاکستری موبایل */
  variant?: InputVariant;
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  htmlSize?: number;
}

/** ورودی متن — forwardRef به <input>، اتریبیوت‌های بومی پاس داده می‌شوند */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { variant = 'base', size = 'md', invalid, startAdornment, endAdornment, htmlSize, className, ...rest },
  ref,
) {
  const cls = [styles.input, styles[variant], styles[size], invalid && styles.invalid, className].filter(Boolean).join(' ');
  const input = <input ref={ref} className={cls} size={htmlSize} aria-invalid={invalid || undefined} {...rest} />;
  if (!startAdornment && !endAdornment) return input;
  return (
    <span className={[styles.field, startAdornment && styles.hasStartAdornment, endAdornment && styles.hasEndAdornment].filter(Boolean).join(' ')}>
      {startAdornment && <span className={[styles.adornment, styles.startAdornment].join(' ')}>{startAdornment}</span>}
      {input}
      {endAdornment && <span className={[styles.adornment, styles.endAdornment].join(' ')}>{endAdornment}</span>}
    </span>
  );
});

export interface SearchPillProps extends InputHTMLAttributes<HTMLInputElement> {
  /** اورلی دو‌رنگ «جستجو در دیجی‌کیت» روی ورودیِ خالی (پیش‌فرض؛ با پاس‌دادن placeholder خاموش می‌شود) */
  overlay?: boolean;
}

/** پیل جستجوی هدر دسکتاپ — ۴۴px، گرد کامل، زمینه خاکستری، ذره‌بین قرمز + اورلی «جستجو در دیجی‌کیت» */
export function SearchPill({ overlay, placeholder, className, ...rest }: SearchPillProps) {
  const fancy = overlay ?? placeholder == null;
  return (
    <div className={[styles.pill, className].filter(Boolean).join(' ')}>
      <Search size={20} className={styles.pillIcon} aria-hidden />
      <div className={styles.pillField}>
        <input
          type="text"
          aria-label="جستجو"
          className={styles.pillInput}
          placeholder={fancy ? ' ' : placeholder}
          {...rest}
        />
        {fancy && (
          <div className={styles.pillOverlay} aria-hidden>
            <span className={styles.overlayPre}>جستجو در</span>
            <span className={styles.overlayBrand}>دیجی‌کیت</span>
          </div>
        )}
      </div>
    </div>
  );
}
