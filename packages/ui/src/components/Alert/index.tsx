import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { IconButton } from '../IconButton';
import styles from './styles.module.css';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  tone?: AlertTone;
  title?: string;
  children?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  onClose?(): void;
  className?: string;
}

export function Alert({ tone = 'info', title, children, icon, action, onClose, className }: AlertProps) {
  return (
    <div className={[styles.alert, styles[tone], className].filter(Boolean).join(' ')} role={tone === 'danger' ? 'alert' : 'status'}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <div className={styles.body}>
        {title && <strong>{title}</strong>}
        {children && <div>{children}</div>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
      {onClose && <IconButton label="بستن پیام" size="sm" variant="ghost" onClick={onClose}><X size={16} /></IconButton>}
    </div>
  );
}
