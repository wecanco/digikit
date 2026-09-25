import type { ServiceItem } from '../../types';

/* ─── کاشی‌های خدمات موبایل — منتقل ۱:۱ از partials.js:401-408 (M_TILES) ───
   فقط صفحه خانه، بین نوار تبلیغاتی و هدر چسبان: کاشی‌های ۶۴×۵۶px سفید
   با برچسب قرمز + یک کاشی توپر قرمز (شگفت‌انگیز) */

/** آیتم کاشی خدمات — ServiceItem کیت + فیلدهای هندسی (همه اختیاری) */
export interface TileEntry extends ServiceItem {
  href?: string;
  /** کاشی توپر قرمز شگفت‌انگیز با گلیف «٪» */
  red?: boolean;
}

export const TILES: TileEntry[] = [
  { icon: 'percent', title: 'شگفت‌انگیز', href: '/products#amazing', red: true },
  { icon: 'cart', title: 'سوپرمارکت', href: '/products?cat=super', color: 'var(--dk-success)' },
  { icon: 'heart', title: 'دیجی‌کیت پلاس', href: '/products?service=plus', color: 'var(--dk-primary-500)' },
  { icon: 'gift', title: 'کارت هدیه', href: '/products?gift=1', color: '#f59e0b' },
  { icon: 'credit', title: 'خرید اقساطی', href: '/products?installment=1', color: '#6366f1' },
  { icon: 'tag', title: 'پیشنهادها', href: '/products?sort=discount', color: '#f97316' },
];
