'use client';

import { useMemo } from 'react';
import { EmptyState, Layout, ProductGrid, useFavs } from '@digikit/ui';
import { DEMO_ALL_PRODUCTS } from '../../lib/demo';
import s from '../showcase.module.css';

export default function FavoritesPage() {
  const favs = useFavs();
  const products = useMemo(() => DEMO_ALL_PRODUCTS.filter((product) => favs.ids.includes(product.id)), [favs.ids]);
  return <Layout active="profile"><div className={s.page}><h1>علاقه‌مندی‌ها</h1>{products.length ? <ProductGrid products={products} variant="grid" /> : <EmptyState title="هنوز کالایی ذخیره نشده است" description="با زدن قلب روی کارت کالا، محصولات محبوبتان را اینجا نگه دارید." actionLabel="مشاهده محصولات" onAction={() => { window.location.href = '/search'; }} />}</div></Layout>;
}
