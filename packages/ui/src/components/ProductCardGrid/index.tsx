import type { Product } from '../../types';
import { productHref } from '../../utils/links';
import { Price } from '../Price';
import { BadgeCircle } from '../BadgeCircle';
import { PlaceholderImage } from '../PlaceholderImage';
import styles from './styles.module.css';

export interface ProductCardGridProps {
  product: Product;
  /** بدون پنل سفید/شعاع/سایه — برای گریدهای با خط جداکننده (p-2 می‌ماند مثل مرجع) */
  bare?: boolean;
  /** حذف عنوان — بلوک قیمت می‌ماند (مثل hideTitle در ui.js:62-63) */
  hideTitle?: boolean;
  className?: string;
}

/** تصویر محصول — اگر image با «ph:» شروع شود از PlaceholderImage با seed شناسه کالا ساخته می‌شود */
function productImage(product: Product, className: string) {
  if (product.image.startsWith('ph:')) {
    return (
      <PlaceholderImage
        seed={product.id}
        label={product.brand || product.title}
        ratio="1:1"
        className={className}
      />
    );
  }
  return <img src={product.image} alt={product.title} loading="lazy" className={className} />;
}

/** کارت عمودی گرید محصول — پورت وفادار productCardGrid از ui.js:54-67:
    تصویر + بج تخفیف (end-1.5) + عنوان ۲خطی (فقط ≥768px مثل مرجع) + قیمت. بدون امتیاز و بدون قلب — مثل مرجع. */
export function ProductCardGrid({ product, bare = false, hideTitle = false, className }: ProductCardGridProps) {
  const href = productHref(product);

  return (
    <article className={[styles.card, bare && styles.bare, className].filter(Boolean).join(' ')}>
      <a href={href} className={styles.imgLink} aria-label={product.title}>
        {product.discount > 0 && (
          <span className={styles.badge}>
            <BadgeCircle discount={product.discount} />
          </span>
        )}
        {productImage(product, styles.img)}
      </a>
      {!hideTitle && (
        <a href={href} className={styles.title}>
          {product.title}
        </a>
      )}
      <div className={hideTitle ? styles.price : styles.pricePinned}>
        <Price price={product.price} oldPrice={product.oldPrice} size="md" />
      </div>
    </article>
  );
}
