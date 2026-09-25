'use client';

import { useState } from 'react';
import { Bell, MapPin, Menu, Search, ShoppingCart, User } from 'lucide-react';
import type { Category } from '../../types';
import { useCartCount } from '../../hooks/useCart';
import { useUser } from '../../hooks/useUser';
import { toFa } from '../../utils/format';
import { SearchPill } from '../Input';
import { MegaMenu } from '../MegaMenu';
import { SearchOverlay } from '../SearchOverlay';
import styles from './styles.module.css';

export interface HeaderProps {
  /** شناسهٔ لینک فعال ردیف دسته‌ها: amazing | supermarket | style | mag | sell */
  active?: string;
  /** دسته‌های مگامنو — اگر خالی باشد از DEFAULT_CATEGORIES مگامنو استفاده می‌شود */
  categories?: Category[];
  loginHref?: string;
  cartHref?: string;
  notificationHref?: string;
  locationHref?: string;
  onSearch?(query: string): void;
}

interface Row2Link {
  id: string;
  title: string;
  href: string;
}

const ROW2_LINKS: Row2Link[] = [
  { id: 'amazing', title: 'شگفت‌انگیزها', href: '/amazing' },
  { id: 'supermarket', title: 'سوپرمارکت', href: '/supermarket' },
  { id: 'style', title: 'دیجی‌کیت استایل', href: '/search?cat=fashion' },
  { id: 'mag', title: 'دیجی‌کیت مگ', href: '/mag' },
];

/** هدر دیجی‌کیت — چسبان به بالا؛ دسکتاپ: ردیف اصلی (لوگو/پیل جستجو/اعلان/ورود/سبد) + ردیف دسته‌ها با مگامنو؛ موبایل: نوار ۶۸px با پیل جستجوی خاکستری */
export function Header({ active, categories = [], loginHref = '/login', cartHref = '/cart', notificationHref = '/profile', locationHref = '/products', onSearch }: HeaderProps) {
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cartCount = useCartCount();
  const { user } = useUser();

  const submitSearch = (value: string) => {
    const query = value.trim();
    if (!query) return;
    setSearchOpen(false);
    if (onSearch) {
      onSearch(query);
      return;
    }
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  const row2LinkCls = (id: string) =>
    [styles.row2Link, active === id && styles.row2LinkActive].filter(Boolean).join(' ');

  return (
    <header className={styles.header}>
      {/* ── دسکتاپ: ردیف ۱ — لوگو، پیل جستجو ۴۹۲px، خنثی‌کننده، خوشه آیکون‌ها ── */}
      <div className={styles.row1Wrap}>
        <div className={styles.row1}>
          <a className={styles.logo} href="/" aria-label="دیجی‌کیت">
            <span className={styles.logoText}>دیجی‌کیت</span>
          </a>
          <div
            className={styles.pillWrap}
            onFocus={() => setSearchOpen(true)}
            onClick={() => setSearchOpen(true)}
          >
            <SearchPill
              className={styles.searchPill}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  submitSearch(searchQuery);
                }
              }}
            />
          </div>
          <div className={styles.spacer} aria-hidden="true" />
          <div className={styles.cluster}>
            <a className={styles.iconLink} href={notificationHref} aria-label="اعلان‌ها">
              <Bell size={22} strokeWidth={1.7} aria-hidden="true" />
              <span className={styles.badge}>{toFa(2)}</span>
            </a>
            <a className={styles.login} href={user ? '/profile' : loginHref} aria-label={user ? `حساب ${user.name}` : 'ورود | ثبت‌نام'}>
              <User size={20} strokeWidth={1.7} aria-hidden="true" />
              <span className={styles.loginText}>{user ? user.name : 'ورود | ثبت‌نام'}</span>
            </a>
            <div className={styles.divider} aria-hidden="true" />
            <a className={styles.iconLink} href={cartHref} aria-label="سبد خرید">
              <ShoppingCart size={24} strokeWidth={1.7} aria-hidden="true" />
              {cartCount > 0 && <span className={styles.badge}>{toFa(cartCount)}</span>}
            </a>
          </div>
        </div>
      </div>

      {/* ── دسکتاپ: ردیف ۲ — دسته‌ها؛ مگامنو با hover روی ردیف باز و خروج موس
            از ناحیه بسته می‌شود؛ کلیک ماشه فقط باز می‌کند. */}
      <div className={styles.row2Wrap} onMouseLeave={() => setMegaOpen(false)}>
        <div className={styles.row2}>
          <div className={styles.row2Start}>
            <button
              type="button"
              className={styles.megaTrigger}
              aria-expanded={megaOpen}
              aria-haspopup="true"
              onMouseEnter={() => setMegaOpen(true)}
              onClick={(e) => {
                e.stopPropagation(); // با شنوندهٔ کلیکِ بیرونِ مگامنو تداخل نکند
                setMegaOpen(true);
              }}
            >
              <Menu size={18} strokeWidth={1.7} aria-hidden="true" />
              دسته‌بندی کالاها
            </button>
            {ROW2_LINKS.map((l) => (
              <a key={l.id} href={l.href} className={row2LinkCls(l.id)}>
                {l.title}
              </a>
            ))}
          </div>
          <div className={styles.row2End}>
            <span className={styles.row2Divider} aria-hidden="true" />
            <a href="/sell" className={row2LinkCls('sell')}>
              در دیجی‌کیت بفروشید!
            </a>
            <a href={locationHref} className={styles.row2Link}>
              ارسال به تهران
              <MapPin size={16} strokeWidth={1.7} aria-hidden="true" />
            </a>
          </div>
        </div>
        <MegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} categories={categories} />
      </div>

      {/* ── موبایل: لوگو + پیل خاکستری جستجو (بازکننده اوورلی) + ورود و سبد ── */}
      <div className={styles.mobileBar}>
        <a className={styles.logo} href="/" aria-label="دیجی‌کیت">
          <span className={styles.logoTextMobile}>دیجی‌کیت</span>
        </a>
        <button
          type="button"
          className={styles.searchBtn}
          onClick={() => setSearchOpen(true)}
          aria-label="جستجو در دیجی‌کیت"
        >
          <Search size={16} strokeWidth={1.7} className={styles.searchBtnIcon} aria-hidden="true" />
          <span className={styles.searchBtnText}>جستجو در دیجی‌کیت</span>
        </button>
        <a
          href={user ? '/profile' : loginHref}
          className={styles.mobileIconBtn}
          aria-label={user ? user.name : 'ورود | ثبت‌نام'}
        >
          <User size={22} strokeWidth={1.7} aria-hidden="true" />
        </a>
        <a href={cartHref} className={styles.mobileIconBtn} aria-label="سبد خرید">
          <ShoppingCart size={22} strokeWidth={1.7} aria-hidden="true" />
          {cartCount > 0 && <span className={styles.badge}>{toFa(cartCount)}</span>}
        </a>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onSearch={submitSearch} />
    </header>
  );
}
