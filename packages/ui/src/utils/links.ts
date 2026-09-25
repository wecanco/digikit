import type { Product } from '../types';

/** مقصد پیش‌فرض کارت کالا؛ مصرف‌کننده می‌تواند با product.href آن را جایگزین کند. */
export function productHref(product: Pick<Product, 'id' | 'href'>): string {
  return product.href || `/product?id=${encodeURIComponent(product.id)}`;
}
