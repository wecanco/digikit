'use client';

/* ویترین ۱ — پریمیتیوها: دکمه، قیمت، امتیاز، بج، چیپ، استپر، شمارش معکوس،
   توست، اسپینر، اسکلتون، اینپوت، مودال، بات‌شیت، تب، بردکرامب، کاروسل */

import { useState } from 'react';
import {
  Button,
  Price,
  Rating,
  BadgeCircle,
  Chip,
  SectionHeader,
  Stepper,
  Countdown,
  ToastProvider,
  useToast,
  Spinner,
  Skeleton,
  Input,
  SearchPill,
  Modal,
  BottomSheet,
  Tabs,
  Breadcrumb,
  ScrollCarousel,
  PlaceholderImage,
} from '@digikit/ui';
import s from './showcase.module.css';

function ToastDemo() {
  const toast = useToast();
  return (
    <div className={s.row}>
      <Button variant="outline" onClick={() => toast.show('به سبد خرید اضافه شد', 'success')}>موفق</Button>
      <Button variant="outline" onClick={() => toast.show('خطا در برقراری ارتباط', 'error')}>خطا</Button>
      <Button variant="outline" onClick={() => toast.show('قیمت کالا به‌روزرسانی شد', 'info')}>اطلاع</Button>
    </div>
  );
}

export default function PrimitivesShowcase() {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('orders');
  const [modal, setModal] = useState(false);
  const [sheet, setSheet] = useState(false);

  return (
    <ToastProvider>
      <div className={s.page}>
        <SectionHeader title="پریمیتیوها" />

        <section className={s.section}>
          <h2 className={s.heading}>دکمه‌ها</h2>
          <div className={s.row}>
            <Button>افزودن به سبد</Button>
            <Button variant="outline">مشاهده همه</Button>
            <Button variant="ghost">انصراف</Button>
            <Button variant="amazing">پیشنهاد شگفت‌انگیز</Button>
            <Button pill>خرید</Button>
            <Button variant="amazing" pill>شگفت‌انگیز</Button>
          </div>
        </section>

        <section className={s.section}>
          <h2 className={s.heading}>قیمت و امتیاز و بج</h2>
          <div className={s.row}>
            <Price price={455000} oldPrice={700000} />
            <Price price={455000} />
            <Price price={1290000} oldPrice={1890000} size="sm" />
            <Rating rating={4.6} count={2541} />
            <Rating rating={4.6} count={2541} single />
            <BadgeCircle discount={35} />
            <BadgeCircle discount={12} size="sm" />
          </div>
        </section>

        <section className={s.section}>
          <h2 className={s.heading}>چیپ و استپر و تب</h2>
          <div className={s.row}>
            <Chip>گوشی موبایل</Chip>
            <Chip active>لپ‌تاپ</Chip>
            <Chip>هدفون</Chip>
            <Stepper value={qty} onChange={setQty} />
          </div>
          <Tabs
            items={[{ id: 'orders', title: 'سفارش‌ها' }, { id: 'favs', title: 'علاقه‌مندی‌ها' }, { id: 'seen', title: 'بازدیدهای اخیر' }]}
            active={tab}
            onChange={setTab}
          />
        </section>

        <section className={s.section}>
          <h2 className={s.heading}>شمارش معکوس</h2>
          <div className={s.redBand}>
            <div className={s.row}>
              <Countdown hoursAhead={5} theme="onRed" />
              <Countdown hoursAhead={5} theme="heroWhite" />
            </div>
          </div>
        </section>

        <section className={s.section}>
          <h2 className={s.heading}>توست</h2>
          <ToastDemo />
        </section>

        <section className={s.section}>
          <h2 className={s.heading}>اسپینر و اسکلتون</h2>
          <div className={s.row}>
            <Spinner />
            <Spinner size={36} />
            <Skeleton variant="text" width={180} />
            <Skeleton variant="circle" width={48} height={48} />
          </div>
          <div className={s.grid}>
            <Skeleton variant="card" />
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </div>
        </section>

        <section className={s.section}>
          <h2 className={s.heading}>ورودی‌ها</h2>
          <div className={s.row}>
            <Input placeholder="نام و نام خانوادگی" />
            <Input variant="search" placeholder="جستجو" />
            <Input variant="searchMuted" placeholder="جستجو در دیجی‌کیت" />
          </div>
          <SearchPill overlay />
        </section>

        <section className={s.section}>
          <h2 className={s.heading}>مودال و بات‌شیت</h2>
          <div className={s.row}>
            <Button variant="outline" onClick={() => setModal(true)}>باز کردن مودال</Button>
            <Button variant="outline" onClick={() => setSheet(true)}>باز کردن بات‌شیت</Button>
          </div>
          <Modal open={modal} onClose={() => setModal(false)} title="انتخاب رنگ">
            <p>کدام رنگ را می‌پسندید؟</p>
          </Modal>
          <BottomSheet open={sheet} onClose={() => setSheet(false)} title="گزینه‌های مرتب‌سازی">
            <p>پرفروش‌ترین · جدیدترین · ارزان‌ترین</p>
          </BottomSheet>
        </section>

        <section className={s.section}>
          <h2 className={s.heading}>بردکرامب و کاروسل</h2>
          <Breadcrumb items={[{ title: 'دیجی‌کیت', href: '/' }, { title: 'کالای دیجیتال', href: '/search?cat=digital' }, { title: 'موبایل' }]} />
          <ScrollCarousel arrows>
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} style={{ minWidth: 150 }}>
                <PlaceholderImage seed={100 + i} label={`کالا ${i + 1}`} />
              </div>
            ))}
          </ScrollCarousel>
        </section>
      </div>
    </ToastProvider>
  );
}
