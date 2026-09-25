import { MapPin, Phone, UserRound } from 'lucide-react';
import { Skeleton } from '../Skeleton';
import styles from './styles.module.css';

export interface ReferenceSkeletonProps {
  count?: number;
  className?: string;
}

const repeat = (count: number, render: (index: number) => React.ReactNode) => Array.from({ length: count }, (_, index) => render(index));

export function AddressSkeleton({ className }: ReferenceSkeletonProps) {
  const rows = [UserRound, MapPin, Phone, UserRound];
  return <section className={[styles.address, className].filter(Boolean).join(' ')} aria-label="در حال بارگذاری آدرس" aria-busy="true"><Skeleton variant="text" width="55%" />{rows.map((Icon, index) => <div className={styles.addressRow} key={`${index}-${Icon.displayName || 'icon'}`}><Icon size={16} aria-hidden="true" /><Skeleton variant="text" width={index === 0 ? '40%' : '48%'} /></div>)}</section>;
}

export function NavbarSkeleton({ className }: ReferenceSkeletonProps) {
  return <nav className={[styles.navbar, className].filter(Boolean).join(' ')} aria-label="در حال بارگذاری ناوبری" aria-busy="true"><Skeleton variant="circle" width={32} height={32} /><Skeleton variant="text" width="28%" /><Skeleton variant="text" width="16%" /></nav>;
}

export function OrderSkeleton({ count = 5, className }: ReferenceSkeletonProps) {
  return <div className={[styles.stack, className].filter(Boolean).join(' ')} aria-label="در حال بارگذاری سفارش‌ها" aria-busy="true">{repeat(count, (index) => <article className={styles.order} key={index}><div className={styles.orderHead}><Skeleton variant="text" width="34%" /><Skeleton variant="text" width="18%" /></div><Skeleton variant="text" width="22%" /><div className={styles.orderImages}>{repeat(4, (imageIndex) => <Skeleton key={imageIndex} variant="rect" width={64} height={64} />)}</div></article>)}</div>;
}

export function ProductSkeleton({ count = 8, className }: ReferenceSkeletonProps) {
  return <div className={[styles.productGrid, className].filter(Boolean).join(' ')} aria-label="در حال بارگذاری محصولات" aria-busy="true">{repeat(count, (index) => <article className={styles.product} key={index}><Skeleton variant="card" /><Skeleton variant="text" width="84%" /><Skeleton variant="text" width="54%" /><div className={styles.productFoot}><Skeleton variant="text" width="28%" /><Skeleton variant="text" width="34%" /></div></article>)}</div>;
}

export function ReviewSkeleton({ count = 5, className }: ReferenceSkeletonProps) {
  return <div className={[styles.stack, className].filter(Boolean).join(' ')} aria-label="در حال بارگذاری دیدگاه‌ها" aria-busy="true">{repeat(count, (index) => <article className={styles.review} key={index}><div className={styles.reviewHead}><Skeleton variant="circle" width={32} height={32} /><div className={styles.reviewHeadCopy}><Skeleton variant="text" width="38%" /><Skeleton variant="text" width="24%" /></div></div><Skeleton variant="text" width="92%" /><Skeleton variant="text" width="76%" /><Skeleton variant="text" width="32%" /></article>)}</div>;
}

export function SidebarSkeleton({ count = 4, className }: ReferenceSkeletonProps) {
  return <aside className={[styles.sidebar, className].filter(Boolean).join(' ')} aria-label="در حال بارگذاری فیلترها" aria-busy="true">{repeat(count, (index) => <div className={styles.sidebarRow} key={index}><Skeleton variant="text" width="52%" /><Skeleton variant="circle" width={22} height={22} /></div>)}</aside>;
}

export function SubCategoriesSkeleton({ count = 5, className }: ReferenceSkeletonProps) {
  return <section className={[styles.subCategories, className].filter(Boolean).join(' ')} aria-label="در حال بارگذاری دسته‌بندی‌ها" aria-busy="true"><Skeleton variant="text" width={100} /> <div className={styles.subCategoryTrack}>{repeat(count, (index) => <div className={styles.subCategory} key={index}><Skeleton variant="rect" width={96} height={96} /><Skeleton variant="text" width="72%" /></div>)}</div></section>;
}

export function TableSkeleton({ count = 5, className }: ReferenceSkeletonProps) {
  return <div className={[styles.table, className].filter(Boolean).join(' ')} aria-label="در حال بارگذاری جدول" aria-busy="true">{repeat(count, (index) => <Skeleton key={index} variant="rect" height={52} />)}</div>;
}
