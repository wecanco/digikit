'use client';

import { ChevronLeft, ShoppingCart, X } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { CartLine } from '../../types';
import { CartItemActions } from '../ReferenceCommerce';
import { ProductSpecialOffer } from '../ReferenceProduct';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { PlaceholderImage } from '../PlaceholderImage';
import { Price } from '../Price';
import { faNum } from '../../utils/format';
import styles from './styles.module.css';

export interface ReferenceCartItemProps {
  item: CartLine;
  href?: string;
  onQuantityChange?(value: number): void;
  onRemove?(): void;
  className?: string;
}

function CartMedia({ item }: { item: CartLine }) {
  if (item.product.image.startsWith('ph:')) return <PlaceholderImage seed={item.product.image.slice(3)} label={item.product.brand || item.product.title} />;
  return <img src={item.product.image} alt={item.product.title} loading="lazy" />;
}

export function ReferenceCartItem({ item, href, onQuantityChange, onRemove, className }: ReferenceCartItemProps) {
  const productHref = href || item.product.href || `/product?id=${item.product.id}`;
  return <article className={[styles.item, className].filter(Boolean).join(' ')}><a href={productHref} className={styles.media}><CartMedia item={item} /></a><div className={styles.itemBody}><div className={styles.itemHead}><a href={productHref} className={styles.itemTitle}>{item.product.title}</a>{onRemove && <IconButton label="حذف کالا" size="sm" variant="ghost" onClick={onRemove}><X size={16} aria-hidden="true" /></IconButton>}</div><div className={styles.itemMeta}>{item.selectedColor && <span><i style={{ background: item.selectedColor }} aria-hidden="true" />رنگ انتخابی</span>}{item.selectedVariant && <span>{item.selectedVariant}</span>}<span>ضمانت اصالت کالا</span></div><div className={styles.itemFoot}><ProductSpecialOffer discount={item.product.discount} inStock={item.product.stock ?? 1} /><CartItemActions value={item.qty} min={1} max={Math.max(1, Math.min(item.product.stock ?? 5, 5))} onChange={onQuantityChange} onRemove={onRemove} /><Price price={item.product.price * item.qty} oldPrice={item.product.oldPrice ? item.product.oldPrice * item.qty : null} size="sm" /></div></div></article>;
}

export interface CartPreviewProps {
  items: CartLine[];
  totalItems?: number;
  totalPrice?: number;
  totalDiscount?: number;
  href?: string;
  checkoutLabel?: string;
  emptyTitle?: string;
  onCheckout?(): void;
  onQuantityChange?(item: CartLine, value: number): void;
  onRemove?(item: CartLine): void;
  onClose?(): void;
  className?: string;
}

export function CartPreview({ items, totalItems, totalPrice, totalDiscount = 0, href = '/checkout/cart', checkoutLabel = 'ثبت سفارش', emptyTitle = 'سبد خرید شما خالی است', onCheckout, onQuantityChange, onRemove, onClose, className }: CartPreviewProps) {
  const itemCount = totalItems ?? items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = totalPrice ?? items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const payable = Math.max(0, subtotal - totalDiscount);
  return <section className={[styles.preview, className].filter(Boolean).join(' ')} aria-label="پیش‌نمایش سبد خرید"><header className={styles.previewHead}><strong>{faNum(itemCount)} کالا</strong>{onClose && <IconButton label="بستن سبد خرید" size="sm" variant="ghost" onClick={onClose}><X size={17} aria-hidden="true" /></IconButton>}{href && <a href={href}>مشاهده سبد خرید<ChevronLeft size={15} aria-hidden="true" /></a>}</header>{items.length ? <div className={styles.items}>{items.map((item) => <ReferenceCartItem key={item.product.id} item={item} onQuantityChange={onQuantityChange ? (value) => onQuantityChange(item, value) : undefined} onRemove={onRemove ? () => onRemove(item) : undefined} />)}</div> : <div className={styles.empty}><ShoppingCart size={36} aria-hidden="true" /><strong>{emptyTitle}</strong><span>کالاهای انتخاب‌شده در این بخش نمایش داده می‌شوند.</span></div>}<footer className={styles.previewFoot}><div><span>مبلغ قابل پرداخت</span><Price price={payable} size="sm" /></div>{onCheckout && <Button size="sm" endIcon={<ChevronLeft size={16} aria-hidden="true" />} onClick={onCheckout}>{checkoutLabel}</Button>}</footer></section>;
}

export interface CartDropdownProps extends Omit<CartPreviewProps, 'onClose'> {
  count?: number;
  trigger?: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?(open: boolean): void;
  className?: string;
}

export function CartDropdown({ count, trigger, defaultOpen = false, open: controlledOpen, onOpenChange, className, ...previewProps }: CartDropdownProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  });
  return <div ref={rootRef} className={[styles.dropdown, className].filter(Boolean).join(' ')}><button type="button" className={styles.trigger} aria-label="سبد خرید" aria-expanded={open} onClick={() => setOpen(!open)}>{trigger || <span className={styles.triggerIcon}><ShoppingCart size={22} aria-hidden="true" />{count != null && count > 0 && <b>{faNum(count)}</b>}</span>}</button>{open && <div className={styles.panel}><CartPreview {...previewProps} onClose={() => setOpen(false)} /></div>}</div>;
}

export interface CartDisplayProps extends CartDropdownProps {
  mobileHref?: string;
}

export function CartDisplay({ mobileHref = '/checkout/cart', ...props }: CartDisplayProps) {
  return <div className={styles.display}><a href={mobileHref} className={styles.mobileCart} aria-label="مشاهده سبد خرید"><ShoppingCart size={22} aria-hidden="true" />{props.count != null && props.count > 0 && <b>{faNum(props.count)}</b>}</a><span className={styles.desktopCart}><CartDropdown {...props} /></span></div>;
}
