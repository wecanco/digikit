import { Countdown, Layout, ProductGrid, SectionHeader } from '@digikit/ui';
import { DEMO_PRODUCTS } from '../../lib/demo';
import s from '../showcase.module.css';

export default function AmazingPage() {
  const products = DEMO_PRODUCTS.filter((product) => product.discount >= 20);
  return <Layout active="amazing"><div className={s.page}><SectionHeader title="پیشنهادهای شگفت‌انگیز" seeAllHref="/search?sort=discount" /><div className={s.redBand}><div className={s.row} style={{ justifyContent: 'space-between', color: '#fff' }}><strong>فرصت محدود خرید با تخفیف ویژه</strong><Countdown hoursAhead={5} theme="onRed" /></div><ProductGrid products={products} variant="grid" /></div></div></Layout>;
}
