import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowUpLeft,
  BookOpen,
  Boxes,
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  CircleUserRound,
  CreditCard,
  FileCog,
  Heart,
  LayoutDashboard,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  Tags,
  UserRoundPlus,
} from 'lucide-react';
import s from './home.module.css';

interface HubTile {
  href: string;
  title: string;
  description: string;
  meta: string;
  icon: ReactNode;
  tone: 'red' | 'blue' | 'green' | 'purple' | 'cream';
  featured?: boolean;
}

interface HubGroup {
  eyebrow: string;
  title: string;
  description: string;
  tiles: HubTile[];
}

const hubGroups: HubGroup[] = [
  {
    eyebrow: 'BUILD & DOCUMENT',
    title: 'ساخت، مشاهده و مدیریت سیستم',
    description: 'از componentها و الگوهای UI تا ساخت صفحه‌ی قابل خروجی، همه در یک مسیر روشن.',
    tiles: [
      { href: '/kit', title: 'راهنمای کامپوننت‌ها', description: 'تمام exportهای UI را با کنترل زنده، جستجو و کد آماده ببین.', meta: 'UI KIT · INTERACTIVE', icon: <BookOpen size={20} />, tone: 'blue', featured: true },
      { href: '/kit/showcase', title: 'ویترین جامع کیت', description: 'سناریوهای فرم، محصول، checkout، وضعیت‌ها و الگوهای ترکیبی.', meta: 'FULL SHOWCASE', icon: <Boxes size={20} />, tone: 'purple' },
      { href: '/builder/dashboard', title: 'داشبورد صفحه‌ساز', description: 'صفحه‌ها، قالب‌ها، backup و workspace محلی را مدیریت کن.', meta: 'LOCAL WORKSPACE', icon: <LayoutDashboard size={20} />, tone: 'red', featured: true },
      { href: '/builder', title: 'صفحه‌ساز', description: 'ماژول‌ها را بکش، بچین، responsive کن و JSON، TSX یا HTML بگیر.', meta: 'DRAG & DROP', icon: <FileCog size={20} />, tone: 'green' },
    ],
  },
  {
    eyebrow: 'SHOPPING EXPERIENCE',
    title: 'ویترین‌ها و جریان‌های خرید',
    description: 'صفحه‌ی نمونه‌ی فروشگاه را از اینجا باز کن یا هر مرحله‌ی تجربه‌ی خرید را جدا ببین.',
    tiles: [
      { href: '/shop', title: 'پوسته‌ی فروشگاهی', description: 'هدر، خدمات، کمپین، پیشنهاد ویژه و گرید کالا در یک پوسته‌ی کامل.', meta: 'CANONICAL SHOP SHELL', icon: <Store size={20} />, tone: 'red', featured: true },
      { href: '/products', title: 'کارت‌های کالا', description: 'گرید ساده، bare grid، شگفت‌انگیز، سوپرمارکت و حالت ردیفی.', meta: 'PRODUCT CARDS', icon: <ShoppingBag size={20} />, tone: 'cream' },
      { href: '/product', title: 'صفحه‌ی محصول', description: 'گالری، مشخصات، انتخاب‌ها، قیمت و افزودن به سبد را تجربه کن.', meta: 'PRODUCT DETAIL', icon: <ChartNoAxesCombined size={20} />, tone: 'blue' },
      { href: '/search', title: 'جستجو و فیلتر', description: 'نتایج، فیلترهای فروشگاهی، sort bar و pagination.', meta: 'SEARCH FLOW', icon: <Search size={20} />, tone: 'purple' },
      { href: '/categories', title: 'دسته‌بندی‌ها', description: 'دسته‌های فروشگاهی با مسیر ورود به نتایج مرتبط.', meta: 'CATEGORIES', icon: <Tags size={20} />, tone: 'green' },
      { href: '/amazing', title: 'پیشنهاد شگفت‌انگیز', description: 'کمپین تخفیف با countdown و کارت‌های ویژه.', meta: 'CAMPAIGN', icon: <Sparkles size={20} />, tone: 'red' },
      { href: '/supermarket', title: 'سوپرمارکت', description: 'ویترین رنگی کالاهای روزمره و گرید مخصوص سوپرمارکت.', meta: 'SUPERMARKET', icon: <BriefcaseBusiness size={20} />, tone: 'cream' },
      { href: '/cart', title: 'سبد خرید', description: 'ویرایش اقلام، جمع سفارش و پیشنهادهای ادامه‌ی خرید.', meta: 'CART', icon: <ShoppingCart size={20} />, tone: 'blue' },
      { href: '/checkout', title: 'checkout', description: 'آدرس، روش ارسال، کد تخفیف و خلاصه‌ی پرداخت.', meta: 'CHECKOUT', icon: <CreditCard size={20} />, tone: 'green' },
    ],
  },
  {
    eyebrow: 'ACCOUNT & CONTENT',
    title: 'حساب کاربری، محتوا و همکاری',
    description: 'مسیرهای مکمل محصول را برای بررسی حالت‌های واقعی و empty stateها باز کن.',
    tiles: [
      { href: '/profile', title: 'پروفایل کاربر', description: 'اطلاعات کاربر، سفارش‌ها، آدرس‌ها و علاقه‌مندی‌ها.', meta: 'PROFILE', icon: <CircleUserRound size={20} />, tone: 'purple' },
      { href: '/favorites', title: 'علاقه‌مندی‌ها', description: 'لیست کالاهای ذخیره‌شده و حالت خالی آن.', meta: 'FAVORITES', icon: <Heart size={20} />, tone: 'red' },
      { href: '/login', title: 'ورود', description: 'فرم ورود local-first با اعتبارسنجی و پیام خطا.', meta: 'AUTH FLOW', icon: <UserRoundPlus size={20} />, tone: 'blue' },
      { href: '/sell', title: 'فروشنده شوید', description: 'بنر جذب فروشنده و فرم درخواست همکاری.', meta: 'SELLER FLOW', icon: <Building2 size={20} />, tone: 'green' },
      { href: '/mag', title: 'مجله', description: 'صفحه‌ی محتوایی با کارت‌ها و دسته‌بندی مطالب.', meta: 'MAGAZINE', icon: <BookOpen size={20} />, tone: 'cream' },
      { href: '/mag-post', title: 'مقاله', description: 'نمایش جزئیات یک مطلب و ساختار خواندن محتوا.', meta: 'ARTICLE', icon: <ArrowUpLeft size={20} />, tone: 'purple' },
    ],
  },
];

