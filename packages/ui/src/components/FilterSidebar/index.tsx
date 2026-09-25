'use client';

import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import type { FilterSection } from '../../types';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Input } from '../Input';
import { RadioGroup } from '../RadioGroup';
import styles from './styles.module.css';

export interface FilterRangeValue { min?: string; max?: string; }

export interface FilterSidebarProps {
  sections: FilterSection[];
  values?: Record<string, string[]>;
  onChange?(sectionId: string, optionId: string, checked: boolean): void;
  onClear?(): void;
  ranges?: Record<string, FilterRangeValue>;
  onRangeChange?(sectionId: string, bound: 'min' | 'max', value: string): void;
  onApply?(): void;
  mobileOpen?: boolean;
  onMobileClose?(): void;
  className?: string;
}

export function FilterSidebar({ sections, values = {}, onChange, onClear, ranges = {}, onRangeChange, onApply, mobileOpen, onMobileClose, className }: FilterSidebarProps) {
  const [open, setOpen] = useState<Record<string, boolean>>(() => Object.fromEntries(sections.map((section) => [section.id, true])));
  const apply = onApply || onMobileClose;
  const panel = <aside className={[styles.sidebar, className].filter(Boolean).join(' ')} aria-label="فیلترهای کالا"><div className={styles.head}><div><strong>فیلترها</strong><small>انتخاب دقیق‌تر کالا</small></div><div className={styles.headActions}>{onClear && <button type="button" onClick={onClear}>حذف همه</button>}{onMobileClose && <button type="button" className={styles.close} onClick={onMobileClose} aria-label="بستن فیلتر"><X size={18} /></button>}</div></div>{sections.map((section) => <section className={styles.section} key={section.id}><button type="button" className={styles.sectionTitle} onClick={() => setOpen((current) => ({ ...current, [section.id]: !current[section.id] }))} aria-expanded={open[section.id]}><span>{section.title}</span><ChevronDown size={16} className={!open[section.id] ? styles.collapsed : undefined} aria-hidden="true" /></button>{open[section.id] && <div className={styles.options}>{section.type === 'radio' && section.options ? <RadioGroup name={`filter-${section.id}`} value={values[section.id]?.[0]} options={section.options.map((option) => ({ value: option.id, label: <>{option.label}{option.count != null && <small className={styles.count}>({option.count.toLocaleString('fa-IR')})</small>}</>, disabled: option.disabled }))} onChange={(value) => onChange?.(section.id, value, true)} /> : section.options?.map((option) => <Checkbox key={option.id} disabled={option.disabled} checked={values[section.id]?.includes(option.id) || false} onChange={(event) => onChange?.(section.id, option.id, event.target.checked)} label={<>{option.label}{option.count != null && <small className={styles.count}>({option.count.toLocaleString('fa-IR')})</small>}</>} />)}{!section.options?.length && <div className={styles.range}>{onRangeChange ? <Input size="sm" type="number" placeholder="حداقل" aria-label={`${section.title} حداقل`} value={ranges[section.id]?.min || ''} onChange={(event) => onRangeChange(section.id, 'min', event.target.value)} /> : <Input size="sm" type="number" placeholder="حداقل" aria-label={`${section.title} حداقل`} />}<span>تا</span>{onRangeChange ? <Input size="sm" type="number" placeholder="حداکثر" aria-label={`${section.title} حداکثر`} value={ranges[section.id]?.max || ''} onChange={(event) => onRangeChange(section.id, 'max', event.target.value)} /> : <Input size="sm" type="number" placeholder="حداکثر" aria-label={`${section.title} حداکثر`} />}</div>}</div>}</section>)}{apply && <Button fullWidth size="sm" startIcon={<SlidersHorizontal size={15} />} onClick={apply}>نمایش نتایج</Button>}</aside>;
  return <>{mobileOpen && <button type="button" className={styles.backdrop} aria-label="بستن فیلتر" onClick={onMobileClose} />}{panel}</>;
}
