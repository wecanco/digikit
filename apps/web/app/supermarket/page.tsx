import { Layout, ProductGrid, SectionHeader } from '@digikit/ui';
import { DEMO_SUPER } from '../../lib/demo';
import s from '../showcase.module.css';

export default function SupermarketPage() {
  return <Layout active="supermarket"><div className={s.page}><SectionHeader title="سوپرمارکت دیجی‌کیت" seeAllHref="/search?cat=super" /><div className={s.creamBand}><ProductGrid products={DEMO_SUPER} variant="grid" /></div></div></Layout>;
}
