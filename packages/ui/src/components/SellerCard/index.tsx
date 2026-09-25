import { BadgeCheck, MapPin, Star, Store } from 'lucide-react';
import type { Seller } from '../../types';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Card } from '../Card';
import styles from './styles.module.css';

export interface SellerCardProps {
  seller: Seller;
  onVisit?(): void;
  className?: string;
}

export function SellerCard({ seller, onVisit, className }: SellerCardProps) {
  return <Card variant="outlined" padding="md" className={[styles.card, className].filter(Boolean).join(' ')}><div className={styles.top}><Avatar name={seller.name} size="lg" /><div><h3>{seller.name}{seller.verified && <BadgeCheck size={16} className={styles.verified} />}</h3>{seller.location && <span className={styles.meta}><MapPin size={14} />{seller.location}</span>}</div></div><div className={styles.stats}><span><Star size={15} fill="currentColor" />{seller.rating?.toLocaleString('fa-IR') || '—'}<small>{seller.ratingCount?.toLocaleString('fa-IR')} امتیاز</small></span>{seller.positiveRate != null && <span><strong>{seller.positiveRate.toLocaleString('fa-IR')}٪</strong><small>رضایت خریداران</small></span>}</div><div className={styles.actions}><span><Store size={15} />فروشنده رسمی دیجی‌کیت</span>{onVisit && <Button variant="outline" size="sm" onClick={onVisit}>مشاهده فروشگاه</Button>}</div></Card>;
}
