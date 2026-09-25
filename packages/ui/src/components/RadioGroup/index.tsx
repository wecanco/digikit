import type { ReactNode } from 'react';
import styles from './styles.module.css';

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  value?: string;
  options: RadioOption[];
  onChange?(value: string): void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function RadioGroup({ name, value, options, onChange, orientation = 'vertical', className }: RadioGroupProps) {
  return (
    <div role="radiogroup" className={[styles.group, styles[orientation], className].filter(Boolean).join(' ')}>
      {options.map((option) => (
        <label key={option.value} className={[styles.option, option.disabled && styles.disabled].filter(Boolean).join(' ')}>
          <span className={styles.radio}><input type="radio" name={name} value={option.value} checked={value === option.value} disabled={option.disabled} onChange={() => onChange?.(option.value)} /><i /></span>
          <span className={styles.copy}><strong>{option.label}</strong>{option.description && <small>{option.description}</small>}</span>
        </label>
      ))}
    </div>
  );
}
