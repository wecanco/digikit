import type { ServiceItem } from '../../types';

/* ─── داده‌های نوار خدمات — منتقل ۱:۱ از partials.js:359-370 (موبایل)
       و data.js:123-134 (دسکتاپ) ─── */

/** آیتم نوار خدمات — ServiceItem کیت + فیلدهای هندسی نوار (همه اختیاری،
    پس ServiceItem[] ساده هم به این نوع انتساب‌پذیر است) */
export interface ServiceEntry extends ServiceItem {
  href?: string;
  /** پس‌زمینه دیسک توپر (رنگ CSS) — پیش‌فرض ink */
  solid?: string;
  /** دیسک روشن خاکستری (#efeff1) با گلیف تیره — فقط ردیف دسکتاپ */
  light?: boolean;
  /** واژه‌نگار داخل دیسک به‌جای آیکون (مثل کاشی سیاه «دیجی‌کیت») */
  wordmark?: string;
  /** نشان قرمز کوچک روی دیسک (فقط ردیف دسکتاپ — مثل «۲» دیجی‌کیت کلاب) */
  badge?: string;
  /** رنگ برچسب زیر دیسک (فقط ردیف موبایل) */
  labelColor?: string;
}

/* موبایل (ref m01 y420-470): دیسک‌های توپر ۴۰px با گلیف سفید + برچسب رنگی؛
   ترتیب راست‌به‌چپ: قرمز، فیروزه‌ای، آبی، سبز، ورد‌مارک مشکی، سرمه‌ای،
   کهربایی، زرشکی، نارنجی، آبی آسمانی */
export const MOBILE_SERVICES: ServiceEntry[] = [
  { icon: 'bolt', title: 'شگفت‌انگیز', href: '/products#amazing', solid: 'var(--dk-primary-500)', labelColor: 'var(--dk-primary-600)' },
  { icon: 'book', title: 'دانشنامه مصور', href: '/mag', solid: '#0f7f80', labelColor: '#0f7f80' },
  { icon: 'credit', title: 'خرید اقساطی', href: '/products?installment=1', solid: '#2b4dcf', labelColor: '#2b4dcf' },
  { icon: 'cart', title: 'سوپرمارکت', href: '/products?cat=super', solid: '#37a04a', labelColor: '#37a04a' },
  { icon: 'دیجی‌کیت', title: 'دیجی‌کیت', href: '/', solid: '#000', wordmark: 'دیجی‌کیت', labelColor: 'var(--dk-ink)' },
  { icon: 'sparkles', title: 'دیجی‌کیت استایل', href: '/products?cat=style', solid: '#302443', labelColor: '#302443' },
  { icon: 'coins', title: 'طلا و نقره', href: '/products?cat=gold', solid: '#f0a020', labelColor: '#d97706' },
  { icon: 'heart', title: 'دیجی‌کیت کلاب', href: '/profile', solid: '#a61430', labelColor: '#a61430' },
  { icon: 'gift', title: 'کارت هدیه', href: '/products?gift=1', solid: '#c2410c', labelColor: '#c2410c' },
  { icon: 'backpack', title: 'همه چیز برای مدرسه', href: '/products?cat=school', solid: '#0369a1', labelColor: '#0369a1' },
];

/* دسکتاپ (reference d01): ترکیب مقید — چند دیسک تیره/رنگی توپر + دیسک‌های
   روشن خاکستری با گلیف تیره، کاشی ورد‌مارک مشکی، نشان قرمز کوچک روی دیجی‌کیت کلاب،
   و کاشی «⋯» در انتهای چپ ردیف */
export const DESKTOP_SERVICES: ServiceEntry[] = [
  { icon: 'bolt', title: 'شگفت‌انگیز', href: '/products#amazing', solid: 'var(--dk-primary-500)' },
  { icon: 'heart', title: 'دیجی‌کیت کلاب', href: '/profile', solid: '#a61430', badge: '۲' },
  { icon: 'دیجی‌کیت', title: 'دیجی‌کیت', href: '/', solid: '#000', wordmark: 'دیجی‌کیت' },
  { icon: 'cart', title: 'سوپرمارکت', href: '/products?cat=super', solid: 'var(--dk-success)' },
  { icon: 'sparkles', title: 'دیجی‌کیت استایل', href: '/products?cat=style', solid: 'var(--dk-ink)' },
  { icon: 'coins', title: 'طلا و نقره', href: '/products?cat=gold', solid: '#f0a020' },
  { icon: 'credit', title: 'خرید اقساطی', href: '/products?installment=1', light: true },
  { icon: 'gift', title: 'کارت هدیه', href: '/products?gift=1', light: true },
  { icon: 'book', title: 'دانشنامه مصور', href: '/mag', solid: '#19bfd3' },
  { icon: 'backpack', title: 'مدرسه و دانشگاه', href: '/products?cat=school', light: true },
];
