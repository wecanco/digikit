import { Star } from 'lucide-react';
import { faNum, toFaDecimal } from '../../utils/format';
import styles from './styles.module.css';

export interface RatingProps {
  /** امتیاز ۰ تا ۵ (ستاره‌های پرشده با Math.round — مثل کیت فعلی) */
  rating: number;
  /** تعداد رأی — داخل پرانتز با ارقام فارسی */
  count?: number;
  /** نمایش تعداد رأی (پیش‌فرض true) */
  showCount?: boolean;
  /** حالت PLP/لیست جستجو: یک ستاره + نمره + تعداد */
  single?: boolean;
  className?: string;
}

/** امتیاز — پورت ratingHTML (ui.js:32-53). حالت پیش‌فرض: ردیف ۵ ستاره ۱۴px + تعداد؛ single: یک ستاره + نمره «۴٫۷» + «(۱٬۲۳۴)» */
export function Rating({ rating, count, showCount = true, single = false, className }: RatingProps) {
  const safeRating = Math.min(5, Math.max(0, Number.isFinite(rating) ? rating : 0));
  const wrap = [styles.wrap, single && styles.single, className].filter(Boolean).join(' ');
  const label = `امتیاز ${toFaDecimal(safeRating)} از ۵${count != null ? ` از ${faNum(count)} رأی` : ''}`;

  if (single) {
    return (
      <div className={wrap} role="img" aria-label={label} title={label}>
        <Star className={styles.star} size={14} strokeWidth={0} fill="currentColor" aria-hidden />
        <span className={styles.score}>{toFaDecimal(safeRating)}</span>
        {showCount && count != null && <span className={styles.count}>({faNum(count)})</span>}
      </div>
    );
  }

  const full = Math.round(safeRating);
  return (
    <div className={wrap} role="img" aria-label={label} title={label}>
      <span className={styles.stars}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={i <= full ? styles.star : styles.starOff}
            size={14}
            strokeWidth={0}
            fill="currentColor"
            aria-hidden
          />
        ))}
      </span>
      {showCount && count != null && <span className={styles.count}>({faNum(count)})</span>}
    </div>
  );
}