function HubTileCard({ tile }: { tile: HubTile }) {
  return (
    <Link className={`${s.tile} ${s[`tile${tile.tone[0].toUpperCase()}${tile.tone.slice(1)}`]} ${tile.featured ? s.tileFeatured : ''}`} href={tile.href}>
      <span className={s.tileIcon} aria-hidden="true">{tile.icon}</span>
      <span className={s.tileBody}><span className={s.tileMeta}>{tile.meta}</span><strong>{tile.title}</strong><span className={s.tileDescription}>{tile.description}</span></span>
      <ArrowUpLeft size={17} className={s.tileArrow} aria-hidden="true" />
    </Link>
  );
}

export default function HomePage() {
  const totalTiles = hubGroups.reduce((total, group) => total + group.tiles.length, 0);

  return (
    <main className={s.home}>
      <header className={s.header}>
        <Link href="/" className={s.brand} aria-label="صفحه‌ی اصلی دیجی‌کیت"><span className={s.brandMark}>د</span><span><strong>دیجی‌کیت</strong><small>RTL PRODUCT SYSTEM</small></span></Link>
        <div className={s.headerActions}><span className={s.localBadge}><span /> بدون API · local-first</span><Link href="/shop" className={s.headerLink}>باز کردن فروشگاه <ArrowUpLeft size={15} /></Link></div>
      </header>

      <section className={s.hero}>
        <div className={s.heroCopy}><span className={s.eyebrow}>DIGIKIT DIRECTORY</span><h1>همه‌ی تجربه‌ها، یک خانه‌ی ساده.</h1><p>یک هاب کاشی‌محور برای دیدن سیستم طراحی، صفحات نمونه، جریان‌های خرید و صفحه‌ساز محلی؛ هر مسیر را مستقیم باز کن.</p><div className={s.heroActions}><Link href="/shop" className={s.primaryAction}><Store size={16} />پوسته‌ی فروشگاهی</Link><Link href="/builder/dashboard" className={s.secondaryAction}><LayoutDashboard size={16} />مدیریت صفحات</Link></div></div>
        <div className={s.heroPanel}><div className={s.heroPanelTop}><span className={s.heroPanelLabel}>یک نقطه‌ی شروع</span><span className={s.heroPanelDot} /></div><strong>{totalTiles.toLocaleString('fa-IR')} مسیر آماده</strong><span>از component خام تا checkout کامل، بدون گم‌شدن بین routeها.</span><div className={s.heroPanelGrid}><span><b>۳</b><small>گروه اصلی</small></span><span><b>۱۰۰٪</b><small>محلی و مستقل</small></span></div></div>
      </section>

      <nav className={s.groupList} aria-label="بخش‌های دیجی‌کیت">
        {hubGroups.map((group) => <section className={s.group} key={group.eyebrow}><div className={s.groupHeading}><div><span className={s.eyebrow}>{group.eyebrow}</span><h2>{group.title}</h2></div><p>{group.description}</p></div><div className={s.tileGrid}>{group.tiles.map((tile) => <HubTileCard key={tile.href} tile={tile} />)}</div></section>)}
      </nav>

      <footer className={s.footer}><span>دیجی‌کیت · ویترین RTL برای محصولات فارسی</span><div><Link href="/kit">راهنمای UI</Link><Link href="/builder">صفحه‌ساز</Link><Link href="/shop">فروشگاه نمونه</Link></div></footer>
    </main>
  );
}
