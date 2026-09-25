import { Layout, PlaceholderImage } from '@digikit/ui';
import s from '../showcase.module.css';

export default function MagPostPage() {
  return <Layout active="mag"><div className={s.page}><article className={s.panel}><span className={s.kicker}>دیجی‌کیت مگ</span><h1>راهنمای انتخاب بهتر برای خرید آنلاین</h1><p className={s.muted}>یک مقاله‌ی نمونه برای نمایش الگوی صفحه‌ی مطلب، با خوانایی و فاصله‌گذاری مناسب RTL.</p><PlaceholderImage seed="mag-post" label="دیجی‌کیت مگ" ratio="wide" /><div className={s.stack}><p>انتخاب محصول مناسب همیشه با مقایسه‌ی چند گزینه و توجه به نیاز واقعی شروع می‌شود. در این راهنما، ویژگی‌ها را به زبان ساده بررسی می‌کنیم تا تصمیم‌گیری سریع‌تر و مطمئن‌تر شود.</p><p>قبل از خرید، بودجه، گارانتی، شرایط ارسال و امکان بازگشت را کنار هم ببینید. اگر هنوز مردد هستید، مشخصات فنی و دیدگاه خریداران را مقایسه کنید.</p></div><a className={s.link} href="/mag">بازگشت به دیجی‌کیت مگ</a></article></div></Layout>;
}
