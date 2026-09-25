import { ArrowDownUp, Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { DropdownMenu } from '../DropdownMenu';
import { toFa } from '../../utils/format';
import styles from './styles.module.css';

export interface SortOption { value: string; label: string; }

export interface SortBarProps {
  value: string;
  options: SortOption[];
  onChange(value: string): void;
  total?: number;
  leading?: ReactNode;
  className?: string;
}

export function SortBar({ value, options, onChange, total, leading = 'مرتب‌سازی:', className }: SortBarProps) {
  const selected = options.find((option) => option.value === value) || options[0];
  return <div className={[styles.bar, className].filter(Boolean).join(' ')}><span className={styles.leading}>{leading}</span><div className={styles.desktop}>{options.map((option) => <button key={option.value} type="button" className={option.value === value ? styles.active : undefined} onClick={() => onChange(option.value)}>{option.label}{option.value === value && <Check size={14} />}</button>)}</div><div className={styles.mobile}><DropdownMenu trigger={<span className={styles.trigger}><ArrowDownUp size={15} />{selected?.label}</span>} items={options.map((option) => ({ id: option.value, label: option.label, onSelect: () => onChange(option.value) }))} /></div>{total != null && <span className={styles.total}>{toFa(total)} کالا</span>}</div>;
}
