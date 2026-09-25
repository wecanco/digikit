'use client';

import { LogIn, LogOut, UserRound } from 'lucide-react';
import { DropdownMenu } from '../DropdownMenu';
import { Skeleton } from '../Skeleton';
import styles from './styles.module.css';

export interface UserMenuProps {
  name: string;
  profileHref?: string;
  profileLabel?: string;
  onProfile?(): void;
  onLogout?(): void;
  className?: string;
}

export function UserMenu({ name, profileHref = '/profile', profileLabel = 'حساب کاربری', onProfile, onLogout, className }: UserMenuProps) {
  const items = [
    { id: 'profile', label: <span className={styles.menuLink}>{profileLabel}<span>{name}</span></span>, icon: <UserRound size={16} aria-hidden="true" />, onSelect: onProfile || (() => { window.location.assign(profileHref); }) },
    ...(onLogout ? [{ id: 'logout', label: 'خروج از حساب', icon: <LogOut size={16} aria-hidden="true" />, danger: true, onSelect: onLogout }] : []),
  ];
  return <div className={[styles.userMenu, className].filter(Boolean).join(' ')}><DropdownMenu label="منوی کاربر" trigger={<span className={styles.trigger}><UserRound size={19} aria-hidden="true" /><span>{name}</span></span>} items={items} /></div>;
}

export interface AuthLinksProps {
  authenticated?: boolean;
  loading?: boolean;
  name?: string;
  loginHref?: string;
  registerHref?: string;
  profileHref?: string;
  onLogout?(): void;
  className?: string;
}

export function AuthLinks({ authenticated, loading, name = 'کاربر دیجی‌کیت', loginHref = '/login', registerHref = '/register', profileHref = '/profile', onLogout, className }: AuthLinksProps) {
  if (loading) return <span className={[styles.loading, className].filter(Boolean).join(' ')} aria-label="در حال بارگذاری حساب"><Skeleton variant="circle" width={28} height={28} /><Skeleton variant="text" width={86} /></span>;
  if (authenticated) return <UserMenu name={name} profileHref={profileHref} onLogout={onLogout} className={className} />;
  return <div className={[styles.authLinks, className].filter(Boolean).join(' ')}><a href={loginHref}><LogIn size={17} aria-hidden="true" />ورود</a><span aria-hidden="true" />{registerHref && <a href={registerHref}>ثبت‌نام</a>}</div>;
}

export interface MobileUserButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function MobileUserButton({ href = '/profile', label = 'حساب کاربری', className }: MobileUserButtonProps) {
  return <a href={href} className={[styles.mobileButton, className].filter(Boolean).join(' ')} aria-label={label}><UserRound size={21} aria-hidden="true" /></a>;
}
