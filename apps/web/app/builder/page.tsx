import type { Metadata } from 'next';
import { BuilderClient } from './BuilderClient';

export const metadata: Metadata = {
  title: 'صفحه‌ساز دیجی‌کیت',
  description: 'صفحه‌ساز محلی RTL برای چیدن componentها و ماژول‌های دیجی‌کیت.',
};

export default function BuilderPage() {
  return <BuilderClient />;
}
