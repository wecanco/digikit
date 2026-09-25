'use client';

import { ArrowRight, ChevronDown, ChevronLeft, Upload, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type ChangeEvent, type KeyboardEvent, type ReactNode } from 'react';
import styles from './styles.module.css';

export interface ComboboxOption {
  id: string | number;
  label: string;
  meta?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: ComboboxOption | null;
  onChange?(option: ComboboxOption | null): void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Combobox({ options, value, onChange, placeholder = 'انتخاب کنید', label, disabled, className }: ComboboxProps) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(value?.label || '');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const filtered = query.trim() ? options.filter((option) => option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase())) : options;

  useEffect(() => setQuery(value?.label || ''), [value?.label]);
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const select = (option: ComboboxOption) => {
    if (option.disabled) return;
    setQuery(option.label);
    setOpen(false);
    setActiveIndex(-1);
    onChange?.(option);
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!filtered.length) return;
      const offset = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((current) => (current + offset + filtered.length) % filtered.length);
      setOpen(true);
      return;
    }
    if (event.key === 'Enter' && open && activeIndex >= 0) {
      event.preventDefault();
      select(filtered[activeIndex]);
    }
  };

  return <div className={[styles.combobox, className].filter(Boolean).join(' ')} ref={rootRef}>{label && <label className={styles.fieldLabel} htmlFor={id}>{label}</label>}<span className={styles.comboboxControl}><input id={id} value={query} disabled={disabled} placeholder={placeholder} role="combobox" aria-expanded={open} aria-controls={`${id}-listbox`} aria-activedescendant={activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined} aria-autocomplete="list" onFocus={() => { setOpen(true); setActiveIndex(filtered.length ? 0 : -1); }} onKeyDown={onInputKeyDown} onChange={(event) => { setQuery(event.target.value); setOpen(true); setActiveIndex(0); if (!event.target.value) onChange?.(null); }} /><button type="button" aria-label={open ? 'بستن گزینه‌ها' : 'باز کردن گزینه‌ها'} disabled={disabled} onClick={() => { setOpen((current) => !current); setActiveIndex(filtered.length ? 0 : -1); }}><ChevronDown size={16} aria-hidden="true" /></button></span>{open && <ul id={`${id}-listbox`} className={styles.options} role="listbox">{filtered.length ? filtered.map((option, index) => <li id={`${id}-option-${index}`} key={option.id} role="option" aria-selected={value?.id === option.id} aria-disabled={option.disabled || undefined} data-active={activeIndex === index || undefined} className={option.disabled ? styles.optionDisabled : undefined} onMouseEnter={() => setActiveIndex(index)} onMouseDown={(event) => event.preventDefault()} onClick={() => select(option)}><span>{option.label}</span>{option.meta && <small>{option.meta}</small>}</li>) : <li className={styles.noResults}>موردی پیدا نشد</li>}</ul>}</div>;
}

export interface PageContainerProps {
  title: string;
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
  className?: string;
}

export function PageContainer({ title, children, backHref, backLabel = 'بازگشت', className }: PageContainerProps) {
  return <section className={[styles.pageContainer, className].filter(Boolean).join(' ')}>{backHref && <a href={backHref} className={styles.backLink}><ArrowRight size={16} aria-hidden="true" />{backLabel}</a>}<div className={styles.pageTitle}><h1>{title}</h1></div><div className={styles.pageBody}>{children}</div></section>;
}

export interface TableContainerProps {
  headers: ReactNode[];
  children: ReactNode;
  caption?: string;
  className?: string;
}

export function TableContainer({ headers, children, caption, className }: TableContainerProps) {
  return <div className={[styles.tableWrap, className].filter(Boolean).join(' ')}><table>{caption && <caption>{caption}</caption>}<thead><tr>{headers.map((header, index) => <th key={index} scope="col">{header}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}

export interface UploadImageProps {
  value?: string;
  onChange?(file: File | null): void;
  label?: string;
  accept?: string;
  disabled?: boolean;
  className?: string;
}

export function UploadImage({ value, onChange, label = 'آپلود تصویر', accept = 'image/*', disabled, className }: UploadImageProps) {
  const id = useId();
  const [preview, setPreview] = useState(value);
  useEffect(() => {
    setPreview(value);
  }, [value]);
  useEffect(() => () => {
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
  }, [preview]);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    const next = file ? URL.createObjectURL(file) : undefined;
    setPreview(next);
    onChange?.(file);
  };
  const removePreview = () => {
    setPreview(undefined);
    onChange?.(null);
  };
  return <div className={[styles.upload, className].filter(Boolean).join(' ')}><label className={styles.fieldLabel} htmlFor={id}>{label}</label><label htmlFor={id} className={styles.uploadControl}>{preview ? <img src={preview} alt="پیش‌نمایش تصویر انتخاب‌شده" /> : <span><Upload size={22} aria-hidden="true" /><small>انتخاب فایل</small></span>}<input id={id} type="file" accept={accept} disabled={disabled} onChange={handleChange} /></label>{preview && <button type="button" className={styles.removeUpload} onClick={removePreview}><X size={15} aria-hidden="true" />حذف تصویر</button>}</div>;
}

export function ArrowLink({ children, href, className }: { children: ReactNode; href: string; className?: string }) {
  return <a href={href} className={[styles.arrowLink, className].filter(Boolean).join(' ')}>{children}<ChevronLeft size={15} aria-hidden="true" /></a>;
}
