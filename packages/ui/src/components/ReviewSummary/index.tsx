import { MessageCircle, Star } from 'lucide-react';
import { Button } from '../Button';
import { Progress } from '../Progress';
import styles from './styles.module.css';

export interface ReviewSummaryProps { rating: number; count: number; distribution?: Partial<Record<1 | 2 | 3 | 4 | 5, number>>; onWrite?(): void; className?: string; }

export function ReviewSummary({ rating, count, distribution = {}, onWrite, className }: ReviewSummaryProps) { return <section className={[styles.summary, className].filter(Boolean).join(' ')}><div className={styles.score}><strong>{rating.toLocaleString('fa-IR', { maximumFractionDigits: 1 })}</strong><span><Star size={20} fill="currentColor" /> از ۵</span><small>{count.toLocaleString('fa-IR')} دیدگاه</small></div><div className={styles.distribution}>{([5, 4, 3, 2, 1] as const).map((item) => <div className={styles.row} key={item}><span>{item} ستاره</span><Progress value={distribution[item] || 0} max={count || 1} size="sm" tone={item > 3 ? 'success' : item === 3 ? 'warning' : 'danger'} /><small>{(distribution[item] || 0).toLocaleString('fa-IR')}</small></div>)}</div>{onWrite && <Button variant="outline" startIcon={<MessageCircle size={16} />} onClick={onWrite}>ثبت دیدگاه</Button>}</section>; }
