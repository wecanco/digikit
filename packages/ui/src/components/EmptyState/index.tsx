import { PackageOpen } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '../Button';
import styles from './styles.module.css';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  actionLabel?: string;
  onAction?(): void;
  className?: string;
}

export function EmptyState({ title, description, icon, action, actionLabel, onAction, className }: EmptyStateProps) {
  return <div className={[styles.empty, className].filter(Boolean).join(' ')}>{icon || <span className={styles.icon}><PackageOpen size={28} aria-hidden="true" /></span>}<h3>{title}</h3>{description && <p>{description}</p>}{action || (actionLabel && <Button size="sm" onClick={onAction}>{actionLabel}</Button>)}</div>;
}
