/* ویترین ۲ — کارت‌های کالا: گرید مویی، گرید ساده، شگفت‌انگیز، سوپرمارکت، ردیفی، موبایل */

import type { Metadata } from 'next';
import {
  SectionHeader,
  ProductGrid,
  ProductCardAmazing,
  ProductCardSuper,
  ProductCardRow,
  ProductCardMobile,
  ScrollCarousel,
  Countdown,
} from '@digikit/ui';
import { DEMO_PRODUCTS, DEMO_SUPER } from '../../lib/demo';
import s from '../showcase.module.css';

export const metadata: Metadata = { title: 'کارت‌های کالا' };

export default function ProductsShowcase() {
  const amazing = DEMO_PRODUCTS.filter((x) => x.discount >= 20);

  return (
    <div className={s.page}>
      <SectionHeader title="کارت‌های کالا" seeAllHref="/" />

      <section className={s.section}>
        <h2 className={s.heading}>گرید مویی (bareGrid) — مثل نتایج جستجو</h2>
        <ProductGrid products={DEMO_PRODUCTS.slice(0, 8)} variant="bareGrid" />
      </section>

      <section className={s.section}>
        <h2 className={s.heading}>گرید ساده — مثل پیشنهادهای صفحه اصلی</h2>
        <ProductGrid products={DEMO_PRODUCTS.slice(8, 16)} variant="grid" />
      </section>

      <section className={s.section}>
        <h2 className={s.heading}>کارت شگفت‌انگیز روی نوار قرمز</h2>
        <div className={s.redBand}>
          <div className={s.row} style={{ justifyContent: 'space-between' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>پیشنهاد شگفت‌انگیز</span>
            <Countdown hoursAhead={5} theme="onRed" />
          </div>
          <ScrollCarousel arrows>
            {amazing.map((product) => (
              <ProductCardAmazing key={product.id} product={product} />
            ))}
          </ScrollCarousel>
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.heading}>کارت سوپرمارکت روی پس‌زمینه کِرِم</h2>
        <div className={s.creamBand}>
          <ScrollCarousel>
            {DEMO_SUPER.map((product) => (
              <ProductCardSuper key={product.id} product={product} />
            ))}
          </ScrollCarousel>
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.heading}>کارت ردیفی — فهرست نتایج</h2>
        <div className={s.panel}>
          {DEMO_PRODUCTS.slice(0, 3).map((product) => (
            <ProductCardRow key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.heading}>کارت موبایل خانه — عمودی ۲ ستونی</h2>
        <div className={s.panel} style={{ maxWidth: 420, gridTemplateColumns: '1fr 1fr', gridAutoRows: '1fr' }}>
          {DEMO_SUPER.slice(0, 4).map((product) => (
            <ProductCardMobile key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
