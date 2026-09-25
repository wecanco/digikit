import type { ReactNode } from 'react';
import styles from './styles.module.css';

export interface DividerProps {
  children?: ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Divider({ children, orientation = 'horizontal', className }: DividerProps) {
  return <div role="separator" aria-orientation={orientation} className={[styles.divider, styles[orientation], children && styles.withLabel, className].filter(Boolean).join(' ')}>{children && <span>{children}</span>}</div>;
}
