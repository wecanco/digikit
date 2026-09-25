'use client';

import { useEffect, useState, type FormEvent } from 'react';
import {
  AddressCard,
  Avatar,
  Button,
  Card,
  EmptyState,
  FormField,
  Input,
  Layout,
  Modal,
  OrderStatus,
  Price,
  ProductGrid,
  Tabs,
  Textarea,
  ToastProvider,
  useAddresses,
  useFavs,
  useOrders,
  useToast,
  useUser,
  type Address,
} from '@digikit/ui';
import { DEMO_ALL_PRODUCTS, DEMO_DEFAULT_ADDRESSES } from '../../lib/demo';
import s from '../showcase.module.css';

type AddressDraft = Parameters<ReturnType<typeof useAddresses>['add']>[0];

function draftFromAddress(address: Address): AddressDraft {
  return {
    title: address.title,
    recipient: address.recipient,
    phone: address.phone || '',
    province: address.province,
    city: address.city,
    details: address.details,
    plaque: address.plaque || '',
    unit: address.unit || '',
    postalCode: address.postalCode || '',
  };
}

function emptyDraft(recipient: string): AddressDraft {
  return {
    title: '',
    recipient,
    phone: '',
    province: 'تهران',
    city: '',
    details: '',
    plaque: '',
    unit: '',
    postalCode: '',
  };
}

function formatOrderDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'تاریخ نامشخص' : new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(date);
}

