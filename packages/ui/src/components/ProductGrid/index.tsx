import type { CSSProperties } from 'react';
import type { Product } from '../../types';
import { ProductCardGrid } from '../ProductCardGrid';
import styles from './styles.module.css';

export interface ProductGridProps {
  products: Product[];
  /** bareGrid (پیش‌فرض): شبکه خط‌مویی — gap-px روی neutral-400 با سلول‌های سفید (دسته‌بندی‌ها/جستجو) · grid: شبکه ساده gap-3 */
  variant?: 'bareGrid' | 'grid';
  /** تعداد ستون‌ها در برک‌پوینت lg — پیش‌فرض ۴ (از طریق --cols-lg) */
  columns?: number;
  className?: string;
}

/** شبکه محصولات — ۲ ستون موبایل / ۳ تبلت / ۴ (یا columns) دسکتاپ؛ در حالت grid
 *  از xl پنج ستون. هر سلول یک ProductCardGrid است (bare برای حالت خط‌مویی) */
export function ProductGrid({ products, variant = 'bareGrid', columns, className }: ProductGridProps) {
  const style = columns != null ? ({ '--cols-lg': String(columns) } as CSSProperties) : undefined;

  return (
    <div className={[styles[variant], className].filter(Boolean).join(' ')} style={style}>
      {products.map((product) => (
        <div className={styles.cell} key={product.id}>
          <ProductCardGrid product={product} bare={variant === 'bareGrid'} />
        </div>
      ))}
    </div>
  );
}
