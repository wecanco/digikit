import type { ReactNode } from 'react';
import styles from './styles.module.css';

export interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'start' | 'end';
  className?: string;
}

export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  return <span className={[styles.wrap, styles[side], className].filter(Boolean).join(' ')}><span className={styles.content} role="tooltip">{content}</span>{children}</span>;
}
