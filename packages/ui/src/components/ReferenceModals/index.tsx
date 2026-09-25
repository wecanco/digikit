'use client';

import { AlertTriangle, Filter, Search, X } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Modal } from '../Modal';
import styles from './styles.module.css';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'primary';
  loading?: boolean;
  onConfirm(): void;
  onClose(): void;
  className?: string;
}

export function ConfirmDialog({ open, title, description, confirmLabel = 'تأیید و ادامه', cancelLabel = 'لغو', tone = 'danger', loading, onConfirm, onClose, className }: ConfirmDialogProps) {
  return <Modal open={open} onClose={onClose} title={title} description={description}><div className={[styles.confirm, className].filter(Boolean).join(' ')}><span className={[styles.confirmIcon, tone === 'primary' ? styles.primary : styles.danger].join(' ')}><AlertTriangle size={24} aria-hidden="true" /></span><div className={styles.actions}><Button variant={tone === 'danger' ? 'danger' : 'primary'} loading={loading} onClick={onConfirm}>{confirmLabel}</Button><Button variant="ghost" onClick={onClose}>{cancelLabel}</Button></div></div></Modal>;
}

export interface FilterDialogProps {
  open: boolean;
  children: ReactNode;
  title?: string;
  applyLabel?: string;
  resetLabel?: string;
  onApply?(): void;
  onReset?(): void;
  onClose(): void;
  className?: string;
}

export function FilterDialog({ open, children, title = 'فیلترها', applyLabel = 'نمایش نتایج', resetLabel = 'حذف فیلترها', onApply, onReset, onClose, className }: FilterDialogProps) {
  return <Modal open={open} onClose={onClose} title={title}><div className={[styles.filter, className].filter(Boolean).join(' ')}><div className={styles.filterIcon}><Filter size={20} aria-hidden="true" /></div><div className={styles.filterBody}>{children}</div><footer className={styles.actions}>{onReset && <Button variant="ghost" onClick={onReset}>{resetLabel}</Button>}{onApply && <Button onClick={onApply}>{applyLabel}</Button>}</footer></div></Modal>;
}

export interface SearchDialogResult {
  id: string | number;
  label: string;
  description?: string;
  href?: string;
}

export interface SearchDialogProps {
  open: boolean;
  value: string;
  results?: SearchDialogResult[];
  placeholder?: string;
  title?: string;
  emptyLabel?: string;
  onChange(value: string): void;
  onSubmit?(value: string): void;
  onSelect?(result: SearchDialogResult): void;
  onClose(): void;
  className?: string;
}

export function SearchDialog({ open, value, results = [], placeholder = 'جستجوی کالا، برند یا دسته‌بندی', title = 'جستجو', emptyLabel = 'نتیجه‌ای پیدا نشد', onChange, onSubmit, onSelect, onClose, className }: SearchDialogProps) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(value);
  };
  return <Modal open={open} onClose={onClose} title={title}><div className={[styles.search, className].filter(Boolean).join(' ')}><form className={styles.searchForm} onSubmit={submit}><Input autoFocus value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} variant="search" aria-label={placeholder} /><Button type="submit" size="sm" startIcon={<Search size={15} aria-hidden="true" />}>جستجو</Button></form><div className={styles.results} aria-live="polite">{results.length ? results.map((result) => { const content = <><strong>{result.label}</strong>{result.description && <small>{result.description}</small>}</>; return result.href ? <a key={result.id} href={result.href} onClick={() => onSelect?.(result)}>{content}</a> : <button type="button" key={result.id} onClick={() => onSelect?.(result)}>{content}</button>; }) : value.trim() ? <div className={styles.empty}>{emptyLabel}</div> : <div className={styles.empty}>عبارت جستجو را وارد کنید.</div>}</div><button type="button" className={styles.closeSearch} onClick={onClose}><X size={15} aria-hidden="true" />بستن</button></div></Modal>;
}
