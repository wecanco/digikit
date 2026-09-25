'use client';

import { Filter, ListFilter, Search, X } from 'lucide-react';
import type { KitComponentEntry } from './registry.generated';
import s from './workbench.module.css';

export interface ComponentSidebarProps {
  entries: KitComponentEntry[];
  groups: string[];
  selectedSlug: string;
  search: string;
  group: string;
  onSearch(value: string): void;
  onGroupChange(value: string): void;
  onSelect(entry: KitComponentEntry): void;
}

export function ComponentSidebar({ entries, groups, selectedSlug, search, group, onSearch, onGroupChange, onSelect }: ComponentSidebarProps) {
  const counts = new Map<string, number>();
  for (const entry of entries) counts.set(entry.group, (counts.get(entry.group) || 0) + 1);

  return (
    <aside className={s.sidebar} aria-label="فهرست کامپوننت‌های دیجی‌کیت">
      <div className={s.sidebarHeader}>
        <div>
          <span className={s.eyebrow}>COMPONENT LIBRARY</span>
          <h2>کامپوننت‌ها</h2>
          <p>{entries.length.toLocaleString('fa-IR')} کامپوننت قابل بررسی</p>
        </div>
        <span className={s.sidebarIcon}><ListFilter size={18} aria-hidden="true" /></span>
      </div>
      <label className={s.searchBox}>
        <Search size={17} aria-hidden="true" />
        <input type="search" value={search} onChange={(event) => onSearch(event.target.value)} placeholder="جستجوی نام، گروه یا تگ…" aria-label="جستجوی کامپوننت" />
        {search && <button type="button" onClick={() => onSearch('')} aria-label="پاک کردن جستجو"><X size={15} aria-hidden="true" /></button>}
      </label>
      <div className={s.groupFilter} aria-label="فیلتر گروه">
        <button type="button" className={group === 'all' ? s.groupActive : s.groupButton} onClick={() => onGroupChange('all')}><Filter size={14} aria-hidden="true" /> همه <span>{entries.length.toLocaleString('fa-IR')}</span></button>
        {groups.map((item) => (
          <button type="button" key={item} className={group === item ? s.groupActive : s.groupButton} onClick={() => onGroupChange(item)}>
            <span>{item}</span><span>{(counts.get(item) || 0).toLocaleString('fa-IR')}</span>
          </button>
        ))}
      </div>
      <div className={s.componentList} role="listbox" aria-label="کامپوننت‌ها">
        {entries.length ? entries.map((entry) => (
          <button type="button" role="option" aria-selected={entry.slug === selectedSlug} className={entry.slug === selectedSlug ? s.componentActive : s.componentItem} key={entry.slug} onClick={() => onSelect(entry)}>
            <span className={s.componentItemText}><strong>{entry.label}</strong><code>{entry.exportName}</code></span>
            {entry.hasCustomDemo && <span className={s.demoDot} title="دموی اختصاصی" aria-label="دموی اختصاصی" />}
          </button>
        )) : (
          <div className={s.emptySidebar}><Search size={22} aria-hidden="true" /><strong>چیزی پیدا نشد</strong><span>عبارت جستجو یا گروه دیگری را امتحان کنید.</span></div>
        )}
      </div>
    </aside>
  );
}
