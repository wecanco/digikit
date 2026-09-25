import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './styles.module.css';

export type IconButtonVariant = 'neutral' | 'primary' | 'ghost' | 'danger';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: IconButtonVariant;
  children?: ReactNode;
}

export function IconButton({ label, size = 'md', variant = 'neutral', className, children, ...rest }: IconButtonProps) {
  return (
    <button type="button" aria-label={label} className={[styles.button, styles[size], styles[variant], className].filter(Boolean).join(' ')} {...rest}>
      <span aria-hidden="true">{children}</span>
    </button>
  );
}
