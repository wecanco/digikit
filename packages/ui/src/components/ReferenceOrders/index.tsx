'use client';

import { Check, Clock3, MoreVertical, PackageCheck, ShoppingBag, Truck } from 'lucide-react';
import type { ReactNode } from 'react';
import { Card } from '../Card';
import { DropdownMenu } from '../DropdownMenu';
import { IconButton } from '../IconButton';
import { OrderStatus, type OrderStatusValue } from '../OrderStatus';
import { PlaceholderImage } from '../PlaceholderImage';
import { Price } from '../Price';
import { faNum } from '../../utils/format';
import styles from './styles.module.css';

export type ReferenceOrderStatus = OrderStatusValue;

export interface ReferenceOrderItem {
  id: string | number;
  title?: string;
  image?: string;
  imageLabel?: string;
  href?: string;
  quantity?: number;
}

export interface ReferenceOrder {
  id: string;
  status: ReferenceOrderStatus;
  total: number;
  date?: string;
  customer?: string;
  items: ReferenceOrderItem[];
}

export interface OrderCardProps {
  order: ReferenceOrder;
  singleOrder?: boolean;
  onStatusChange?(status: ReferenceOrderStatus): void;
  onOpen?(order: ReferenceOrder): void;
  className?: string;
}

function OrderItemMedia({ item }: { item: ReferenceOrderItem }) {
  const label = item.imageLabel || item.title || 'محصول';
  if (!item.image) return <span className={styles.itemPlaceholder} aria-label={label}>{label.slice(0, 1)}</span>;
  if (item.image.startsWith('ph:')) return <PlaceholderImage seed={item.image.slice(3)} label={label} ratio="1:1" />;
  return <img src={item.image} alt={label} loading="lazy" />;
}

function orderStatusActions(order: ReferenceOrder, onStatusChange?: OrderCardProps['onStatusChange']) {
  if (!onStatusChange) return [];
  return [
    {
      id: 'delivered',
      label: 'تغییر وضعیت به تحویل شده',
      icon: <Check size={15} aria-hidden="true" />,
      disabled: order.status === 'delivered',
      onSelect: () => onStatusChange('delivered'),
    },
    {
      id: 'processing',
      label: 'تغییر وضعیت به در حال پردازش',
      icon: <Clock3 size={15} aria-hidden="true" />,
      disabled: order.status === 'processing',
      onSelect: () => onStatusChange('processing'),
    },
  ];
}

export function OrderCard({ order, singleOrder = false, onStatusChange, onOpen, className }: OrderCardProps) {
  const actions = orderStatusActions(order, onStatusChange);
  const content = (
    <article className={[styles.orderCard, className].filter(Boolean).join(' ')}>
      <div className={styles.cardHead}>
        <div className={styles.statusLine}>
          <OrderStatus status={order.status} />
          {order.date && <time className={styles.date}>{order.date}</time>}
        </div>
        {(singleOrder || onOpen) && (
          <div className={styles.cardActions}>
            {onOpen && <IconButton label="مشاهده سفارش" size="sm" variant="ghost" onClick={() => onOpen(order)}><ShoppingBag size={17} aria-hidden="true" /></IconButton>}
            {singleOrder && actions.length > 0 && <DropdownMenu label="عملیات سفارش" trigger={<MoreVertical size={17} aria-hidden="true" />} items={actions} />}
          </div>
        )}
      </div>
      <div className={styles.orderMeta}>
        <span>کد سفارش <strong dir="ltr">{order.id}</strong></span>
        {order.customer && <span>{order.customer}</span>}
        <Price price={order.total} size="sm" />
      </div>
      {order.items.length > 0 && (
        <div className={styles.itemList} aria-label="اقلام سفارش">
          {order.items.map((item) => {
            const media = <span className={styles.itemMedia}><OrderItemMedia item={item} /></span>;
            const body = <>{media}{item.quantity != null && <small>{faNum(item.quantity)} عدد</small>}</>;
            return item.href ? <a key={item.id} href={item.href} className={styles.itemLink}>{body}</a> : <span key={item.id} className={styles.itemLink}>{body}</span>;
          })}
        </div>
      )}
    </article>
  );
  return content;
}

export interface OrdersTableProps {
  orders: ReferenceOrder[];
  onOpen?(order: ReferenceOrder): void;
  className?: string;
  empty?: ReactNode;
}

export function OrdersTable({ orders, onOpen, className, empty = 'سفارشی برای نمایش وجود ندارد' }: OrdersTableProps) {
  return (
    <div className={[styles.tableWrap, className].filter(Boolean).join(' ')}>
      <table>
        <caption className={styles.srOnly}>فهرست سفارش‌ها</caption>
        <thead><tr><th scope="col">سفارش</th><th scope="col">مشتری</th><th scope="col">وضعیت</th><th scope="col">مبلغ</th><th scope="col">تاریخ</th><th scope="col"><span className={styles.srOnly}>عملیات</span></th></tr></thead>
        <tbody>
          {orders.length ? orders.map((order) => (
            <tr key={order.id}>
              <td>{onOpen ? <button type="button" className={styles.orderCell} onClick={() => onOpen(order)}><span className={styles.tableThumb}>{order.items[0] ? <OrderItemMedia item={order.items[0]} /> : <PackageCheck size={18} aria-hidden="true" />}</span><strong dir="ltr">{order.id}</strong></button> : <span className={styles.orderCell}><span className={styles.tableThumb}>{order.items[0] ? <OrderItemMedia item={order.items[0]} /> : <PackageCheck size={18} aria-hidden="true" />}</span><strong dir="ltr">{order.id}</strong></span>}</td>
              <td>{order.customer || '—'}</td>
              <td><OrderStatus status={order.status} compact /></td>
              <td><Price price={order.total} size="sm" /></td>
              <td>{order.date || '—'}</td>
              <td>{onOpen && <IconButton label={`مشاهده سفارش ${order.id}`} size="sm" variant="ghost" onClick={() => onOpen(order)}><ShoppingBag size={16} aria-hidden="true" /></IconButton>}</td>
            </tr>
          )) : <tr><td colSpan={6} className={styles.empty}>{empty}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export interface OrdersSummaryProps {
  pending: number;
  delivered: number;
  total?: number;
  className?: string;
}

export function OrdersSummary({ pending, delivered, total = pending + delivered, className }: OrdersSummaryProps) {
  const items = [
    { label: 'همه سفارش‌ها', value: total, icon: <ShoppingBag size={18} aria-hidden="true" /> },
    { label: 'در حال پردازش', value: pending, icon: <PackageCheck size={18} aria-hidden="true" /> },
    { label: 'تحویل شده', value: delivered, icon: <Truck size={18} aria-hidden="true" /> },
  ];
  return <Card className={[styles.summary, className].filter(Boolean).join(' ')}>{items.map((item) => <div className={styles.summaryItem} key={item.label}><span>{item.icon}</span><strong>{faNum(item.value)}</strong><small>{item.label}</small></div>)}</Card>;
}
