'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AddressCard,
  Button,
  Card,
  CartItem,
  CartSummary,
  CheckoutSteps,
  CouponField,
  EmptyState,
  Layout,
  ShippingMethod,
  ToastProvider,
  useAddresses,
  useCart,
  useOrders,
  useToast,
  type CartLine,
} from '@digikit/ui';
import { DEMO_ALL_PRODUCTS, DEMO_DEFAULT_ADDRESSES } from '../../lib/demo';
import s from '../showcase.module.css';

const SHIPPING_OPTIONS = [
  { id: 'normal', title: 'ارسال عادی', description: 'تحویل ۱ تا ۲ روز کاری', price: 49000 },
  { id: 'express', title: 'ارسال اکسپرس', description: 'تحویل امروز در شهرهای منتخب', price: 89000 },
  { id: 'pickup', title: 'تحویل از مرکز', description: 'رایگان', price: 0 },
];

function CheckoutContent() {
  const cart = useCart();
  const { addresses, hydrated: addressesHydrated } = useAddresses(DEMO_DEFAULT_ADDRESSES);
  const { add: addOrder } = useOrders();
  const toast = useToast();
  const [step, setStep] = useState('address');
  const [shipping, setShipping] = useState('express');
  const [coupon, setCoupon] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const lines = useMemo<CartLine[]>(() => cart.ids.map((id) => {
    const product = DEMO_ALL_PRODUCTS.find((item) => item.id === id);
    return product ? { product, qty: cart.qtyOf(id) || 1 } : null;
  }).filter((line): line is CartLine => Boolean(line)), [cart.ids, cart.qtyOf]);
  const subtotal = lines.reduce((total, line) => total + line.product.price * line.qty, 0);
  const itemCount = lines.reduce((total, line) => total + line.qty, 0);
  const shippingCost = shipping === 'pickup' ? 0 : shipping === 'normal' ? 49000 : 89000;
  const couponDiscount = coupon ? Math.round(subtotal * 0.05) : 0;
  const chargedShipping = subtotal >= 5000000 ? 0 : shippingCost;

  useEffect(() => {
    if (!addressesHydrated) return;
    setSelectedAddress((current) => addresses.some((address) => address.id === current) ? current : addresses.find((address) => address.isDefault)?.id || addresses[0]?.id || '');
  }, [addresses, addressesHydrated]);

  const applyCoupon = (code: string) => {
    const normalized = code.trim();
    if (!normalized) {
      toast.show('کد تخفیف را وارد کنید', 'error');
      return;
    }
    setCoupon(normalized);
    toast.show('کد تخفیف اعمال شد', 'success');
  };

  const continueCheckout = () => {
    if (!lines.length) {
      toast.show('سبد خرید شما خالی است', 'error');
      return;
    }
    if (step === 'address') {
      if (!addressesHydrated || !addresses.length) {
        toast.show('ابتدا یک آدرس برای ارسال ثبت کنید', 'error');
        return;
      }
      if (!selectedAddress) {
        toast.show('یک آدرس برای ارسال انتخاب کنید', 'error');
        return;
      }
      setStep('shipping');
    }
    else if (step === 'shipping') setStep('payment');
    else {
      const address = addresses.find((item) => item.id === selectedAddress) || addresses[0];
      if (!address) {
        toast.show('آدرس ارسال پیدا نشد', 'error');
        return;
      }
      const shippingOption = SHIPPING_OPTIONS.find((option) => option.id === shipping) || SHIPPING_OPTIONS[0];
      addOrder({
        id: `DK-${Date.now().toString().slice(-8)}`,
        createdAt: new Date().toISOString(),
        status: 'processing',
        items: lines.map((line) => ({ id: line.product.id, title: line.product.title, qty: line.qty, price: line.product.price, image: line.product.image })),
        subtotal,
        discount: couponDiscount,
        shipping: chargedShipping,
        total: Math.max(0, subtotal - couponDiscount + chargedShipping),
        address: { title: address.title, recipient: address.recipient, city: address.city },
        shippingTitle: shippingOption.title,
      });
      cart.clear();
      setOrderPlaced(true);
      toast.show('سفارش نمونه با موفقیت ثبت شد', 'success');
    }
  };

  if (orderPlaced) return <Layout active="cart"><div className={s.page}><Card padding="lg"><EmptyState title="سفارش نمونه با موفقیت ثبت شد" description="سفارش شما در بخش سفارش‌های من ذخیره شد و برای نمایش وضعیت آماده است." actionLabel="مشاهده سفارش‌ها" onAction={() => { window.location.href = '/profile'; }} action={<div className={s.inline}><Button onClick={() => { window.location.href = '/profile'; }}>مشاهده سفارش‌ها</Button><Button variant="outline" onClick={() => { window.location.href = '/search'; }}>بازگشت به خرید</Button></div>} /></Card></div></Layout>;

  return <Layout active="cart"><div className={s.page}>
    <div><h1>تکمیل سفارش</h1><p className={s.heading}>مرحله‌به‌مرحله سفارش را بررسی و نهایی کنید.</p></div>
    {!lines.length ? <Card padding="lg"><EmptyState title="سبد خرید شما خالی است" description="برای ادامه‌ی خرید، ابتدا یک کالا به سبد اضافه کنید." actionLabel="مشاهده محصولات" onAction={() => { window.location.href = '/search'; }} /></Card> : <>
      <CheckoutSteps steps={[{ id: 'address', title: 'آدرس ارسال' }, { id: 'shipping', title: 'روش ارسال' }, { id: 'payment', title: 'پرداخت' }]} current={step} onChange={setStep} />
      <div className={s.checkoutGrid}>
        <div className={s.stack}>
          <Card padding="lg"><div className={s.sectionHead}><div><h2>کالاهای سفارش</h2><span className={s.muted}>{itemCount.toLocaleString('fa-IR')} کالا در سبد شماست.</span></div></div>{lines.map((line) => <CartItem key={line.product.id} item={line} onQuantityChange={(quantity) => cart.setQty(line.product.id, quantity)} onRemove={() => cart.remove(line.product.id)} />)}</Card>
          {step === 'address' && <Card padding="lg"><div className={s.sectionHead}><div><h2>آدرس تحویل</h2><span className={s.muted}>یک آدرس را برای ارسال انتخاب کنید.</span></div><Button size="sm" variant="outline" onClick={() => { window.location.href = '/profile?tab=addresses'; }}>مدیریت آدرس‌ها</Button></div><div className={s.addresses}>{!addressesHydrated ? <p className={s.muted}>در حال بارگذاری آدرس‌ها…</p> : addresses.length ? addresses.map((address) => <AddressCard key={address.id} address={address} selected={selectedAddress === address.id} onSelect={() => setSelectedAddress(address.id)} />) : <EmptyState title="آدرسی برای ارسال ندارید" description="از بخش پروفایل یک آدرس اضافه کنید و دوباره به checkout برگردید." actionLabel="افزودن آدرس" onAction={() => { window.location.href = '/profile?tab=addresses'; }} />}</div></Card>}
          {step === 'shipping' && <Card padding="lg"><div className={s.sectionHead}><div><h2>روش ارسال</h2><span className={s.muted}>زمان و هزینه‌ی تحویل را انتخاب کنید.</span></div></div><ShippingMethod name="shipping" value={shipping} onChange={setShipping} options={SHIPPING_OPTIONS} /></Card>}
          {step === 'payment' && <Card padding="lg"><h2>پرداخت امن</h2><p className={s.muted}>درگاه پرداخت در این ویترین شبیه‌سازی شده است و هیچ تراکنش واقعی انجام نمی‌شود.</p><div className={s.inline}><Button onClick={continueCheckout}>ثبت سفارش نمونه</Button><Button variant="outline" onClick={() => setStep('shipping')}>بازگشت</Button></div></Card>}
          <CouponField value={coupon} onApply={applyCoupon} appliedCode={coupon || undefined} onRemove={() => setCoupon('')} />
        </div>
        <CartSummary itemsCount={itemCount} subtotal={subtotal} discount={couponDiscount} shipping={shippingCost} freeShippingThreshold={5000000} onCheckout={continueCheckout} checkoutLabel={step === 'payment' ? 'پرداخت و ثبت سفارش' : 'ادامه'} />
      </div>
    </>}
  </div></Layout>;
}

export default function CheckoutPage() {
  return <ToastProvider><CheckoutContent /></ToastProvider>;
}
