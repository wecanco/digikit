import styles from './styles.module.css';

export interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  tone?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Progress({ value, max = 100, label, showValue, tone = 'primary', size = 'md', className }: ProgressProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={[styles.wrap, className].filter(Boolean).join(' ')}>
      {(label || showValue) && <div className={styles.meta}><span>{label}</span>{showValue && <span>{Math.round(percent)}٪</span>}</div>}
      <div className={[styles.track, styles[size]].join(' ')} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        <span className={[styles.fill, styles[tone]].join(' ')} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
