import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './styles.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'amazing' | 'white';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  pill?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  pill,
  fullWidth,
  loading,
  loadingLabel = 'در حال پردازش',
  startIcon,
  endIcon,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const cls = [
    styles.btn,
    styles[variant],
    styles[size],
    pill && styles.pill,
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    className,
  ].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading ? <span className={styles.loader} aria-hidden="true" /> : startIcon ? <span aria-hidden="true">{startIcon}</span> : null}
      <span>{loading ? loadingLabel : children}</span>
      {!loading && endIcon ? <span aria-hidden="true">{endIcon}</span> : null}
    </button>
  );
}
