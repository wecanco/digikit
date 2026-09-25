/* ویترین پوسته‌ی کامل فروشگاهی */

import type { Metadata } from 'next';
import {
  Layout,
  SectionHeader,
  ServicesStrip,
  ServiceTiles,
  ProductGrid,
  ScrollCarousel,
  ProductCardAmazing,
  PlaceholderImage,
} from '@digikit/ui';
import { DEMO_PRODUCTS, DEMO_CATEGORIES } from '../../lib/demo';
import s from '../showcase.module.css';

export const metadata: Metadata = {
  title: 'پوسته فروشگاهی نمونه',
  description: 'پوسته‌ی کامل فروشگاهی دیجی‌کیت با نوار کمپین، هدر، خدمات و گرید کالا.',
};

export default function ShopPage() {
  const amazing = DEMO_PRODUCTS.filter((product) => product.discount >= 20);

  return (
    <Layout active="home" categories={DEMO_CATEGORIES}>
      <div className={s.page}>
        <PlaceholderImage seed={900} label="بنر ویژه دیجی‌کیت" ratio="wide" />

        <ServiceTiles />

        <section className={s.section}>
          <SectionHeader title="پیشنهاد شگفت‌انگیز" seeAllHref="/search?sort=discount" />
          <div className={s.redBand}>
            <ScrollCarousel arrows>
              {amazing.map((product) => (
                <ProductCardAmazing key={product.id} product={product} />
              ))}
            </ScrollCarousel>
          </div>
        </section>

        <ServicesStrip />

        <section className={s.section}>
          <SectionHeader title="محبوب‌ترین کالاها" seeAllHref="/search" />
          <ProductGrid products={DEMO_PRODUCTS} variant="grid" />
        </section>
      </div>
    </Layout>
  );
}
