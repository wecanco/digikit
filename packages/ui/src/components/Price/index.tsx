import type { CSSProperties } from 'react';
import { fmt } from '../../utils/format';
import styles from './styles.module.css';

export interface PriceProps {
  /** قیمت نهایی (تومان) */
  price: number;
  /** قیمت قبل از تخفیف — اگر بالاتر از price باشد خط‌خورده نمایش داده می‌شود */
  oldPrice?: number | null;
  /** اندازه: md (پیش‌فرض کارت‌های دسکتاپ) یا sm (ردیف‌های لیست/موبایل) */
  size?: 'md' | 'sm' | 'lg';
  /** واحد «تومان» */
  unit?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** قیمت دیجی‌کیت — عدد پررنگ + واحد، قیمت قبلی خط‌خورده در بالا. */
export function Price({ price, oldPrice, size = 'md', unit = true, className, style }: PriceProps) {
  return (
    <div className={[styles.wrap, className].filter(Boolean).join(' ')} style={style} dir="ltr">
      {oldPrice != null && oldPrice > price && (
        <del className={[styles.old, size === 'sm' && styles.oldSm, size === 'lg' && styles.oldLg].filter(Boolean).join(' ')}>
          {fmt(oldPrice)}
        </del>
      )}
      <div className={[styles.now, size === 'sm' && styles.nowSm, size === 'lg' && styles.nowLg].filter(Boolean).join(' ')}>
        <span className={styles.value}>{fmt(price)}</span>
        {unit && <span className={[styles.unit, size === 'sm' && styles.unitSm, size === 'lg' && styles.unitLg].filter(Boolean).join(' ')}>تومان</span>}
      </div>
    </div>
  );
}
