import { BookOpen, Bolt, ChevronDown, CreditCard, Minus, Package, Plus, ShoppingCart, Tag, Trash2, Truck, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '../Button';
import { Price } from '../Price';
import { Stepper } from '../Stepper';
import { PlaceholderImage } from '../PlaceholderImage';
import type { Product, ServiceItem } from '../../types';
import { faNum } from '../../utils/format';
import styles from './styles.module.css';

export interface ReferenceCategory {
  id: string;
  name: string;
  image?: string;
  href?: string;
  color?: string;
  parent?: string;
  level?: number;
}

export interface CategoryListProps {
  items: ReferenceCategory[];
  title?: string;
  accent?: string;
  className?: string;
}

export function CategoryList({ items, title, accent, className }: CategoryListProps) {
  if (!items.length) return null;
  return (
    <section className={[styles.categoryList, className].filter(Boolean).join(' ')}>
      {title && <h2 className={styles.categoryTitle}>{title}{accent && <span style={{ color: accent }}>{accent}</span>}</h2>}
      <div className={styles.categoryItems}>
        {items.map((item) => {
          const content = <><span className={styles.categoryImage}>{item.image?.startsWith('ph:') ? <PlaceholderImage seed={item.image.slice(3)} label={item.name} ratio="1:1" /> : item.image ? <img src={item.image} alt="" loading="lazy" /> : <Package size={24} aria-hidden="true" />}</span><span>{item.name}</span></>;
          return item.href ? <a key={item.id} href={item.href} className={styles.categoryItem}>{content}</a> : <div key={item.id} className={styles.categoryItem}>{content}</div>;
        })}
      </div>
    </section>
  );
}

export interface CategorySelection {
  levelOne?: ReferenceCategory;
  levelTwo?: ReferenceCategory;
  levelThree?: ReferenceCategory;
}

export interface CategorySelectorProps {
  categories: ReferenceCategory[];
  value?: CategorySelection;
  onChange?(value: CategorySelection): void;
  disabled?: boolean;
  className?: string;
}

export function CategorySelector({ categories, value = {}, onChange, disabled, className }: CategorySelectorProps) {
  const levelOne = categories.filter((item) => item.level === 1 || (!item.parent && item.level == null));
  const childrenOf = (parent?: string) => parent ? categories.filter((item) => item.parent === parent) : [];
  const levelTwo = childrenOf(value.levelOne?.id);
  const levelThree = childrenOf(value.levelTwo?.id);
  const update = (key: keyof CategorySelection, id: string) => {
    const source = categories.find((item) => item.id === id);
    if (!source) return;
    const next = key === 'levelOne'
      ? { levelOne: source }
      : key === 'levelTwo'
        ? { levelOne: value.levelOne, levelTwo: source }
        : { levelOne: value.levelOne, levelTwo: value.levelTwo, levelThree: source };
    onChange?.(next);
  };
  const field = (label: string, selected: ReferenceCategory | undefined, options: ReferenceCategory[], key: keyof CategorySelection) => (
    <label className={styles.categorySelect}>
      <span>{label}</span>
      <span className={styles.selectWrap}>
        <select value={selected?.id || ''} disabled={disabled || !options.length} onChange={(event) => update(key, event.target.value)}>
          <option value="">انتخاب کنید</option>
          {options.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <ChevronDown size={16} aria-hidden="true" />
      </span>
    </label>
  );
  return <div className={[styles.categorySelector, className].filter(Boolean).join(' ')}>{field('دسته‌بندی اصلی', value.levelOne, levelOne, 'levelOne')}{field('زیرگروه', value.levelTwo, levelTwo, 'levelTwo')}{field('زیرگروه نهایی', value.levelThree, levelThree, 'levelThree')}</div>;
}

export interface ServiceListProps {
  items: ServiceItem[];
  className?: string;
}

export function ServiceList({ items, className }: ServiceListProps) {
  const icons: Record<string, LucideIcon> = { bolt: Bolt, book: BookOpen, credit: CreditCard, truck: Truck };
  return <div className={[styles.serviceList, className].filter(Boolean).join(' ')}>{items.map((item) => {
    const ServiceIcon = icons[item.icon];
    const content = <><span className={styles.serviceIcon} style={{ background: item.color }} aria-hidden="true">{ServiceIcon ? <ServiceIcon size={21} /> : item.icon}</span><span><strong>{item.title}</strong>{item.desc && <small>{item.desc}</small>}</span></>;
    return item.href ? <a key={`${item.title}-${item.href}`} href={item.href} className={styles.serviceItem}>{content}</a> : <div key={item.title} className={styles.serviceItem}>{content}</div>;
  })}</div>;
}

export interface CartIconBadgeProps {
  count: number;
  icon?: ReactNode;
  label?: string;
  className?: string;
}

export function CartIconBadge({ count, icon = <ShoppingCart size={24} aria-hidden="true" />, label = 'سبد خرید', className }: CartIconBadgeProps) {
  return <span className={[styles.cartIcon, className].filter(Boolean).join(' ')} role="img" aria-label={`${label}: ${faNum(count)} کالا`}><span aria-hidden="true">{icon}</span>{count > 0 && <b aria-hidden="true">{faNum(count)}</b>}</span>;
}

export interface FreeShippingIndicatorProps {
  threshold?: number;
  title?: string;
  description?: string;
  className?: string;
}

export function FreeShippingIndicator({ threshold = 500000, title = 'ارسال رایگان', description, className }: FreeShippingIndicatorProps) {
  return <aside className={[styles.freeShipping, className].filter(Boolean).join(' ')}><span className={styles.freeShippingIcon} aria-hidden="true"><Truck size={24} /></span><span><strong>{title}</strong><small>{description || `برای سفارش‌های بالای ${faNum(threshold)} تومان`}</small></span></aside>;
}

export interface CartDiscountItemProps {
  code: string;
  amount?: number;
  applied?: boolean;
  onApply?(): void;
  onRemove?(): void;
  className?: string;
}

export function CartDiscountItem({ code, amount, applied, onApply, onRemove, className }: CartDiscountItemProps) {
  return <div className={[styles.discountItem, applied && styles.discountApplied, className].filter(Boolean).join(' ')}><span className={styles.discountIcon} aria-hidden="true"><Tag size={17} /></span><span className={styles.discountCopy}><strong>{code}</strong>{amount != null && <small>{faNum(amount)} تومان تخفیف</small>}</span>{applied ? <button type="button" onClick={onRemove} disabled={!onRemove} aria-label={`حذف کد ${code}`}><Trash2 size={16} aria-hidden="true" /></button> : <button type="button" onClick={onApply} disabled={!onApply}>اعمال</button>}</div>;
}

export interface CartItemActionsProps {
  value: number;
  min?: number;
  max?: number;
  onChange?(value: number): void;
  onRemove?(): void;
  className?: string;
}

export function CartItemActions({ value, min = 1, max = 5, onChange, onRemove, className }: CartItemActionsProps) {
  return <div className={[styles.cartActions, className].filter(Boolean).join(' ')}><button type="button" onClick={() => onChange?.(Math.min(max, value + 1))} disabled={value >= max || !onChange} aria-label="افزایش تعداد"><Plus size={15} aria-hidden="true" /></button><span>{faNum(value)}</span>{value <= min && onRemove ? <button type="button" onClick={onRemove} aria-label="حذف کالا"><Trash2 size={15} aria-hidden="true" /></button> : <button type="button" onClick={() => onChange?.(Math.max(min, value - 1))} disabled={value <= min || !onChange} aria-label="کاهش تعداد"><Minus size={15} aria-hidden="true" /></button>}</div>;
}

export interface AddToCartButtonProps {
  product?: Pick<Product, 'price' | 'stock'>;
  quantity?: number;
  maxQuantity?: number;
  onQuantityChange?(value: number): void;
  onAdd?(): void;
  loading?: boolean;
  className?: string;
}

export function AddToCartButton({ product, quantity = 1, maxQuantity = product?.stock || 5, onQuantityChange, onAdd, loading, className }: AddToCartButtonProps) {
  const outOfStock = product?.stock === 0;
  return <div className={[styles.addToCart, className].filter(Boolean).join(' ')}>{product?.price != null && <Price price={product.price} size="sm" />}{onQuantityChange && <Stepper value={quantity} max={Math.max(1, maxQuantity)} onChange={onQuantityChange} disabled={outOfStock || loading} />}<Button fullWidth loading={loading} disabled={outOfStock} onClick={onAdd}>{outOfStock ? 'ناموجود' : 'افزودن به سبد'}</Button></div>;
}

export function CartOperations(props: AddToCartButtonProps) {
  return <AddToCartButton {...props} />;
}
