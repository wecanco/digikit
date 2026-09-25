import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { toFa } from '../../utils/format';
import styles from './styles.module.css';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onChange(page: number): void;
  siblingCount?: number;
  className?: string;
}

export function Pagination({ page, totalPages, onChange, siblingCount = 1, className }: PaginationProps) {
  const pages: Array<number | 'ellipsis'> = [];
  const start = Math.max(2, page - siblingCount);
  const end = Math.min(totalPages - 1, page + siblingCount);
  pages.push(1);
  if (start > 2) pages.push('ellipsis');
  for (let current = start; current <= end; current += 1) pages.push(current);
  if (end < totalPages - 1) pages.push('ellipsis');
  if (totalPages > 1) pages.push(totalPages);
  if (totalPages <= 1) return null;
  return (
    <nav className={[styles.nav, className].filter(Boolean).join(' ')} aria-label="صفحه‌بندی">
      <button type="button" className={styles.arrow} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="صفحه قبل"><ChevronRight size={17} /></button>
      {pages.map((item, index) => item === 'ellipsis' ? <span className={styles.ellipsis} key={`e-${index}`}><MoreHorizontal size={16} /></span> : <button type="button" key={item} className={[styles.page, item === page && styles.active].filter(Boolean).join(' ')} aria-current={item === page ? 'page' : undefined} onClick={() => onChange(item)}>{toFa(item)}</button>)}
      <button type="button" className={styles.arrow} disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="صفحه بعد"><ChevronLeft size={17} /></button>
    </nav>
  );
}
