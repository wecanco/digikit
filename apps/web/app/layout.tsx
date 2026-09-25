import type { Metadata, Viewport } from 'next';
import '@digikit/ui/fonts.css';
import '@digikit/ui/styles.css';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'دیجی‌کیت | سیستم طراحی RTL',
    template: '%s | دیجی‌کیت UI',
  },
  description: 'راهنمای تعاملی و ویترین نمونه‌ی سیستم طراحی React دیجی‌کیت برای محصولات فارسی و رابط‌های RTL.',
};

export const viewport: Viewport = {
  themeColor: '#ef394e',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="dk-root">{children}</body>
    </html>
  );
}
