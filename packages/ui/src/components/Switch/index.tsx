import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './styles.module.css';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  description?: ReactNode;
}

export function Switch({ label, description, className, ...rest }: SwitchProps) {
  return (
    <label className={[styles.label, className].filter(Boolean).join(' ')}>
      <span className={styles.track}><input type="checkbox" role="switch" {...rest} /><i /></span>
      {(label || description) && <span className={styles.copy}>{label && <strong>{label}</strong>}{description && <small>{description}</small>}</span>}
    </label>
  );
}
