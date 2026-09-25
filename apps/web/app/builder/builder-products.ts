import type { Product } from '@digikit/ui';
import { DEMO_PRODUCTS } from '../../lib/demo';
import type { BuilderValue } from './builder.types';

export function safeBuilderHref(value: string, fallback = '#'): string {
  const trimmed = value.trim();
  if (/^(https?:\/\/|mailto:|tel:|#|\?|\/(?!\/)|\.{1,2}\/)/i.test(trimmed)) return trimmed;
  return fallback;
}

export function resolveBuilderProducts(value: BuilderValue | undefined): Product[] {
  if (!Array.isArray(value)) return DEMO_PRODUCTS.slice(0, 8);
  return value.flatMap((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return [];
    if (typeof item.title !== 'string' || typeof item.price !== 'number' || !Number.isFinite(item.price)) return [];
    const price = Math.max(0, item.price);
    const oldPrice = typeof item.oldPrice === 'number' && Number.isFinite(item.oldPrice) && item.oldPrice >= 0 ? item.oldPrice : null;
    return [{
      id: typeof item.id === 'number' && Number.isFinite(item.id) ? item.id : index + 1,
      title: item.title,
      brand: typeof item.brand === 'string' ? item.brand : '',
      cat: 'builder',
      price,
      oldPrice,
      discount: oldPrice && oldPrice > price ? Math.min(100, Math.round((1 - price / oldPrice) * 100)) : 0,
      rating: 0,
      ratingCount: 0,
      image: typeof item.image === 'string' ? item.image : `ph:${index + 1}`,
      href: typeof item.href === 'string' ? item.href : '#',
    } satisfies Product];
  });
}

export function serializeBuilderProducts(products: Product[]): BuilderValue {
  return products.map((product) => ({
    id: product.id,
    title: product.title,
    brand: product.brand || '',
    price: product.price,
    oldPrice: product.oldPrice || 0,
    image: product.image,
    href: product.href || '#',
  }));
}
