'use client';

import { Plus } from 'lucide-react';
import type { Product } from '../../types';
import { productHref } from '../../utils/links';
import { useCart } from '../../hooks/useCart';
import { Price } from '../Price';
import { Rating } from '../Rating';
import { PlaceholderImage } from '../PlaceholderImage';
import { Stepper } from '../Stepper';
import styles from './styles.module.css';

export interface ProductCardSuperProps {
  product: Product;
  className?: string;
}

/** تصویر محصول — اگر image با «ph:» شروع شود از PlaceholderImage با seed شناسه کالا ساخته می‌شود (قرارداد مشترک کیت) */
function productImage(product: Product, className: string) {
  if (product.image.startsWith('ph:')) {
    return (
      <PlaceholderImage
        seed={product.id}
        label={product.brand ?? product.title}
        ratio="1:1"
        className={className}
      />
    );
  }
  return <img src={product.image} alt={product.title} loading="lazy" className={className} />;
}

/** کارت سوپرمارکتی — پورت productCardSuper (ui.js:105-121) با آناتومی کاشی کرم:
 *  پس‌زمینه --dk-cream با radius-card و p-3، تصویر ۷۲px، عنوان ۱۲px دوخطی،
 *  امتیاز single، قیمت sm و دکمه گرد سبز افزودن (useCart — بعد از افزودن استپر) */
export function ProductCardSuper({ product, className }: ProductCardSuperProps) {
  const cart = useCart();
  const qty = cart.qtyOf(product.id);
  const href = productHref(product);

  return (
    <article className={[styles.card, className].filter(Boolean).join(' ')}>
      <a className={styles.imgBox} href={href} aria-label={product.title}>
        {productImage(product, styles.img)}
      </a>
      <div className={styles.body}>
        <a className={styles.title} href={href}>
          {product.title}
        </a>
        <Rating rating={product.rating} count={product.ratingCount} single className={styles.rating} />
        <div className={styles.foot}>
          {qty > 0 ? (
            <Stepper value={qty} min={1} max={5} onChange={(v) => cart.setQty(product.id, v)} />
          ) : (
            <button
              type="button"
              className={styles.add}
              onClick={() => cart.add(product.id)}
              aria-label="افزودن به سبد"
            >
              <Plus size={16} strokeWidth={2.4} aria-hidden />
            </button>
          )}
          <Price price={product.price} oldPrice={product.oldPrice} size="sm" />
        </div>
      </div>
    </article>
  );
}
