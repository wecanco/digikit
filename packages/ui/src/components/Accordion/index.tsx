'use client';

import { ChevronDown } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';
import styles from './styles.module.css';

export interface AccordionItem { id: string; title: ReactNode; content: ReactNode; disabled?: boolean; }

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: string[];
  multiple?: boolean;
  className?: string;
}

export function Accordion({ items, defaultOpen = [], multiple, className }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const baseId = useId();
  const toggle = (id: string) => setOpen((current) => current.includes(id) ? current.filter((item) => item !== id) : multiple ? [...current, id] : [id]);
  return <div className={[styles.accordion, className].filter(Boolean).join(' ')}>{items.map((item) => { const active = open.includes(item.id); const itemKey = `${baseId}-${item.id}`; return <section className={[styles.item, active && styles.active].filter(Boolean).join(' ')} key={item.id}><button id={`${itemKey}-trigger`} type="button" disabled={item.disabled} aria-expanded={active} aria-controls={`${itemKey}-panel`} className={styles.trigger} onClick={() => toggle(item.id)}><span>{item.title}</span><ChevronDown size={17} aria-hidden="true" /></button>{active && <div id={`${itemKey}-panel`} className={styles.content} role="region" aria-labelledby={`${itemKey}-trigger`}>{item.content}</div>}</section>; })}</div>;
}
