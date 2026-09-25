'use client';

import { ShoppingCart, Truck } from 'lucide-react';
import type { Product } from '../../types';
import { productHref } from '../../utils/links';
import { useCart } from '../../hooks/useCart';
import { Price } from '../Price';
import { Button } from '../Button';
import { Rating } from '../Rating';
import { BadgeCircle } from '../BadgeCircle';
import { PlaceholderImage } from '../PlaceholderImage';
import { Stepper } from '../Stepper';
import styles from './styles.module.css';

export interface ProductCardRowProps {
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

/** ردیف لیست PLP (d20/m23) — پورت productCardRow (ui.js:124-146) به آناتومی
 *  بدون قاب: تصویر ۱۱۸px، عنوان ۱۴px/۱٫۶، امتیاز single، چیپ «ارسال امروز»
 *  (وقتی تخفیف دارد) + گارانتی، قیمت md در انتهای ردیف و «افزودن به سبد»
 *  متصل به useCart — بعد از افزودن، استپر با qtyOf نمایش داده می‌شود */
export function ProductCardRow({ product, className }: ProductCardRowProps) {
  const cart = useCart();
  const qty = cart.qtyOf(product.id);
  const href = productHref(product);

  return (
    <article className={[styles.row, className].filter(Boolean).join(' ')}>
      <a className={styles.thumb} href={href} aria-label={product.title}>
        {productImage(product, styles.thumbImg)}
        {product.discount > 0 && (
          <span className={styles.badge}>
            <BadgeCircle discount={product.discount} size="sm" />
          </span>
        )}
      </a>
      <div className={styles.body}>
        <a className={styles.title} href={href}>
          {product.title}
        </a>
        <Rating rating={product.rating} count={product.ratingCount} single />
        <div className={styles.meta}>
          {product.discount > 0 && (
            <span className={styles.chipExpress}>
              <Truck size={12} aria-hidden />
              ارسال امروز
            </span>
          )}
          {product.warranty && <span className={styles.chipWarranty}>{product.warranty}</span>}
        </div>
        <div className={styles.foot}>
          {qty > 0 ? (
            <Stepper value={qty} min={1} max={5} onChange={(v) => cart.setQty(product.id, v)} />
          ) : (
            <Button variant="primary" pill className={styles.addBtn} onClick={() => cart.add(product.id)}>
              <ShoppingCart size={14} aria-hidden />
              افزودن به سبد
            </Button>
          )}
          <Price price={product.price} oldPrice={product.oldPrice} size="md" />
        </div>
      </div>
    </article>
  );
}
