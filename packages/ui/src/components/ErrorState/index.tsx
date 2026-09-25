import { CircleAlert, RefreshCw } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '../Button';
import styles from './styles.module.css';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onRetry?(): void;
  icon?: ReactNode;
  className?: string;
}

export function ErrorState({ title = 'مشکلی پیش آمد', description = 'لطفاً دوباره تلاش کنید.', actionLabel = 'تلاش دوباره', onRetry, icon, className }: ErrorStateProps) {
  return <div className={[styles.error, className].filter(Boolean).join(' ')}>{icon || <CircleAlert size={34} aria-hidden="true" /> }<h3>{title}</h3><p>{description}</p>{onRetry && <Button size="sm" variant="outline" onClick={onRetry} startIcon={<RefreshCw size={15} aria-hidden="true" />}>{actionLabel}</Button>}</div>;
}
