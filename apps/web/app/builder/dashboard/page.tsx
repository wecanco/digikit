import type { Metadata } from 'next';
import { DashboardClient } from './DashboardClient';

export const metadata: Metadata = {
  title: 'مدیریت صفحات | صفحه‌ساز دیجی‌کیت',
  description: 'داشبورد local-only برای مدیریت صفحات ساخته‌شده با صفحه‌ساز دیجی‌کیت.',
};

export default function BuilderDashboardPage() {
  return <DashboardClient />;
}