function ProfileContent() {
  const { user, login, logout } = useUser();
  const favs = useFavs();
  const { addresses, hydrated: addressesHydrated, add: addAddress, update: updateAddress, remove: removeAddress, setDefault: setDefaultAddress } = useAddresses(DEMO_DEFAULT_ADDRESSES);
  const { orders, hydrated: ordersHydrated } = useOrders();
  const toast = useToast();
  const [tab, setTab] = useState('orders');
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AddressDraft>(() => emptyDraft('کاربر دیجی‌کیت'));
  const [addressError, setAddressError] = useState('');

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('tab') === 'addresses') setTab('addresses');
  }, []);

  const openAddressEditor = (address?: Address) => {
    setEditingId(address?.id || null);
    setDraft(address ? draftFromAddress(address) : emptyDraft(user?.name || 'کاربر دیجی‌کیت'));
    setAddressError('');
    setAddressModalOpen(true);
  };

  const updateDraft = (key: keyof AddressDraft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setAddressError('');
  };

  const saveAddress = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const required = [draft.title, draft.recipient, draft.province, draft.city, draft.details];
    if (required.some((value) => !value.trim())) {
      setAddressError('لطفاً همه فیلدهای ضروری آدرس را کامل کنید.');
      return;
    }
    if (draft.postalCode && !/^[0-9۰-۹]{10}$/.test(draft.postalCode)) {
      setAddressError('کد پستی باید ۱۰ رقم باشد.');
      return;
    }

    if (editingId) updateAddress(editingId, draft);
    else addAddress(draft);
    setAddressModalOpen(false);
    toast.show(editingId ? 'آدرس ویرایش شد' : 'آدرس جدید ذخیره شد', 'success');
  };

  const deleteAddress = (id: string) => {
    if (!window.confirm('آیا از حذف این آدرس مطمئن هستید؟')) return;
    removeAddress(id);
    toast.show('آدرس حذف شد', 'info');
  };

  const favoriteProducts = DEMO_ALL_PRODUCTS.filter((product) => favs.ids.includes(product.id));

  return <Layout active="profile"><div className={s.page}>
    <Card padding="lg"><div className={s.inline}><Avatar name={user?.name || 'مهمان دیجی‌کیت'} size="lg" status={user ? 'online' : undefined} /><div><h1>{user?.name || 'حساب کاربری من'}</h1><p className={s.muted}>{user ? 'به حساب دیجی‌کیت خوش آمدید.' : 'برای ذخیره سفارش‌ها و علاقه‌مندی‌ها وارد شوید.'}</p></div><span style={{ marginInlineStart: 'auto' }}>{user ? <Button variant="outline" onClick={logout}>خروج</Button> : <Button onClick={() => login('کاربر دیجی‌کیت', 'demo-user')}>ورود نمونه</Button>}</span></div></Card>
    <Tabs items={[{ id: 'orders', title: 'سفارش‌های من' }, { id: 'favorites', title: `علاقه‌مندی‌ها (${favs.ids.length.toLocaleString('fa-IR')})` }, { id: 'addresses', title: `آدرس‌ها (${addresses.length.toLocaleString('fa-IR')})` }]} active={tab} onChange={setTab} />
    {tab === 'orders' && (!ordersHydrated ? <Card padding="lg"><p className={s.muted}>در حال بارگذاری سفارش‌ها…</p></Card> : orders.length ? <div className={s.orderList}>{orders.map((order) => <Card key={order.id} padding="lg" className={s.orderCard}><div className={s.orderHeader}><div><h2>سفارش {order.id}</h2><p className={s.muted}>{formatOrderDate(order.createdAt)} · {order.address.title} · {order.shippingTitle}</p></div><OrderStatus status={order.status} /></div><div className={s.orderItems}>{order.items.slice(0, 3).map((item) => <div className={s.orderItem} key={item.id}><span>{item.title}</span><strong>×{item.qty.toLocaleString('fa-IR')}</strong></div>)}{order.items.length > 3 && <span className={s.muted}>و { (order.items.length - 3).toLocaleString('fa-IR') } کالای دیگر</span>}</div><div className={s.orderFooter}><span>{order.items.reduce((total, item) => total + item.qty, 0).toLocaleString('fa-IR')} کالا</span><Price price={order.total} size="md" /></div></Card>)}</div> : <EmptyState title="هنوز سفارشی ثبت نشده است" description="بعد از ثبت سفارش، وضعیت و جزئیات آن را اینجا می‌بینید." actionLabel="شروع خرید" onAction={() => { window.location.href = '/search'; }} />)}
    {tab === 'favorites' && (favoriteProducts.length ? <div className={s.stack}><ProductGrid products={favoriteProducts} variant="grid" /><Button variant="outline" onClick={() => { window.location.href = '/favorites'; }}>مشاهده صفحه علاقه‌مندی‌ها</Button></div> : <EmptyState title="لیست علاقه‌مندی‌ها خالی است" description="کالاهای مورد علاقه‌تان را برای مقایسه و خرید بعدی ذخیره کنید." actionLabel="مشاهده محصولات" onAction={() => { window.location.href = '/search'; }} />)}
    {tab === 'addresses' && <div className={s.addresses}>
      {!addressesHydrated ? <Card padding="lg"><p className={s.muted}>در حال بارگذاری آدرس‌ها…</p></Card> : addresses.map((address) => <AddressCard key={address.id} address={{ ...address, recipient: address.recipient || user?.name || 'کاربر دیجی‌کیت' }} selectable={false} onSetDefault={() => setDefaultAddress(address.id)} onEdit={() => openAddressEditor(address)} onDelete={() => deleteAddress(address.id)} />)}
      {addressesHydrated && !addresses.length && <EmptyState title="هنوز آدرسی ثبت نشده است" description="برای سریع‌تر شدن فرایند خرید، اولین آدرس خود را اضافه کنید." actionLabel="افزودن آدرس" onAction={() => openAddressEditor()} />}
      <Button variant="outline" onClick={() => openAddressEditor()}>افزودن آدرس جدید</Button>
    </div>}
    <Modal open={addressModalOpen} onClose={() => setAddressModalOpen(false)} title={editingId ? 'ویرایش آدرس' : 'افزودن آدرس جدید'} description="اطلاعات ارسال را دقیق وارد کنید تا سفارش بدون تأخیر تحویل شود.">
      <form className={s.addressForm} onSubmit={saveAddress}>
        <div className={s.formGrid}>
          <FormField label="عنوان آدرس" required><Input value={draft.title} onChange={(event) => updateDraft('title', event.target.value)} placeholder="مثلاً خانه یا محل کار" /></FormField>
          <FormField label="نام گیرنده" required><Input value={draft.recipient} onChange={(event) => updateDraft('recipient', event.target.value)} placeholder="نام و نام خانوادگی" /></FormField>
          <FormField label="شماره موبایل"><Input value={draft.phone} onChange={(event) => updateDraft('phone', event.target.value)} inputMode="tel" placeholder="۰۹۱۲۱۲۳۴۵۶۷" /></FormField>
          <FormField label="کد پستی"><Input value={draft.postalCode || ''} onChange={(event) => updateDraft('postalCode', event.target.value)} inputMode="numeric" placeholder="۱۰ رقم" /></FormField>
          <FormField label="استان" required><Input value={draft.province} onChange={(event) => updateDraft('province', event.target.value)} /></FormField>
          <FormField label="شهر" required><Input value={draft.city} onChange={(event) => updateDraft('city', event.target.value)} /></FormField>
          <FormField label="پلاک"><Input value={draft.plaque || ''} onChange={(event) => updateDraft('plaque', event.target.value)} inputMode="numeric" /></FormField>
          <FormField label="واحد"><Input value={draft.unit || ''} onChange={(event) => updateDraft('unit', event.target.value)} inputMode="numeric" /></FormField>
          <FormField label="نشانی کامل" required className={s.fullField}><Textarea rows={3} value={draft.details} onChange={(event) => updateDraft('details', event.target.value)} placeholder="خیابان، کوچه، پلاک، واحد" /></FormField>
        </div>
        {addressError && <p className={s.formError} role="alert">{addressError}</p>}
        <div className={s.modalActions}><Button type="submit">ذخیره آدرس</Button><Button type="button" variant="ghost" onClick={() => setAddressModalOpen(false)}>انصراف</Button></div>
      </form>
    </Modal>
  </div></Layout>;
}

export default function ProfilePage() {
  return <ToastProvider><ProfileContent /></ToastProvider>;
}
