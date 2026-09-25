import { CheckCircle2 } from 'lucide-react';
import type { ReactNode } from 'react';
import styles from './styles.module.css';

export interface ProductSpec { label: string; value: ReactNode; featured?: boolean; }

export interface ProductSpecsProps { title?: string; specs: ProductSpec[]; className?: string; }

export function ProductSpecs({ title = 'مشخصات محصول', specs, className }: ProductSpecsProps) { return <section className={[styles.section, className].filter(Boolean).join(' ')}><h2>{title}</h2><dl>{specs.map((spec) => <div className={spec.featured ? styles.featured : undefined} key={spec.label}><dt>{spec.label}</dt><dd>{spec.featured && <CheckCircle2 size={15} />}{spec.value}</dd></div>)}</dl></section>; }
