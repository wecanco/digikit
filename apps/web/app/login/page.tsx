'use client';

import { FormEvent, useState } from 'react';
import { Button, Card, FormField, Input, Layout, ToastProvider, useUser } from '@digikit/ui';
import s from '../showcase.module.css';

function LoginContent() {
  const { login } = useUser();
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (identifier.trim().length < 3) {
      setError('شماره موبایل یا ایمیل را کامل وارد کنید.');
      return;
    }
    login('کاربر دیجی‌کیت', identifier.trim());
    window.location.href = '/profile';
  };
  return <Layout><div className={s.page}><Card padding="lg" className={s.panel}><div className={s.sectionHead}><div><h1>ورود به دیجی‌کیت</h1><p className={s.muted}>برای ادامه شماره موبایل یا ایمیل خود را وارد کنید.</p></div></div><form className={s.stack} onSubmit={submit}><FormField label="شماره موبایل یا ایمیل" required error={error} hint="کد تأیید در مرحله‌ی بعد ارسال می‌شود."><Input value={identifier} onChange={(event) => { setIdentifier(event.target.value); setError(''); }} placeholder="مثلاً ۰۹۱۲۱۲۳۴۵۶۷" autoComplete="username" /></FormField><Button type="submit" size="lg" fullWidth>ادامه</Button></form></Card></div></Layout>;
}

export default function LoginPage() {
  return <ToastProvider><LoginContent /></ToastProvider>;
}
