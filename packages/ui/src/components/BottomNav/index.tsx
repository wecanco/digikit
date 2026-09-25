'use client';

/* ─── ناوبری پایین موبایل — پورت bottomNavHTML از partials.js (خطوط ۳۲۹-۳۵۳) ───
   فقط زیر ۱۰۲۴px: نوار ثابت پایین صفحه با ۵ تب (flex justify-around + flex-1)،
   تب فعال قرمز پرایمری و بقیه خاکستری؛ بج سبد خرید با ارقام فارسی (toFa) که با
   useCartCount زنده می‌شود و وقتی سبد خالی است حذف می‌گردد. */

import { Home, LayoutGrid, Menu, ShoppingCart, User, type LucideIcon } from 'lucide-react';
import { useCartCount } from '../../hooks/useCart';
import { toFa } from '../../utils/format';
import styles from './styles.module.css';

/** صفحاتی که id صفحه‌شان (data-page) با آی‌دی تبی که باید روشن شود متفاوت است */
const ALIAS: Record<string, string> = { categories: 'cats', 'mag-post': 'mag' };

interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: LucideIcon;
  /** تب سبد خرید — بج تعداد می‌گیرد */
  badge?: boolean;
}

const ITEMS: NavItem[] = [
  { id: 'home', href: '/', label: 'خانه', icon: Home },
  { id: 'cats', href: '/categories', label: 'دسته‌بندی', icon: LayoutGrid },
  { id: 'cart', href: '/cart', label: 'سبد خرید', icon: ShoppingCart, badge: true },
  { id: 'mag', href: '/mag', label: 'مجله', icon: Menu },
  { id: 'profile', href: '/profile', label: 'دیجی‌کیت من', icon: User },
];

export interface BottomNavProps {
  /** id صفحه جاری — نام‌های مستعار نگاشت می‌شوند: categories → cats، mag-post → mag */
  active?: string;
}

/** ناوبری پایین موبایل — لینک‌های همان href دموی وانیلا */
export function BottomNav({ active = 'home' }: BottomNavProps) {
  const count = useCartCount();
  const cur = ALIAS[active] ?? active;

  return (
    <nav className={styles.nav} aria-label="ناوبری موبایل دیجی‌کیت">
      <ul className={styles.list}>
        {ITEMS.map((it) => {
          const isActive = cur === it.id;
          const Icon = it.icon;
          return (
            <li key={it.id} className={styles.item}>
              <a
                href={it.href}
                className={[styles.link, isActive ? styles.linkActive : ''].join(' ').trim()}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={22} strokeWidth={1.7} aria-hidden="true" />
                <span>{it.label}</span>
                {it.badge && count > 0 && (
                  <span className={styles.badge} data-cart-badge>{toFa(count)}</span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
