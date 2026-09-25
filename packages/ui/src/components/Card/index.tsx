import type { HTMLAttributes, ReactNode } from 'react';
import styles from './styles.module.css';

export type CardVariant = 'elevated' | 'outlined' | 'flat' | 'ghost';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  interactive?: boolean;
  children?: ReactNode;
}

export function Card({ variant = 'elevated', padding = 'md', interactive, className, children, ...rest }: CardProps) {
  const cls = [styles.card, styles[variant], styles[`padding-${padding}`], interactive && styles.interactive, className]
    .filter(Boolean)
    .join(' ');
  return <div className={cls} {...rest}>{children}</div>;
}
