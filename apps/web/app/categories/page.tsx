import { CategoryCard, Layout, SectionHeader } from '@digikit/ui';
import { DEMO_CATEGORIES } from '../../lib/demo';
import s from '../showcase.module.css';

export default function CategoriesPage() {
  return <Layout active="cats" categories={DEMO_CATEGORIES}><div className={s.page}><SectionHeader title="دسته‌بندی کالاها" seeAllHref="/search" /><div className={s.categoryGrid}>{DEMO_CATEGORIES.map((category) => <CategoryCard key={category.id} category={category} count={128} href={`/search?cat=${category.id}`} />)}</div></div></Layout>;
}
