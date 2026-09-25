import type { CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';
import { CreditCard, Gift, Heart, ShoppingCart, Tag } from 'lucide-react';
import type { ServiceItem } from '../../types';
import { TILES, type TileEntry } from './data';
import styles from './styles.module.css';

export type { TileEntry } from './data';

export interface ServiceTilesProps {
  /** جای‌گزینی کاشی‌های پیش‌فرض */
  items?: ServiceItem[];
  className?: string;
  style?: CSSProperties;
}

/* کلیدهای آیکون وانیلا → کامپوننت lucide (stroke-width کیت 1.7) */
const ICONS: Record<string, LucideIcon> = {
  cart: ShoppingCart,
  heart: Heart,
  gift: Gift,
  credit: CreditCard,
  tag: Tag,
};

/** ردیف کاشی‌های خدمات موبایل (فقط <1024px) — کاشی‌های ۶۴×۵۶px گرد سفید
 *  با آیکون رنگی و برچسب قرمز؛ کاشی اول توپر قرمز با گلیف «٪» است
 *  (partials.js:410-421 serviceTilesHTML) */
export function ServiceTiles({ items, className, style }: ServiceTilesProps) {
  const tiles = (items ?? TILES) as TileEntry[];

  return (
    <div className={[styles.row, className].filter(Boolean).join(' ')} style={style}>
      {tiles.map((t, i) => {
        const Icon = ICONS[t.icon];
        return (
          <a
            key={`${t.title}-${i}`}
            href={t.href || '/products'}
            className={[styles.tile, t.red && styles.tileRed].filter(Boolean).join(' ')}
          >
            {t.red ? (
              /* گلیف درصد فارسی کاشی شگفت‌انگیز — h-7 w-7 text-[20px] font-black */
              <span className={styles.percent} aria-hidden>
                ٪
              </span>
            ) : Icon ? (
              <Icon size={24} strokeWidth={1.7} color={t.color} />
            ) : (
              /* آیکون ناشناخته — رشته خام (پشتیبانی ایموجی برای items سفارشی) */
              <span style={{ fontSize: 24, lineHeight: 1, color: t.color }}>{t.icon}</span>
            )}
            <span className={[styles.label, t.red && styles.labelRed].filter(Boolean).join(' ')}>
              {t.title}
            </span>
          </a>
        );
      })}
    </div>
  );
}
