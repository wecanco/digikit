'use client';

/* ─── فوتر — پورت footerHTML از partials.js (خطوط ۲۳۳-۳۲۶) ───
   ساختار (مطابق مرجع d01): نوار خدمات ۵تایی → ستون‌های لینک + خبرنامه/شبکه‌ها →
   نوار سرمه‌ای دریافت اپ → بلوک «درباره» + نشان‌های اعتماد → باند زیرنام‌ها →
   خط کپی‌رایت تک‌خطی وسط‌چین.
   هندسه عیناً از سورس: کانتینر ۱۳۵۲px، آیکون خدمات ۴۰px، دکمه خبرنامه bg-ink با
   گوشه‌های سمت استارت صفر، نشان اعتماد ۷۲×۸۸، باند زیرنام ۳/۵/۹ ستونه. */

import { useState, type FormEvent, type ReactElement } from 'react';
import {
  CircleDollarSign,
  Clock,
  Play,
  RotateCcw,
  Send,
  ShieldCheck,
  Smartphone,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import {
  FOOTER_ABOUT,
  FOOTER_ABOUT_MORE,
  FOOTER_ABOUT_TITLE,
  FOOTER_APP,
  FOOTER_COLS,
  FOOTER_COPYRIGHT,
  FOOTER_NEWSLETTER,
  FOOTER_SERVICES,
  FOOTER_SOCIALS,
  STORE_BADGES,
  SUB_BRANDS,
  TRUST_BADGES,
  type FooterCol,
  type FooterService,
  type FooterSocial,
  type ServiceIcon,
  type SocialId,
} from './data';
import { InstagramGlyph, LinkedinGlyph, TwitterGlyph } from './socials';
import styles from './styles.module.css';

/* آیکون‌های خطی خدمات — معادل lucide مسیرهای heroicons سورس (stroke 1.7) */
const SERVICE_ICONS: Record<ServiceIcon, LucideIcon> = {
  truck: Truck,
  clock: Clock,
  cash: CircleDollarSign,
  return: RotateCcw,
  shield: ShieldCheck,
};

type Glyph = (props: { size?: number }) => ReactElement;

/* آیکون‌های اجتماعی: برندها از socials.tsx، آپارات/تلگرام با Play/Send (مطابق ICONS.play/ICONS.send) */
const SOCIAL_GLYPHS: Record<SocialId, Glyph> = {
  instagram: InstagramGlyph,
  twitter: TwitterGlyph,
  linkedin: LinkedinGlyph,
  aparat: ({ size }) => <Play size={size} strokeWidth={1.7} aria-hidden="true" />,
  telegram: ({ size }) => <Send size={size} strokeWidth={1.7} aria-hidden="true" />,
};

export interface FooterProps {
  /** نوار خدمات بالای فوتر — پیش‌فرض FOOTER_SERVICES */
  services?: FooterService[];
  /** ستون‌های لینک — پیش‌فرض FOOTER_COLS */
  cols?: FooterCol[];
  /** شبکه‌های اجتماعی کنار خبرنامه — پیش‌فرض FOOTER_SOCIALS */
  socials?: FooterSocial[];
  /** متن «درباره دیجی‌کیت» — پیش‌فرض FOOTER_ABOUT */
  about?: string;
  /** باند زیرنام‌ها — پیش‌فرض SUB_BRANDS */
  subBrands?: string[];
  /** نشان‌های دریافت اپ — پیش‌فرض STORE_BADGES */
  storeBadges?: string[];
  /** نشان‌های اعتماد — پیش‌فرض TRUST_BADGES */
  trustBadges?: string[];
  /** حل‌کننده‌ی مقصد لینک‌های متنی فوتر؛ لینک ناشناخته به خانه می‌رود. */
  linkResolver?(label: string): string | undefined;
  className?: string;
}

const DEFAULT_LINKS: Record<string, string> = {
  'اتاق خبر دیجی‌کیت': '/mag',
  'فروش در دیجی‌کیت': '/sell',
  'فرصت‌های شغلی': '/kit#about',
  'گزارش تخلف در دیجی‌کیت': '/kit#states',
  'تماس با دیجی‌کیت': '/kit#about',
  'درباره دیجی‌کیت': '/kit#about',
  'پاسخ به پرسش‌های متداول': '/kit#states',
  'رویه‌های بازگرداندن کالا': '/kit#checkout',
  'شرایط استفاده': '/kit#states',
  'حریم خصوصی': '/kit#states',
  'گزارش باگ': '/kit#states',
  'پیگیری سفارش': '/profile',
  'نحوه ثبت سفارش': '/checkout',
  'رویه ارسال سفارش': '/checkout',
  'شیوه‌های پرداخت': '/checkout',
  'خرید اقساطی': '/search?installment=1',
};

export function Footer({
  services = FOOTER_SERVICES,
  cols = FOOTER_COLS,
  socials = FOOTER_SOCIALS,
  about = FOOTER_ABOUT,
  subBrands = SUB_BRANDS,
  storeBadges = STORE_BADGES,
  trustBadges = TRUST_BADGES,
  linkResolver,
  className,
}: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  /* معادل data-newsletter دموی وانیلا: submit → پاک فرم + پیام موفقیت */
  const onNewsletterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setEmail('');
    setSubscribed(true);
  };

  const resolveLabel = (item: string | { label: string; href: string }) => typeof item === 'string' ? item : item.label;
  const resolveLink = (item: string | { label: string; href: string }) => typeof item === 'string'
    ? linkResolver?.(item) || DEFAULT_LINKS[item] || '/'
    : item.href;

  return (
    <footer className={[styles.footer, className].filter(Boolean).join(' ')}>
      {/* نوار خدمات: پنج آیکون خطی ۴۰px با کپشن دو خطی + خط نازک زیر آن */}
      <div className={styles.container}>
        <div className={styles.services}>
          {services.map((s) => {
            const Icon = SERVICE_ICONS[s.icon];
            return (
              <div className={styles.service} key={s.l1}>
                <span className={styles.serviceIcon}>
                  <Icon size={40} strokeWidth={1.7} aria-hidden="true" />
                </span>
                <span className={styles.serviceTexts}>
                  <span className={styles.serviceL1}>{s.l1}</span>
                  <span className={styles.serviceL2}>{s.l2}</span>
                </span>
              </div>
            );
          })}
        </div>

        {/* ستون‌های لینک (۳ ستون) + ستون خبرنامه با شبکه‌های اجتماعی */}
        <div className={styles.cols}>
          {cols.map((col) => (
            <div key={col.title}>
              <p className={styles.colTitle}>{col.title}</p>
              <ul className={styles.colLinks}>
                {col.links.map((l) => (
                  <li key={resolveLabel(l)}>
                    <a href={resolveLink(l)} className={styles.colLink}>{resolveLabel(l)}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className={styles.colTitle}>{FOOTER_NEWSLETTER.title}</p>
            <form className={styles.newsForm} onSubmit={onNewsletterSubmit}>
              <input
                type="email"
                className={styles.newsInput}
                placeholder={FOOTER_NEWSLETTER.placeholder}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSubscribed(false);
                }}
                aria-label={FOOTER_NEWSLETTER.placeholder}
              />
              <button type="submit" className={styles.newsBtn}>
                {FOOTER_NEWSLETTER.submitLabel}
              </button>
            </form>
            {subscribed && (
              <p className={styles.newsSuccess} role="status">{FOOTER_NEWSLETTER.successMessage}</p>
            )}
            <div className={styles.socials}>
              {socials.map((s) => {
                const Glyph = SOCIAL_GLYPHS[s.id];
                return s.href ? <a key={s.id} href={s.href} className={styles.socialLink} aria-label={s.label} rel="noreferrer"><Glyph size={s.size} /></a> : <span key={s.id} className={styles.socialLink} aria-label={s.label}><Glyph size={s.size} /></span>;
              })}
            </div>
          </div>
        </div>
      </div>

      {/* نوار سرمه‌ای دریافت اپ: عنوان + کاشی قرمز آیکون در استارت، نشان‌ها + «…» در انتها */}
      <div className={styles.container}>
        <div className={styles.appBar}>
          <div className={styles.appLead}>
            <span className={styles.appIconTile}>
              <Smartphone size={24} strokeWidth={1.7} aria-hidden="true" />
            </span>
            <div>
              <p className={styles.appTitle}>{FOOTER_APP.title}</p>
              <p className={styles.appSub}>{FOOTER_APP.subtitle}</p>
            </div>
          </div>
          <div className={styles.appBadges}>
            {storeBadges.map((b) => (
              <span key={b} className={styles.appBadge}>{b}</span>
            ))}
            <span className={`${styles.appBadge} ${styles.appBadgeMore}`} aria-label={FOOTER_APP.moreLabel}>
              {FOOTER_APP.moreText}
            </span>
          </div>
        </div>
      </div>

      {/* بلوک درباره + کارت‌های نشان اعتماد (۷۲×۸۸ با آیکون سپر ۳۲px) */}
      <div className={styles.container}>
        <div className={styles.trustBand}>
          <div className={styles.about}>
            <p className={styles.aboutTitle}>{FOOTER_ABOUT_TITLE}</p>
            <p className={styles.aboutText}>{about}</p>
            <a href="/kit#about" className={styles.aboutMore}>{FOOTER_ABOUT_MORE}</a>
          </div>
          <div className={styles.seals}>
            {trustBadges.map((t) => (
              <span key={t} className={styles.seal}>
                <span className={styles.sealIcon}>
                  <ShieldCheck size={32} strokeWidth={1.7} aria-hidden="true" />
                </span>
                <span className={styles.sealLabel}>{t}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* باند زیرنام‌ها: ۳ ستون موبایل / ۵ تبلت / ۹ دسکتاپ با جداکننده نازک انتها */}
      <div className={styles.container}>
        <div className={styles.brandBand}>
          {subBrands.map((b) => (
            <a key={b} href={`/search?q=${encodeURIComponent(b)}`} className={styles.brand}>{b}</a>
          ))}
        </div>
      </div>

      {/* نوار پایانی: خط کپی‌رایت وسط‌چین */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomInner}>
          <p className={styles.copyright}>{FOOTER_COPYRIGHT}</p>
        </div>
      </div>
    </footer>
  );
}
