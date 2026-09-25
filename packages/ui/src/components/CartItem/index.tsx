import { Heart, ShieldCheck, Trash2, Truck } from 'lucide-react';
import type { CartLine } from '../../types';
import { IconButton } from '../IconButton';
import { PlaceholderImage } from '../PlaceholderImage';
import { Price } from '../Price';
import { Stepper } from '../Stepper';
import styles from './styles.module.css';

export interface CartItemProps {
  item: CartLine;
  onQuantityChange?(quantity: number): void;
  onRemove?(): void;
  onSave?(): void;
  className?: string;
}

function ProductMedia({ item }: { item: CartLine }) {
  if (item.product.image.startsWith('ph:')) return <PlaceholderImage seed={item.product.image.slice(3)} label={item.product.brand} />;
  return <img src={item.product.image} alt={item.product.title} />;
}

export function CartItem({ item, onQuantityChange, onRemove, onSave, className }: CartItemProps) {
  const { product } = item;
  const unavailable = product.stock === 0;
  const maxQuantity = Math.max(Math.min(product.stock ?? 5, 5), 1);
  return <article className={[styles.item, className].filter(Boolean).join(' ')}><div className={styles.media}><ProductMedia item={item} /></div><div className={styles.body}><div className={styles.head}><div><span className={styles.brand}>{product.brand}</span><h3>{product.title}</h3></div><div className={styles.menu}>{onSave && <IconButton label="ذخیره برای بعد" size="sm" variant="ghost" onClick={onSave}><Heart size={17} /></IconButton>}{onRemove && <IconButton label="حذف کالا" size="sm" variant="ghost" onClick={onRemove}><Trash2 size={17} /></IconButton>}</div></div><div className={styles.meta}>{item.selectedColor && <span><i style={{ background: item.selectedColor }} />رنگ انتخابی</span>}{item.selectedVariant && <span>{item.selectedVariant}</span>}<span><ShieldCheck size={15} aria-hidden="true" />ضمانت اصالت کالا</span><span><Truck size={15} aria-hidden="true" />ارسال سریع</span></div><div className={styles.foot}>{unavailable ? <strong>ناموجود</strong> : <Stepper value={item.qty} min={1} max={maxQuantity} onChange={(value) => onQuantityChange?.(value)} />}<Price price={product.price * item.qty} oldPrice={product.oldPrice ? product.oldPrice * item.qty : null} size="md" /></div></div></article>;
}
