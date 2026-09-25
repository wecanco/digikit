'use client';

import { Check, Heart, ShieldCheck, ShoppingCart, Truck } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '../../types';
import { Button } from '../Button';
import { Chip } from '../Chip';
import { IconButton } from '../IconButton';
import { Price } from '../Price';
import { Rating } from '../Rating';
import { Stepper } from '../Stepper';
import styles from './styles.module.css';

export interface ProductInfoProps {
  product: Product;
  colors?: string[];
  sizes?: string[];
  onAddToCart?(quantity: number, color?: string, size?: string): void;
  onFavorite?(): void;
  favorite?: boolean;
  className?: string;
}

export function ProductInfo({ product, colors = [], sizes = [], onAddToCart, onFavorite, favorite, className }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState(colors[0]);
  const [size, setSize] = useState(sizes[0]);
  const maxQuantity = Math.max(Math.min(product.stock ?? 5, 5), 1);
  const unavailable = product.stock === 0;
  return <article className={[styles.info, className].filter(Boolean).join(' ')}><div className={styles.top}><div><span className={styles.brand}>{product.brand || 'برند محصول'}</span><h1>{product.title}</h1></div>{onFavorite && <IconButton label={favorite ? 'حذف از علاقه‌مندی' : 'افزودن به علاقه‌مندی'} variant={favorite ? 'danger' : 'neutral'} onClick={onFavorite}><Heart size={19} fill={favorite ? 'currentColor' : 'none'} /></IconButton>}</div><Rating rating={product.rating} count={product.ratingCount} /><div className={styles.divider} /><div className={styles.features}><span><ShieldCheck size={17} aria-hidden="true" /> ضمانت اصالت کالا</span><span><Truck size={17} aria-hidden="true" /> ارسال سریع دیجی‌کیت</span><span><Check size={17} aria-hidden="true" /> امکان بازگشت تا ۷ روز</span></div>{colors.length > 0 && <div className={styles.option}><strong>رنگ: {color}</strong><div className={styles.choices}>{colors.map((item) => <button type="button" key={item} className={color === item ? styles.choiceActive : styles.choice} aria-pressed={color === item} onClick={() => setColor(item)}>{item}</button>)}</div></div>}{sizes.length > 0 && <div className={styles.option}><strong>سایز: {size}</strong><div className={styles.choices}>{sizes.map((item) => <button type="button" key={item} className={size === item ? styles.choiceActive : styles.choice} aria-pressed={size === item} onClick={() => setSize(item)}>{item}</button>)}</div></div>}<div className={styles.buy}><div><Price price={product.price} oldPrice={product.oldPrice} size="lg" />{product.discount > 0 && <Chip tone="success">٪{product.discount} تخفیف</Chip>}</div><div className={styles.actions}><Stepper value={quantity} max={maxQuantity} disabled={unavailable || !onAddToCart} onChange={setQuantity} /><Button size="lg" disabled={unavailable || !onAddToCart} onClick={() => onAddToCart?.(quantity, color, size)} startIcon={<ShoppingCart size={18} />}>{unavailable ? 'ناموجود' : onAddToCart ? 'افزودن به سبد' : 'در انتظار اتصال به سبد'}</Button></div></div></article>;
}
