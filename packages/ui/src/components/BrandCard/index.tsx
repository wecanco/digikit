import type { ReactNode } from 'react';
import styles from './styles.module.css';

export interface BrandCardProps {
  name: string;
  logo?: string;
  logoNode?: ReactNode;
  href?: string;
  count?: number;
  featured?: boolean;
  className?: string;
}

export function BrandCard({ name, logo, logoNode, href, count, featured, className }: BrandCardProps) {
  const content = <><span className={styles.logo}>{logoNode || (logo ? <img src={logo} alt="" /> : name.slice(0, 1))}</span><span className={styles.name}>{name}</span>{count != null && <small>{count.toLocaleString('fa-IR')} کالا</small>}{featured && <span className={styles.featured}>منتخب</span>}</>;
  const cls = [styles.card, featured && styles.isFeatured, className].filter(Boolean).join(' ');
  return href ? <a href={href} className={cls}>{content}</a> : <div className={cls}>{content}</div>;
}
