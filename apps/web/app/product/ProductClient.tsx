'use client';

import { useSearchParams } from 'next/navigation';
import { Heart, ShieldCheck, Truck } from 'lucide-react';
import {
  Breadcrumb,
  Button,
  Card,
  Layout,
  ProductGallery,
  ProductInfo,
  ProductSpecs,
  ReviewSummary,
  SellerCard,
  ToastProvider,
  useCart,
  useFavs,
  useToast,
} from '@digikit/ui';
import { DEMO_ALL_PRODUCTS, DEMO_CATEGORIES } from '../../lib/demo';
import s from '../kit/kit.module.css';

function ProductContent() {
  const params = useSearchParams();
  const cart = useCart();
  const favs = useFavs();
  const toast = useToast();
  const id = Number(params.get('id'));
  const product = DEMO_ALL_PRODUCTS.find((item) => item.id === id) || DEMO_ALL_PRODUCTS[0];
  const categoryTitle = DEMO_CATEGORIES.find((category) => category.id === product.cat)?.title || 'کالاها';
  const gallery = [product.image, ...(product.images || [`ph:${product.id}-detail`, `ph:${product.id}-angle`])].map((src, index) => ({
    src,
    label: product.brand || product.title,
    alt: `${product.title} - تصویر ${index + 1}`,
  }));

  const addToCart = (quantity: number) => {
    const current = cart.qtyOf(product.id);
    if (current === 0) cart.add(product.id);
    for (let index = Math.max(current, 1); index < quantity; index += 1) cart.add(product.id);
    if (current >= quantity) cart.setQty(product.id, quantity);
    toast.show('کالا با موفقیت به سبد خرید اضافه شد', 'success');
  };

  return <Layout active="home" categories={[]}>
    <div className={s.page}>
      <Breadcrumb items={[{ title: 'خانه', href: '/' }, { title: categoryTitle, href: `/search?cat=${product.cat}` }, { title: product.title }]} />
      <section className={s.productDetail}>
        <ProductGallery images={gallery} favorite={favs.has(product.id)} onFavorite={() => favs.toggle(product.id)} />
        <ProductInfo product={product} colors={['مشکی', 'نقره‌ای', 'آبی']} sizes={['۱۲۸ گیگابایت', '۲۵۶ گیگابایت']} favorite={favs.has(product.id)} onFavorite={() => favs.toggle(product.id)} onAddToCart={addToCart} />
      </section>
      <div className={s.productLower}>
        <ProductSpecs specs={[{ label: 'برند', value: product.brand || '—', featured: true }, { label: 'دسته‌بندی', value: categoryTitle }, { label: 'گارانتی', value: product.warranty || 'گارانتی اصالت کالا' }, { label: 'وضعیت موجودی', value: product.stock === 0 ? 'ناموجود' : 'موجود در انبار' }]} />
        <div className={s.stack}>
          <SellerCard seller={{ name: 'فروشگاه رسمی دیجی‌کیت', rating: 4.8, ratingCount: 1240, positiveRate: 98, location: 'تهران', verified: true }} />
          <Card padding="md"><div className={s.inline}><ShieldCheck size={20} color="var(--dk-success)" aria-hidden="true" /><strong>خرید مطمئن</strong></div><p className={s.muted}>ضمانت اصالت، ارسال سریع و امکان بازگشت تا ۷ روز.</p><div className={s.inline}><Truck size={18} aria-hidden="true" /><span>تحویل سریع دیجی‌کیت</span><Heart size={18} aria-hidden="true" /><span>ذخیره در علاقه‌مندی‌ها</span></div></Card>
        </div>
      </div>
      <ReviewSummary rating={product.rating} count={product.ratingCount} distribution={{ 5: 1680, 4: 520, 3: 180, 2: 80, 1: 81 }} onWrite={() => toast.show('ثبت دیدگاه بعد از ورود فعال می‌شود', 'info')} />
      <div className={s.inline}><Button variant="outline" onClick={() => { window.location.href = '/search'; }}>بازگشت به محصولات</Button></div>
    </div>
  </Layout>;
}

export default function ProductClient() {
  return <ToastProvider><ProductContent /></ToastProvider>;
}
