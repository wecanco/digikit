'use client';

import { useId } from 'react';
import styles from './styles.module.css';

export type PlaceholderRatio = '1:1' | '3:2' | '16:9' | 'wide';

export interface PlaceholderImageProps {
  /** بذر قطعی — عدد یا رشته (برای رشته همان hash دمو استفاده می‌شود) */
  seed: number | string;
  /** برچسب اختیاری وسط تصویر (سفید، شفافیت ۶۰٪، ۱۳px وزیرمتن) */
  label?: string;
  /** نسبت تصویر — پیش‌فرض مربع؛ 'wide' = ۳.۳۵:۱ (بنر دسته‌ها) */
  ratio?: PlaceholderRatio;
  className?: string;
}

/* ابعاد viewBox برای هر نسبت — چون با slice و ۱۰۰٪×۱۰۰٪ رندر می‌شود،
   viewBox فقط نسبت ذاتی را تعیین می‌کند */
const SIZES: Record<PlaceholderRatio, { w: number; h: number }> = {
  '1:1': { w: 300, h: 300 },
  '3:2': { w: 300, h: 200 },
  '16:9': { w: 320, h: 180 },
  wide: { w: 335, h: 100 },
};

/* همان hash دموی Vite (categories.js) برای بذرهای رشته‌ای */
function hash(s: string): number {
  let h = 0;
  for (const ch of s) h = (h * 31 + (ch.codePointAt(0) ?? 0)) >>> 0;
  return h;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* پالت قطعی: hue = (seed × 47) % 360؛ گرادیان قطری از hue به hue+60 */
function hueOf(seed: number | string): number {
  const n = typeof seed === 'number' ? Math.trunc(seed) : hash(seed);
  return Math.abs(n * 47) % 360;
}

/** مولد SVG تصویر شبح — هم‌ارز placeholder() دموی Vite (خروجی رشته SVG) */
export function placeholder(seed: number | string = 1, label = '', ratio: PlaceholderRatio = '1:1'): string {
  const { w, h } = SIZES[ratio];
  const hue = hueOf(seed);
  const from = `hsl(${hue} 70% 58%)`;
  const to = `hsl(${(hue + 60) % 360} 70% 58%)`;
  const txt = escapeXml(label);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${txt}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<circle cx="${Math.round(w * 0.78)}" cy="${Math.round(h * 0.22)}" r="${Math.round(w * 0.2)}" fill="#ffffff" opacity="0.07"/>
<circle cx="${Math.round(w * 0.2)}" cy="${Math.round(h * 0.8)}" r="${Math.round(w * 0.28)}" fill="#ffffff" opacity="0.05"/>${txt ? `
<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Vazir, Tahoma" font-size="13px" font-weight="700" fill="#ffffff" opacity="0.6">${txt}</text>` : ''}
</svg>`;
}

/** تصویر شبح قطعی (SVG درون‌خطی) — گرادیان دو hue + دایره‌های محو + برچسب وسط */
export function PlaceholderImage({ seed, label = '', ratio = '1:1', className }: PlaceholderImageProps) {
  const { w, h } = SIZES[ratio];
  const hue = hueOf(seed);
  const from = `hsl(${hue} 70% 58%)`;
  const to = `hsl(${(hue + 60) % 360} 70% 58%)`;
  /* شناسه یکتا برای گرادیان (useId) تا تداخلی بین چند نمونه پیش نیاید */
  const gid = `nbph-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <svg
      className={[styles.img, className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label || undefined}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width={w} height={h} fill={`url(#${gid})`} />
      <circle cx={Math.round(w * 0.78)} cy={Math.round(h * 0.22)} r={Math.round(w * 0.2)} fill="#ffffff" opacity={0.07} />
      <circle cx={Math.round(w * 0.2)} cy={Math.round(h * 0.8)} r={Math.round(w * 0.28)} fill="#ffffff" opacity={0.05} />
      {label ? (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Vazir, Tahoma"
          fontSize={13}
          fontWeight={700}
          fill="#ffffff"
          opacity={0.6}
        >
          {label}
        </text>
      ) : null}
    </svg>
  );
}
