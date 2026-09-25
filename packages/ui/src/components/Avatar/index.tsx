import type { HTMLAttributes, ReactNode } from 'react';
import styles from './styles.module.css';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy';
  children?: ReactNode;
}

function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('') || 'ن';
}

export function Avatar({ src, alt, name, size = 'md', status, className, children, ...rest }: AvatarProps) {
  return (
    <span className={[styles.avatar, styles[size], className].filter(Boolean).join(' ')} {...rest}>
      {src ? <img src={src} alt={alt || name || ''} /> : children || initials(name)}
      {status && <i className={[styles.status, styles[status]].join(' ')} aria-label={status} />}
    </span>
  );
}
