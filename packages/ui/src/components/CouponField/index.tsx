'use client';

import { Check, Tag, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import styles from './styles.module.css';

export interface CouponFieldProps {
  value?: string;
  appliedCode?: string;
  onApply?(code: string): void;
  onRemove?(): void;
  loading?: boolean;
  message?: string;
  className?: string;
}

export function CouponField({ value, appliedCode, onApply, onRemove, loading, message, className }: CouponFieldProps) {
  const [code, setCode] = useState(value || '');
  if (appliedCode) return <div className={[styles.applied, className].filter(Boolean).join(' ')}><span><Check size={16} />کد <strong>{appliedCode}</strong> اعمال شد</span>{onRemove && <button type="button" onClick={onRemove} aria-label="حذف کد تخفیف"><X size={16} /></button>}</div>;
  return <div className={[styles.wrap, className].filter(Boolean).join(' ')}><div className={styles.input}><Input value={code} onChange={(event) => setCode(event.target.value)} placeholder="کد تخفیف دارید؟" startAdornment={<Tag size={17} />} onKeyDown={(event) => { if (event.key === 'Enter') onApply?.(code); }} /><Button size="sm" loading={loading} onClick={() => onApply?.(code)}>اعمال</Button></div>{message && <p>{message}</p>}</div>;
}
