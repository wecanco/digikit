import { ChevronDown } from 'lucide-react';
import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import styles from './styles.module.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  placeholder?: string;
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ options, placeholder, invalid, children, className, ...rest }, ref) {
  return (
    <span className={styles.wrap}>
      <select ref={ref} className={[styles.select, invalid && styles.invalid, className].filter(Boolean).join(' ')} aria-invalid={invalid || undefined} {...rest}>
        {placeholder && <option value="">{placeholder}</option>}
        {children || options?.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
      </select>
      <ChevronDown size={16} aria-hidden className={styles.icon} />
    </span>
  );
});
