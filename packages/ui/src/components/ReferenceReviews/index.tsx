'use client';

import { Check, Clock3, MessageCircle, Minus, MoreVertical, Plus, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '../Button';
import { DropdownMenu } from '../DropdownMenu';
import { EmptyState } from '../EmptyState';
import { IconButton } from '../IconButton';
import { PlaceholderImage } from '../PlaceholderImage';
import { Rating } from '../Rating';
import { faNum } from '../../utils/format';
import styles from './styles.module.css';

export type ReferenceReviewStatus = 'pending' | 'approved' | 'rejected';

export interface ReferenceReviewPoint {
  id: string | number;
  title: string;
}

export interface ReferenceReviewProduct {
  title: string;
  image?: string;
  imageLabel?: string;
  href?: string;
}

export interface ReferenceReview {
  id: string;
  title: string;
  rating: number;
  comment: string;
  status: ReferenceReviewStatus;
  date?: string;
  userName?: string;
  product?: ReferenceReviewProduct;
  positivePoints?: ReferenceReviewPoint[];
  negativePoints?: ReferenceReviewPoint[];
}

const STATUS_DATA: Record<ReferenceReviewStatus, { label: string; icon: typeof Clock3 }> = {
  pending: { label: 'در انتظار تایید', icon: Clock3 },
  approved: { label: 'تایید شده', icon: Check },
  rejected: { label: 'رد شده', icon: XCircle },
};

export interface ReviewStatusBadgeProps {
  status: ReferenceReviewStatus;
  className?: string;
}

export function ReviewStatusBadge({ status, className }: ReviewStatusBadgeProps) {
  const item = STATUS_DATA[status];
  const Icon = item.icon;
  return <span className={[styles.status, styles[status], className].filter(Boolean).join(' ')}><Icon size={14} aria-hidden="true" />{item.label}</span>;
}

function ReviewProductMedia({ product }: { product: ReferenceReviewProduct }) {
  const label = product.imageLabel || product.title;
  if (!product.image) return <span className={styles.productPlaceholder} aria-label={label}>{label.slice(0, 1)}</span>;
  if (product.image.startsWith('ph:')) return <PlaceholderImage seed={product.image.slice(3)} label={label} ratio="1:1" />;
  return <img src={product.image} alt={label} loading="lazy" />;
}

function PointList({ points, tone }: { points: ReferenceReviewPoint[]; tone: 'positive' | 'negative' }) {
  if (!points.length) return null;
  const Icon = tone === 'positive' ? Plus : Minus;
  return <ul className={[styles.points, styles[tone]].join(' ')}>{points.map((point) => <li key={point.id}><Icon size={15} aria-hidden="true" /><span>{point.title}</span></li>)}</ul>;
}

function statusActions(review: ReferenceReview, onStatusChange?: ReviewCardProps['onStatusChange']) {
  if (!onStatusChange) return [];
  return [
    { id: 'approved', label: 'تایید دیدگاه', icon: <Check size={15} aria-hidden="true" />, disabled: review.status === 'approved', onSelect: () => onStatusChange('approved') },
    { id: 'rejected', label: 'رد دیدگاه', icon: <XCircle size={15} aria-hidden="true" />, danger: true, disabled: review.status === 'rejected', onSelect: () => onStatusChange('rejected') },
    { id: 'pending', label: 'بازگرداندن به انتظار تایید', icon: <Clock3 size={15} aria-hidden="true" />, disabled: review.status === 'pending', onSelect: () => onStatusChange('pending') },
  ];
}

export interface ReviewCardProps {
  review: ReferenceReview;
  showProduct?: boolean;
  onStatusChange?(status: ReferenceReviewStatus): void;
  onOpen?(review: ReferenceReview): void;
  className?: string;
}

export function ReviewCard({ review, showProduct = true, onStatusChange, onOpen, className }: ReviewCardProps) {
  const actions = statusActions(review, onStatusChange);
  return <article className={[styles.reviewCard, className].filter(Boolean).join(' ')}>
    {showProduct && review.product && <div className={styles.productColumn}>{review.product.href ? <a href={review.product.href} className={styles.productMedia}><ReviewProductMedia product={review.product} /></a> : <span className={styles.productMedia}><ReviewProductMedia product={review.product} /></span>}<span className={styles.ratingBadge}>{faNum(review.rating)}</span></div>}
    <div className={styles.reviewBody}>
      <header className={styles.reviewHeader}>
        <div className={styles.reviewHeaderCopy}><div className={styles.statusRow}><ReviewStatusBadge status={review.status} /><Rating rating={review.rating} single /></div><h3>{review.title}</h3><div className={styles.reviewMeta}>{review.date && <time>{review.date}</time>}{review.userName && <><span aria-hidden="true">•</span><span>{review.userName}</span></>}</div></div>
        {(onOpen || actions.length > 0) && <div className={styles.reviewActions}>{onOpen && <IconButton label="مشاهده دیدگاه" size="sm" variant="ghost" onClick={() => onOpen(review)}><MessageCircle size={17} aria-hidden="true" /></IconButton>}{actions.length > 0 && <DropdownMenu label="عملیات دیدگاه" trigger={<MoreVertical size={17} aria-hidden="true" />} items={actions} />}</div>}
      </header>
      <p className={styles.comment}>{review.comment}</p>
      <PointList points={review.positivePoints || []} tone="positive" />
      <PointList points={review.negativePoints || []} tone="negative" />
    </div>
  </article>;
}

export interface ReviewProductCardProps {
  review: ReferenceReview;
  className?: string;
}

export function ReviewProductCard({ review, className }: ReviewProductCardProps) {
  return <ReviewCard review={review} showProduct={false} className={className} />;
}

export interface ReviewsListProps {
  reviews: ReferenceReview[];
  title?: string;
  count?: number;
  loading?: boolean;
  onWrite?(): void;
  onStatusChange?(review: ReferenceReview, status: ReferenceReviewStatus): void;
  empty?: ReactNode;
  className?: string;
}

export function ReviewsList({ reviews, title = 'دیدگاه‌ها', count, loading, onWrite, onStatusChange, empty = <EmptyState icon={<MessageCircle size={28} aria-hidden="true" />} title="هنوز دیدگاهی ثبت نشده است" description="اولین نفری باشید که تجربه‌تان را ثبت می‌کند." />, className }: ReviewsListProps) {
  return <section className={[styles.list, className].filter(Boolean).join(' ')}><div className={styles.listHead}><div><h2>{title}</h2>{count != null && <span>{faNum(count)} دیدگاه</span>}</div>{onWrite && <Button size="sm" variant="outline" startIcon={<MessageCircle size={15} aria-hidden="true" />} onClick={onWrite}>ثبت دیدگاه</Button>}</div>{loading ? <div className={styles.loading} role="status">در حال بارگذاری دیدگاه‌ها...</div> : reviews.length ? <div className={styles.listItems}>{reviews.map((review) => <ReviewCard key={review.id} review={review} showProduct={false} onStatusChange={onStatusChange ? (status) => onStatusChange(review, status) : undefined} />)}</div> : empty}</section>;
}

export interface ReviewsTableProps {
  reviews: ReferenceReview[];
  onOpen?(review: ReferenceReview): void;
  onStatusChange?(review: ReferenceReview, status: ReferenceReviewStatus): void;
  className?: string;
  empty?: ReactNode;
}

export function ReviewsTable({ reviews, onOpen, onStatusChange, className, empty = 'دیدگاهی برای نمایش وجود ندارد' }: ReviewsTableProps) {
  return <div className={[styles.tableWrap, className].filter(Boolean).join(' ')}><table><caption className={styles.srOnly}>فهرست دیدگاه‌ها</caption><thead><tr><th scope="col">محصول</th><th scope="col">شناسه</th><th scope="col">کاربر</th><th scope="col">وضعیت</th><th scope="col"><span className={styles.srOnly}>عملیات</span></th></tr></thead><tbody>{reviews.length ? reviews.map((review) => <tr key={review.id}><td>{review.product ? <span className={styles.productCell}><span className={styles.tableThumb}><ReviewProductMedia product={review.product} /></span><span>{review.product.title}</span></span> : '—'}</td><td dir="ltr">{review.id}</td><td>{review.userName || '—'}</td><td><ReviewStatusBadge status={review.status} /></td><td><div className={styles.tableActions}>{onOpen && <IconButton label={`مشاهده دیدگاه ${review.id}`} size="sm" variant="ghost" onClick={() => onOpen(review)}><MessageCircle size={16} aria-hidden="true" /></IconButton>}{onStatusChange && <DropdownMenu label={`تغییر وضعیت دیدگاه ${review.id}`} trigger={<MoreVertical size={16} aria-hidden="true" />} items={statusActions(review, (status) => onStatusChange(review, status))} />}</div></td></tr>) : <tr><td colSpan={5} className={styles.empty}>{empty}</td></tr>}</tbody></table></div>;
}
