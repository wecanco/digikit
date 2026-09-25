import { ArrowLeft } from 'lucide-react';
import type { Category } from '../../types';
import styles from './styles.module.css';

export interface CategoryCardProps {
  category: Category;
  href?: string;
  count?: number;
  compact?: boolean;
  className?: string;
}

export function CategoryCard({ category, href, count, compact, className }: CategoryCardProps) {
  const content = <><span className={styles.icon} style={{ background: `${category.color}18`, color: category.color }} aria-hidden="true">{category.icon}</span><span className={styles.copy}><strong>{category.title}</strong>{count != null && <small>{count.toLocaleString('fa-IR')} کالا</small>}</span>{href && <ArrowLeft size={16} className={styles.arrow} aria-hidden="true" />}</>;
  const cls = [styles.card, compact && styles.compact, className].filter(Boolean).join(' ');
  return href ? <a href={href} className={cls}>{content}</a> : <div className={cls}>{content}</div>;
}
