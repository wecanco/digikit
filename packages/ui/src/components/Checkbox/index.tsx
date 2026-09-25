import { Check } from 'lucide-react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './styles.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  description?: ReactNode;
}

export function Checkbox({ label, description, className, ...rest }: CheckboxProps) {
  return (
    <label className={[styles.label, className].filter(Boolean).join(' ')}>
      <span className={styles.box}><input type="checkbox" {...rest} /><Check size={14} strokeWidth={3} aria-hidden /></span>
      {(label || description) && <span className={styles.copy}>{label && <strong>{label}</strong>}{description && <small>{description}</small>}</span>}
    </label>
  );
}
