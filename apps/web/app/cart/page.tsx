'use client';

import { useMemo } from 'react';
import { CartItem, CartSummary, EmptyState, Layout, ToastProvider, useCart, useFavs, useToast, type CartLine } from '@digikit/ui';
import { DEMO_ALL_PRODUCTS } from '../../lib/demo';
import s from '../showcase.module.css';

function CartContent() {
  const cart = useCart();
  const favs = useFavs();
  const toast = useToast();
  const lines = useMemo<CartLine[]>(() => cart.ids.map((id) => {
    const product = DEMO_ALL_PRODUCTS.find((item) => item.id === id);
    return product ? { product, qty: cart.qtyOf(id) || 1 } : null;
  }).filter((line): line is CartLine => Boolean(line)), [cart.ids, cart.qtyOf]);
  const subtotal = lines.reduce((total, line) => total + line.product.price * line.qty, 0);
  const itemsCount = lines.reduce((total, line) => total + line.qty, 0);

  return <Layout active="cart"><div className={s.page}>
    <div><h1>سبد خرید</h1><p className={s.heading}>کالاهای انتخاب‌شده را بررسی و برای پرداخت آماده کنید.</p></div>
    {lines.length === 0 ? <EmptyState title="سبد خرید شما خالی است" description="از بین کالاهای دیجی‌کیت محصول مورد علاقه‌تان را انتخاب کنید." actionLabel="مشاهده محصولات" onAction={() => { window.location.href = '/search'; }} /> : <div className={s.cartLayout}>
      <section className={s.panel}><div className={s.sectionHead}><div><h2>کالاهای انتخاب‌شده</h2><span className={s.muted}>{itemsCount.toLocaleString('fa-IR')} کالا</span></div></div>{lines.map((line) => <CartItem key={line.product.id} item={line} onQuantityChange={(qty) => cart.setQty(line.product.id, qty)} onRemove={() => cart.remove(line.product.id)} onSave={() => { if (!favs.has(line.product.id)) favs.toggle(line.product.id); cart.remove(line.product.id); toast.show('کالا برای بعد ذخیره شد', 'success'); }} />)}</section>
      <aside><CartSummary itemsCount={itemsCount} subtotal={subtotal} freeShippingThreshold={5000000} onCheckout={() => { window.location.href = '/checkout'; }} /></aside>
    </div>}
  </div></Layout>;
}

export default function CartPage() {
  return <ToastProvider><CartContent /></ToastProvider>;
}
