import { MessageCircle, PackageOpen, SearchX, ShoppingBag, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '../Button';
import { Card } from '../Card';
import { EmptyState } from '../EmptyState';
import { ErrorState } from '../ErrorState';
import { Spinner } from '../Spinner';
import styles from './styles.module.css';

export interface DataStateDisplayProps {
  isError: boolean;
  error?: unknown;
  refetch?(): void;
  isFetching: boolean;
  dataLength: number;
  isSuccess: boolean;
  emptyComponent?: ReactNode;
  loadingComponent?: ReactNode;
  children: ReactNode;
  className?: string;
}

function errorText(error: unknown) {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') return error.message;
  return 'دریافت اطلاعات با خطا مواجه شد.';
}

export function DataStateDisplay({ isError, error, refetch, isFetching, dataLength, isSuccess, emptyComponent = <EmptyCustomList />, loadingComponent = <FullScreenLoading />, children, className }: DataStateDisplayProps) {
  return <section className={[styles.dataState, className].filter(Boolean).join(' ')}>{isError ? <ErrorState title="خطایی رخ داده است" description={errorText(error)} onRetry={refetch} /> : isFetching ? loadingComponent : isSuccess && dataLength > 0 ? children : isSuccess ? emptyComponent : null}</section>;
}

export function InlineLoading({ label = 'در حال بارگذاری...', className }: { label?: string; className?: string }) {
  return <span className={[styles.inlineLoading, className].filter(Boolean).join(' ')} role="status"><Spinner size={18} /><span>{label}</span></span>;
}

export function FullScreenLoading({ label = 'در حال بارگذاری...', className }: { label?: string; className?: string }) {
  return <div className={[styles.fullLoading, className].filter(Boolean).join(' ')}><Card padding="lg"><InlineLoading label={label} /></Card></div>;
}

export interface ReferenceEmptyProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?(): void;
  className?: string;
}

function ReferenceEmpty({ title, description, actionLabel, onAction, icon, className }: ReferenceEmptyProps & { icon: ReactNode }) {
  return <EmptyState title={title || 'موردی برای نمایش وجود ندارد'} description={description || 'در حال حاضر داده‌ای برای نمایش در این بخش وجود ندارد.'} actionLabel={actionLabel} onAction={onAction} icon={icon} className={className} />;
}

export function EmptyComment(props: ReferenceEmptyProps) { return <ReferenceEmpty icon={<MessageCircle size={30} aria-hidden="true" />} title="هنوز دیدگاهی ثبت نشده است" description="اولین نفری باشید که تجربه‌تان را ثبت می‌کند." {...props} />; }
export function EmptyCommentsList(props: ReferenceEmptyProps) { return <ReferenceEmpty icon={<MessageCircle size={30} aria-hidden="true" />} title="دیدگاهی پیدا نشد" description="دیدگاه‌های ثبت‌شده در این بخش نمایش داده می‌شوند." {...props} />; }
export function EmptyCustomList(props: ReferenceEmptyProps) { return <ReferenceEmpty icon={<PackageOpen size={30} aria-hidden="true" />} {...props} />; }
export function EmptyOrdersList(props: ReferenceEmptyProps) { return <ReferenceEmpty icon={<ShoppingBag size={30} aria-hidden="true" />} title="سفارشی وجود ندارد" description="سفارش‌های شما پس از ثبت در اینجا نمایش داده می‌شوند." {...props} />; }
export function EmptySearchList(props: ReferenceEmptyProps) { return <ReferenceEmpty icon={<SearchX size={30} aria-hidden="true" />} title="نتیجه‌ای پیدا نشد" description="عبارت جستجو یا فیلترها را تغییر دهید." {...props} />; }
export function EmptyUsersList(props: ReferenceEmptyProps) { return <ReferenceEmpty icon={<UserRound size={30} aria-hidden="true" />} title="کاربری وجود ندارد" description="کاربران این بخش پس از ثبت نمایش داده می‌شوند." {...props} />; }

export function ErrorAction({ onRetry, label = 'تلاش دوباره' }: { onRetry(): void; label?: string }) {
  return <Button size="sm" variant="outline" onClick={onRetry}>{label}</Button>;
}
