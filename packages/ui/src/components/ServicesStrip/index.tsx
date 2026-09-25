import type { CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Backpack,
  BookOpen,
  Coins,
  CreditCard,
  Gift,
  Heart,
  ShoppingCart,
  Sparkles,
  Tag,
  Zap,
} from 'lucide-react';
import type { ServiceItem } from '../../types';
import { DESKTOP_SERVICES, MOBILE_SERVICES, type ServiceEntry } from './data';
import styles from './styles.module.css';

export type { ServiceEntry } from './data';

export interface ServicesStripProps {
  /** جای‌گزینی آیتم‌های پیش‌فرض — هر دو ردیف موبایل/دسکتاپ از همین لیست ساخته می‌شوند */
  items?: ServiceItem[];
  /** بیشینه پهنای ظرف — پیش‌فرض 1650 مثل نوار هدر (بعضی صفحات 1200) */
  maxWidth?: number;
  className?: string;
  style?: CSSProperties;
}

/* کلیدهای آیکون وانیلا → کامپوننت lucide (مسیرها ۱:۱ همان‌ها هستند،
   stroke-width کیت وانیلا 1.7 است) */
const ICONS: Record<string, LucideIcon> = {
  bolt: Zap,
  book: BookOpen,
  credit: CreditCard,
  cart: ShoppingCart,
  sparkles: Sparkles,
  coins: Coins,
  heart: Heart,
  gift: Gift,
  backpack: Backpack,
  tag: Tag,
};

/* گلیف داخل دیسک: واژه‌نگار («دیجی‌کیت») یا آیکون lucide یا رشته خام (ایموجی) */
function DiscGlyph({ entry, size }: { entry: ServiceEntry; size: 22 | 26 }) {
  if (entry.wordmark) return <span className={styles.wordmark}>{entry.wordmark}</span>;
  const Icon = ICONS[entry.icon];
  if (Icon) return <Icon size={size} strokeWidth={1.7} />;
  return <span style={{ fontSize: size, lineHeight: 1 }}>{entry.icon}</span>;
}

/** نوار خدمات زیر هیرو — موبایل: دیسک‌های توپر ۴۰px اسکرول‌شونده؛ دسکتاپ:
 *  ردیف دایره‌های 52px با justify-between و کاشی «⋯» در انتهای ردیف
 *  (partials.js:372-397 servicesStripHTML) */
export function ServicesStrip({ items, maxWidth = 1650, className, style }: ServicesStripProps) {
  const mobile = (items ?? MOBILE_SERVICES) as ServiceEntry[];
  const desktop = (items ?? DESKTOP_SERVICES) as ServiceEntry[];

  const desktopDisc = (s: ServiceEntry): CSSProperties =>
    s.light
      ? { background: '#efeff1', color: 'var(--dk-ink)' }
      : { background: s.solid ?? 'var(--dk-ink)' };

  return (
    <div
      className={[styles.strip, className].filter(Boolean).join(' ')}
      style={{ ...style, maxWidth }}
    >
      {/* موبایل: ردیف اسکرول افقی بدون اسکرول‌بار (px-5 pt-3 gap-2) */}
      <div className={styles.mobileRow}>
        {mobile.map((s, i) => (
          <a key={`${s.title}-${i}`} href={s.href || '/products'} className={styles.mobileItem}>
            <span
              className={styles.disc}
              style={{ background: s.solid ?? s.color ?? 'var(--dk-ink)' }}
            >
              <DiscGlyph entry={s} size={22} />
            </span>
            <span
              className={styles.mobileLabel}
              style={s.labelColor || s.color ? { color: s.labelColor ?? s.color } : undefined}
            >
              {s.title}
            </span>
          </a>
        ))}
      </div>

      {/* دسکتاپ: justify-between + کاشی «⋯» خدمات بیشتر در انتهای ردیف */}
      <div className={styles.desktopRow}>
        {desktop.map((s, i) => (
          <a key={`${s.title}-${i}`} href={s.href || '/products'} className={styles.desktopItem}>
            {s.badge && <span className={styles.badge}>{s.badge}</span>}
            <span className={`${styles.disc} ${styles.discDesktop}`} style={desktopDisc(s)}>
              <DiscGlyph entry={s} size={26} />
            </span>
            <span className={styles.desktopLabel}>{s.title}</span>
          </a>
        ))}
        <a href="/search" className={styles.desktopItem} aria-label="مشاهده همه خدمات">
          <span className={`${styles.disc} ${styles.discDesktop} ${styles.discMore}`}>⋯</span>
        </a>
      </div>
    </div>
  );
}
