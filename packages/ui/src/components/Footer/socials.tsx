/* ─── گلیف‌های برند شبکه‌های اجتماعی ───
   lucide-react نسخه ۱.۴۷ آیکون‌های برند (اینستاگرام/توییتر/لینکدین) را ندارد؛
   مسیرهای SVG عیناً از partials.js (خطوط ۲۶۶-۲۶۸) به‌صورت fill منتقل شده‌اند.
   آپارات/تلگرام در index.tsx با lucide (Play/Send) نگاشت می‌شوند. */

export interface GlyphProps {
  size?: number;
}

export function InstagramGlyph({ size = 18 }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8C2.4 4 4 2.4 7.2 2.3c1.2-.1 1.6-.1 4.8-.1Zm0 1.8c-3.1 0-3.5 0-4.7.1-2.4.1-3 1-3.1 3.1-.1 1.2-.1 1.5-.1 4.6s0 3.5.1 4.7c.1 2.4 1 3 3.1 3.1 1.2.1 1.5.1 4.7.1s3.5 0 4.7-.1c2.4-.1 3-1 3.1-3.1.1-1.2.1-1.5.1-4.7s0-3.5-.1-4.7c-.1-2.4-1-3-3.1-3.1-1.2-.1-1.6-.1-4.7-.1Zm0 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm5.2-3.1a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
    </svg>
  );
}

export function TwitterGlyph({ size = 16 }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L2.8 2h6.4l4.4 5.9L18.9 2Zm-1.1 18.1h1.7L7.1 3.8H5.3l12.5 16.3Z" />
    </svg>
  );
}

export function LinkedinGlyph({ size = 18 }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.22 8.09h4.56V23H.22V8.09Zm7.94 0h4.37v2.04h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 7v8.25h-4.55v-7.32c0-1.75-.03-4-2.44-4-2.44 0-2.81 1.9-2.81 3.87V23H8.16V8.09Z" />
    </svg>
  );
}
