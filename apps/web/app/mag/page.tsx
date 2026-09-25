import { Layout, PlaceholderImage, SectionHeader } from '@digikit/ui';
import s from '../showcase.module.css';

const ARTICLES = [{ id: 1, category: 'فناوری', title: 'خانه‌ای هوشمندتر با پنج گجت ساده', description: 'راهنمایی کوتاه برای شروع یک خانه‌ی هوشمند و کاربردی.' }, { id: 2, category: 'راهنمای خرید', title: 'چطور لپ‌تاپ مناسب کارمان را انتخاب کنیم؟', description: 'مقایسه‌ی نکته‌های مهم قبل از خرید لپ‌تاپ.' }, { id: 3, category: 'سبک زندگی', title: 'کتاب‌های خواندنی برای شب‌های پاییزی', description: 'چند پیشنهاد برای فصل مطالعه و استراحت.' }];

export default function MagPage() {
  return <Layout active="mag"><div className={s.page}><SectionHeader title="دیجی‌کیت مگ" seeAllHref="/search" /><p className={s.muted}>راهنماها، بررسی‌ها و ایده‌های کاربردی برای انتخاب بهتر.</p><div className={s.grid}>{ARTICLES.map((article) => <article className={s.panel} key={article.id}><PlaceholderImage seed={`mag-${article.id}`} label={article.category} ratio="16:9" /><span className={s.kicker}>{article.category}</span><h2>{article.title}</h2><p className={s.muted}>{article.description}</p><a className={s.link} href={`/mag-post?id=${article.id}`}>ادامه مطلب ←</a></article>)}</div></div></Layout>;
}
