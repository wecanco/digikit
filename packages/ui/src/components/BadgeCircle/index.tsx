import styles from './styles.module.css';

export interface BadgeCircleProps {
  /** درصد تخفیف 0–100 — ارقام لاتین با ٪ مثل مرجع (badgeCircle در ui.js:24-31) */
  discount: number;
  /** اندازه: md = واکنش‌گرا ۳۲→۳۶px / sm = ثابت ۳۲px */
  size?: 'md' | 'sm';
  className?: string;
}

/** نشان دایره‌ای تخفیف — دایره قرمز --dk-primary-500 با درصد سفید بولد. جای‌گذاری روی تصویر (absolute top/end) با کامپوننت مصرف‌کننده است. */
export function BadgeCircle({ discount, size = 'md', className }: BadgeCircleProps) {
  return (
    <span className={[styles.badge, size === 'sm' && styles.sm, className].filter(Boolean).join(' ')}>
      {discount}٪
    </span>
  );
}
