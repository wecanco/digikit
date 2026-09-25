import { Check } from 'lucide-react';
import styles from './styles.module.css';

export interface CheckoutStep { id: string; title: string; description?: string; }

export interface CheckoutStepsProps {
  steps: CheckoutStep[];
  current: string;
  onChange?(id: string): void;
  className?: string;
}

export function CheckoutSteps({ steps, current, onChange, className }: CheckoutStepsProps) {
  const currentIndex = Math.max(0, steps.findIndex((step) => step.id === current));
  return <nav className={[styles.steps, className].filter(Boolean).join(' ')} aria-label="مراحل خرید">{steps.map((step, index) => <div key={step.id} className={[styles.step, index < currentIndex && styles.done, index === currentIndex && styles.current].filter(Boolean).join(' ')}><button type="button" disabled={!onChange || index > currentIndex} onClick={() => onChange?.(step.id)}><span className={styles.number}>{index < currentIndex ? <Check size={15} /> : index + 1}</span><span className={styles.copy}><strong>{step.title}</strong>{step.description && <small>{step.description}</small>}</span></button>{index < steps.length - 1 && <i className={styles.line} />}</div>)}</nav>;
}
