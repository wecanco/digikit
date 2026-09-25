'use client';

import { FormEvent, useState } from 'react';
import { Button, FormField, HeroBanner, Input, Layout, ToastProvider, useToast } from '@digikit/ui';
import s from '../showcase.module.css';

function SellContent() {
  const toast = useToast();
  const [name, setName] = useState('');
  const submit = (event: FormEvent) => { event.preventDefault(); toast.show(name.trim() ? 'درخواست همکاری شما ثبت شد' : 'نام فروشگاه را وارد کنید', name.trim() ? 'success' : 'error'); };
  return <Layout active="sell"><div className={s.page}><HeroBanner eyebrow="فروشنده شوید" title="فروشگاهتان را به میلیون‌ها مشتری معرفی کنید" description="ابزارهای حرفه‌ای دیجی‌کیت برای مدیریت کالا، سفارش و رشد فروش." actionLabel="شروع همکاری" onAction={() => document.getElementById('seller-form')?.scrollIntoView({ behavior: 'smooth' })} tone="dark" /><form id="seller-form" className={s.panel} onSubmit={submit}><h2>درخواست همکاری</h2><FormField label="نام فروشگاه" required hint="نامی که مشتریان شما می‌بینند."><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="مثلاً فروشگاه نمونه" /></FormField><Button type="submit">ثبت درخواست</Button></form></div></Layout>;
}

export default function SellPage() { return <ToastProvider><SellContent /></ToastProvider>; }
