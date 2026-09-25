'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import styles from './styles.module.css';

export interface DropdownItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onSelect?(): void;
}

export interface DropdownMenuProps {
  trigger: ReactNode;
  label?: string;
  items: DropdownItem[];
  align?: 'start' | 'end';
  className?: string;
}

export function DropdownMenu({ trigger, label = 'باز کردن منو', items, align = 'end', className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelId = useId();
  useEffect(() => {
    const close = (event: MouseEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  const focusItem = (index: number) => {
    const enabled = items.map((item, itemIndex) => (!item.disabled ? itemIndex : -1)).filter((itemIndex) => itemIndex >= 0);
    if (!enabled.length) return;
    const target = enabled[(enabled.indexOf(index) + enabled.length) % enabled.length];
    itemRefs.current[target]?.focus();
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(0));
    } else if (event.key === 'Escape' && open) {
      event.preventDefault();
      setOpen(false);
    }
  };

  const onItemKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusItem(index + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusItem(index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusItem(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusItem(items.length - 1);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className={[styles.menu, className].filter(Boolean).join(' ')}>
      <button type="button" className={styles.trigger} aria-label={label} aria-haspopup="menu" aria-expanded={open} aria-controls={open ? panelId : undefined} onClick={() => setOpen((current) => !current)} onKeyDown={onTriggerKeyDown}>{trigger}</button>
      {open && <div id={panelId} className={[styles.panel, styles[align]].join(' ')} role="menu">
        {items.map((item, index) => <button key={item.id} ref={(element) => { itemRefs.current[index] = element; }} type="button" role="menuitem" disabled={item.disabled} className={[styles.item, item.danger && styles.danger].filter(Boolean).join(' ')} onKeyDown={(event) => onItemKeyDown(event, index)} onClick={() => { item.onSelect?.(); setOpen(false); }}>{item.icon && <span aria-hidden="true">{item.icon}</span>}<span>{item.label}</span></button>)}
      </div>}
    </div>
  );
}
