import { Check, Clock3, PackageCheck, Truck, XCircle } from 'lucide-react';
import styles from './styles.module.css';

export type OrderStatusValue = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderStatusProps { status: OrderStatusValue; label?: string; compact?: boolean; className?: string; }

const DATA: Record<OrderStatusValue, { label: string; icon: typeof Check }> = {
  pending: { label: 'در انتظار پرداخت', icon: Clock3 }, processing: { label: 'در حال آماده‌سازی', icon: PackageCheck }, shipped: { label: 'تحویل به پست', icon: Truck }, delivered: { label: 'تحویل شده', icon: Check }, cancelled: { label: 'لغو شده', icon: XCircle },
};

export function OrderStatus({ status, label, compact, className }: OrderStatusProps) { const item = DATA[status]; const Icon = item.icon; return <span className={[styles.status, styles[status], compact && styles.compact, className].filter(Boolean).join(' ')}><Icon size={compact ? 14 : 16} /><span>{label || item.label}</span></span>; }
