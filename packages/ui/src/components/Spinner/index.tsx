/* اسپینر — قوس قرمز چرخان (مرجع m05): حلقه ۲px شفاف که فقط ضخامت پایینی قرمز است */
import styles from './styles.module.css';

export interface SpinnerProps {
  /** قطر برحسب پیکسل — پیش‌فرض ۲۴ */
  size?: number;
  className?: string;
}

export function Spinner({ size = 24, className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="در حال بارگذاری"
      className={[styles.spinner, className].filter(Boolean).join(' ')}
      style={{ width: size, height: size }}
    />
  );
}
