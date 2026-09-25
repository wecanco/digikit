import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import styles from './styles.module.css';

export interface HeroBannerProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  href?: string;
  onAction?(): void;
  image?: ReactNode;
  tone?: 'primary' | 'dark' | 'success' | 'cream';
  className?: string;
}

export function HeroBanner({ eyebrow, title, description, actionLabel, href, onAction, image, tone = 'primary', className }: HeroBannerProps) {
  const action = actionLabel
    ? href
      ? <span className={styles.cta}>{actionLabel}<ArrowLeft size={15} aria-hidden="true" /></span>
      : onAction
        ? <button type="button" className={styles.cta} onClick={onAction}>{actionLabel}<ArrowLeft size={15} aria-hidden="true" /></button>
        : null
    : null;
  const copy = <><div className={styles.copy}>{eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}<h2>{title}</h2>{description && <p>{description}</p>}{action}</div>{image && <div className={styles.visual}>{image}</div>}</>;
  const cls = [styles.banner, styles[tone], className].filter(Boolean).join(' ');
  return href ? <a href={href} className={cls}>{copy}</a> : <section className={cls}>{copy}</section>;
}
