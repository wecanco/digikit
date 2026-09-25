import type { Product } from '../../types';
import { productHref } from '../../utils/links';
import { toFa } from '../../utils/format';
import { Price } from '../Price';
import { PlaceholderImage } from '../PlaceholderImage';
import styles from './styles.module.css';

export interface ProductCardAmazingProps {
  product: Product;
  /** کلاس عرض دلخواه — به انتهای کلاس کارت اضافه می‌شود (پیش‌فرض کارت ۱۵۰ پیکسل است) */
  widthClass?: string;
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

/** کارت شگفت‌انگیز — کارت سفید روی باند قرمز + نوار «فروش رفته»
   (درصد فروش = product.discount؛ اعداد فارسی، قیمت لاتین) */
export function ProductCardAmazing({ product, widthClass, className }: ProductCardAmazingProps) {
  const href = productHref(product);
  const sold = Math.max(0, Math.min(100, Math.round(product.discount)));
  const remaining = 100 - sold;

  return (
    <article className={[styles.card, widthClass, className].filter(Boolean).join(' ')}>
      <a href={href} className={styles.imgLink} aria-label={product.title}>
        <span className={styles.thumb}>{productImage(product, styles.img)}</span>
      </a>
      <h3 className={styles.title}>{product.title}</h3>
      <div className={styles.price}>
        <Price price={product.price} oldPrice={product.oldPrice} size="sm" />
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-label="درصد فروش رفته"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={sold}
      >
        <div className={styles.fill} style={{ width: `${sold}%` }} />
      </div>
      <p className={styles.caption}>
        <span>{toFa(sold)}٪ فروش رفته</span>
        <span>{toFa(remaining)}٪ باقی‌مانده</span>
      </p>
    </article>
  );
}
