import { Clock3, Truck, Zap } from 'lucide-react';
import type { ReactNode } from 'react';
import styles from './styles.module.css';

export interface ShippingOption { id: string; title: string; description?: string; price: number; icon?: ReactNode; disabled?: boolean; }

export interface ShippingMethodProps { name: string; value?: string; options: ShippingOption[]; onChange?(value: string): void; className?: string; }

const icons = [Truck, Zap, Clock3];

export function ShippingMethod({ name, value, options, onChange, className }: ShippingMethodProps) { return <div className={[styles.list, className].filter(Boolean).join(' ')}>{options.map((option, index) => { const Icon = icons[index % icons.length]; return <label className={[styles.option, value === option.id && styles.selected, option.disabled && styles.disabled].filter(Boolean).join(' ')} key={option.id}><input type="radio" name={name} value={option.id} checked={value === option.id} disabled={option.disabled} onChange={() => onChange?.(option.id)} /><span className={styles.radio} /><span className={styles.icon}>{option.icon || <Icon size={20} />}</span><span className={styles.copy}><strong>{option.title}</strong>{option.description && <small>{option.description}</small>}</span><span className={styles.price}>{option.price ? `${option.price.toLocaleString('fa-IR')} تومان` : 'رایگان'}</span></label>; })}</div>; }
