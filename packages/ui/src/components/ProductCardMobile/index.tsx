import type { Product } from '../../types';
import { productHref } from '../../utils/links';
import { Price } from '../Price';
import { BadgeCircle } from '../BadgeCircle';
import { PlaceholderImage } from '../PlaceholderImage';
import styles from './styles.module.css';

export interface ProductCardMobileProps {
  product: Product;
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

/** کارت موبایل خانه — پورت وفادار productCardMobile از ui.js:68-78:
    عمودی: تصویر مربع + بج تخفیف + عنوان ۱خطی ۱۱px + قیمت sm چسبیده به پایین */
export function ProductCardMobile({ product, className }: ProductCardMobileProps) {
  const href = productHref(product);

  return (
    <article className={[styles.card, className].filter(Boolean).join(' ')}>
      <a href={href} className={styles.imgLink} aria-label={product.title}>
        {product.discount > 0 && (
          <span className={styles.badge}>
            <BadgeCircle discount={product.discount} size="sm" />
          </span>
        )}
        {productImage(product, styles.img)}
      </a>
      <a href={href} className={styles.title}>
        {product.title}
      </a>
      <div className={styles.price}>
        <Price price={product.price} oldPrice={product.oldPrice} size="sm" />
      </div>
    </article>
  );
}
