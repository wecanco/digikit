/* داده‌های پیش‌فرض اوورلی جستجو برای دمو و راهنمای کامپوننت */

/** جستجوهای اخیر پیش‌فرض */
export const DEFAULT_RECENTS: string[] = ['گوشی موبایل', 'هدفون بی‌سیم'];

/** عبارت‌های پرجست‌وجوی نمونه */
export const TRENDING: string[] = [
  'استند لوازم آرایشی',
  'آیفون 18',
  'شورت',
  'لاستیک پراید',
  'آبمیوه گیری',
  'ساعت هوشمند',
];

/** دسته‌بندی‌های محبوب برای نمایش در موبایل */
export interface PopularCat {
  title: string;
  icon: string;
  color: string;
}

export const POPULAR_CATS: PopularCat[] = [
  { title: 'گوشی موبایل', icon: '📱', color: '#fde3e6' },
  { title: 'هدفون', icon: '🎧', color: '#e3e8fd' },
  { title: 'لپ‌تاپ', icon: '💻', color: '#d8f3e3' },
  { title: 'ساعت هوشمند', icon: '⌚', color: '#fdefd3' },
  { title: 'تبلت', icon: '📲', color: '#e9e1f9' },
  { title: 'تلویزیون', icon: '📺', color: '#d3eef7' },
];

/** کالاهای پرمخاطب نمونه برای دراپ‌داون دسکتاپ */
export interface MiniProduct {
  title: string;
  seed: number;
  label: string;
}

export const POPULAR_PRODUCTS: MiniProduct[] = [
  { title: 'گوشی موبایل سامسونگ مدل Galaxy S24 Ultra ظرفیت ۲۵۶ گیگابایت', seed: 1, label: 'سامسونگ' },
  { title: 'گوشی موبایل اپل مدل iPhone 15 Pro Max ظرفیت ۲۵۶ گیگابایت', seed: 2, label: 'اپل' },
  { title: 'هدفون بی‌سیم اپل مدل AirPods Pro نسل دوم', seed: 7, label: 'اپل' },
  { title: 'ساعت هوشمند شیائومی مدل Redmi Watch 4', seed: 8, label: 'شیائومی' },
  { title: 'کنسول بازی سونی PlayStation 5 Slim ظرفیت یک ترابایت', seed: 9, label: 'سونی' },
  { title: 'پاوربانک ۲۰۰۰۰ میلی‌آمپر انکر مدل PowerCore', seed: 22, label: 'انکر' },
];

/* placeholder کوچک و قطعی برای تصویر کارت‌های مینی */
const HUES: Array<[number, number, number]> = [
  [222, 46, 55],
  [262, 40, 55],
  [12, 72, 55],
  [158, 48, 42],
  [205, 62, 50],
  [330, 52, 55],
  [40, 70, 55],
  [96, 38, 45],
];

export function miniPlaceholder(seed: number, label = ''): string {
  const [h, s, l] = HUES[Math.abs(seed * 7) % HUES.length];
  const l2 = Math.min(l + 14, 88);
  const txt = label.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const fontSize = Math.round(300 / (txt.length > 14 ? 24 : txt.length > 8 ? 19 : 14));
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    `<stop offset="0" stop-color="hsl(${h} ${s}% ${l}%)"/>` +
    `<stop offset="1" stop-color="hsl(${h} ${s}% ${l2}%)"/>` +
    '</linearGradient></defs>' +
    '<rect width="300" height="300" fill="url(#g)"/>' +
    '<circle cx="234" cy="66" r="60" fill="#ffffff" opacity="0.07"/>' +
    '<circle cx="60" cy="240" r="84" fill="#ffffff" opacity="0.05"/>' +
    `<text x="50%" y="47%" text-anchor="middle" dominant-baseline="middle" font-family="Vazir, Tahoma" font-size="${fontSize}" fill="#ffffff" opacity="0.92" font-weight="700">${txt}</text>` +
    '<text x="50%" y="60%" text-anchor="middle" font-family="Vazir, Tahoma" font-size="15" fill="#ffffff" opacity="0.6">دیجی‌کیت</text>' +
    '</svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
