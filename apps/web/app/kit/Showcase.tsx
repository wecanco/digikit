'use client';

import { useEffect, useState } from 'react';
import { ArrowUp, Bell, Check, ChevronLeft, Copy, Heart, MoreVertical, Search, ShoppingCart, SlidersHorizontal, Sparkles, UserRound } from 'lucide-react';
import {
  Accordion,
  AddressCard,
  Alert,
  Avatar,
  BadgeCircle,
  BannerCarousel,
  BrandCard,
  Button,
  Card,
  CartItem,
  CartPreview,
  CartSummary,
  CategoryCard,
  CategoryList,
  Checkbox,
  CheckoutSteps,
  Chip,
  CouponField,
  DataTable,
  Divider,
  DropdownMenu,
  EmptyState,
  ErrorState,
  FilterSidebar,
  FormField,
  HeroBanner,
  IconButton,
  Input,
  OrderStatus,
  OrderCard,
  OrdersSummary,
  Pagination,
  PlaceholderImage,
  Price,
  ProductGallery,
  ProductGrid,
  ProductInfo,
  ProductSpecs,
  Progress,
  RadioGroup,
  Rating,
  ReviewSummary,
  ReviewCard,
  Select,
  SellerCard,
  ShippingMethod,
  SortBar,
  Spinner,
  Switch,
  Tabs,
  Textarea,
  ToastProvider,
  Tooltip,
  useToast,
  useCart,
  type CartLine,
} from '@digikit/ui';
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from '../../lib/demo';
import s from './kit.module.css';

const showcaseSections = [
  { id: 'foundations', label: 'پایه‌ها' },
  { id: 'forms', label: 'فرم‌ها' },
  { id: 'commerce', label: 'تجارت' },
  { id: 'product', label: 'محصول' },
  { id: 'reference', label: 'الگوهای مرجع' },
  { id: 'checkout', label: 'چک‌اوت' },
  { id: 'states', label: 'وضعیت‌ها' },
] as const;

const sortOptions = [
  { value: 'popular', label: 'پرفروش‌ترین' },
  { value: 'newest', label: 'جدیدترین' },
  { value: 'cheap', label: 'ارزان‌ترین' },
  { value: 'discount', label: 'بیشترین تخفیف' },
];

const filters = [
  { id: 'brand', title: 'برند', options: [{ id: 'samsung', label: 'سامسونگ', count: 128 }, { id: 'apple', label: 'اپل', count: 84 }, { id: 'xiaomi', label: 'شیائومی', count: 61 }] },
  { id: 'availability', title: 'وضعیت موجودی', options: [{ id: 'in-stock', label: 'فقط کالاهای موجود', count: 216 }] },
  { id: 'price', title: 'محدوده قیمت' },
];

const tableRows: Record<string, unknown>[] = [
  { id: '۱۲۳۴۵', customer: 'سارا احمدی', amount: '۶۱٬۹۹۰٬۰۰۰', status: 'delivered' },
  { id: '۱۲۳۴۶', customer: 'مهدی رضایی', amount: '۹٬۴۹۰٬۰۰۰', status: 'processing' },
  { id: '۱۲۳۴۷', customer: 'نگار محمدی', amount: '۲٬۴۵۰٬۰۰۰', status: 'shipped' },
];

interface SectionLinksProps {
  activeSection: string;
  className: string;
  linkClassName: string;
  activeLinkClassName: string;
  onSelect(id: string): void;
}

function SectionLinks({ activeSection, className, linkClassName, activeLinkClassName, onSelect }: SectionLinksProps) {
  return (
    <nav className={className} aria-label="بخش‌های ویترین">
      {showcaseSections.map((section) => {
        const active = activeSection === section.id;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={[linkClassName, active && activeLinkClassName].filter(Boolean).join(' ')}
            aria-current={active ? 'location' : undefined}
            onClick={() => onSelect(section.id)}
          >
            {section.label}
          </a>
        );
      })}
    </nav>
  );
}

function ToastActions() {
  const toast = useToast();
  return (
    <div className={s.inline}>
      <Button size="sm" onClick={() => toast.show('کالا با موفقیت به سبد اضافه شد', 'success')} startIcon={<ShoppingCart size={15} aria-hidden="true" />}>
        نمایش توست
      </Button>
      <Button size="sm" variant="outline" onClick={() => toast.show('این یک پیام اطلاع‌رسانی است', 'info')}>
        پیام اطلاع‌رسانی
      </Button>
    </div>
  );
}

export default function ShowcasePage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeSection, setActiveSection] = useState('foundations');
  const [showTop, setShowTop] = useState(false);
  const [quantity, setQuantity] = useState(2);
  const [sort, setSort] = useState('popular');
  const [tab, setTab] = useState('overview');
  const [radio, setRadio] = useState('standard');
  const [selectedAddress, setSelectedAddress] = useState('home');
  const [coupon, setCoupon] = useState('');
  const [page, setPage] = useState(2);
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({ brand: ['samsung'] });
  const [filterOpen, setFilterOpen] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const cart = useCart();
  const product = DEMO_PRODUCTS[0];
  const cartLine: CartLine = { product, qty: quantity, selectedColor: '#111827', selectedVariant: '۲۵۶ گیگابایت' };

  useEffect(() => {
    const elements = showcaseSections
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top);
        const next = visible[0]?.target as HTMLElement | undefined;
        if (next) setActiveSection(next.id);
      },
      { rootMargin: '-104px 0px -58% 0px', threshold: [0, 0.2] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => setShowTop(window.scrollY > 560);
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  const selectSection = (id: string) => setActiveSection(id);

  return (
    <ToastProvider>
      <div className={s.shell} data-theme={theme}>
        <a className={s.skipLink} href="#showcase-content">پرش به محتوای اصلی</a>

        <header className={s.showcaseHeader}>
          <div className={s.headerInner}>
            <a className={s.brand} href="#showcase-top" aria-label="بازگشت به ابتدای ویترین">
              <span className={s.brandName}>دیجی‌کیت</span>
              <span className={s.brandMeta} dir="ltr">UI KIT</span>
            </a>
            <SectionLinks
              activeSection={activeSection}
              className={s.headerNav}
              linkClassName={s.headerLink}
              activeLinkClassName={s.headerLinkActive}
              onSelect={selectSection}
            />
            <div className={s.headerActions}>
              <span className={s.headerStatus}><Chip tone="success"><Check size={14} aria-hidden="true" /> آماده استفاده</Chip></span>
              <Button
                size="sm"
                variant="secondary"
                startIcon={theme === 'light' ? <Sparkles size={15} aria-hidden="true" /> : <Bell size={15} aria-hidden="true" />}
                aria-pressed={theme === 'dark'}
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? 'حالت تاریک' : 'حالت روشن'}
              </Button>
            </div>
          </div>
        </header>

        <main id="showcase-content" className={s.page}>
          <div className={s.topbar} id="showcase-top">
            <div className={s.introCopy}>
              <span className={`${s.kicker} ${s.technical}`} dir="ltr">@digikit/ui · React 19 · TypeScript strict</span>
              <h1>ویترین سیستم طراحی دیجی‌کیت</h1>
              <p>یک کیت یکپارچه برای فروشگاه، محصول، سبد خرید، چک‌اوت و پنل‌های عملیاتی؛ با RTL واقعی، توکن‌های معنایی و قراردادهای قابل ترکیب.</p>
            </div>
          </div>

          <HeroBanner
            className={s.hero}
            eyebrow="راهنمای تعاملی کامپوننت‌ها"
            title="یک زبان مشترک برای تجربه‌های RTL"
            description="پایه‌های بصری، فرم‌ها، الگوهای فروشگاهی و جریان پرداخت را در یک ویترین قابل‌تعامل بررسی کنید."
            actionLabel="رفتن به تجارت و محصول"
            href="#commerce"
            tone="primary"
            image={<PlaceholderImage seed="kit-hero" label="DigiKit" ratio="16:9" />}
          />

          <SectionLinks
            activeSection={activeSection}
            className={s.toc}
            linkClassName={s.tocLink}
            activeLinkClassName={s.tocLinkActive}
            onSelect={selectSection}
          />

          <section className={s.section} id="foundations">
            <div className={s.sectionHead}>
              <div><span className={s.kicker}>پایه‌ها</span><h2>پایه‌های بصری و تعامل</h2></div>
              <span className={s.count}>توکن، وضعیت، بازخورد</span>
            </div>
            <div className={s.grid4}>
              <Card><div className={s.label}>دکمه‌ها</div><div className={s.inline}><Button size="sm">اصلی</Button><Button size="sm" variant="secondary">ثانویه</Button><Button size="sm" variant="outline">خطی</Button><Button size="sm" variant="ghost">شبح</Button><Button size="sm" variant="danger">حذف</Button></div></Card>
              <Card><div className={s.label}>اکشن‌ها</div><div className={s.inline}><IconButton label="اعلان‌ها" variant="primary"><Bell size={17} aria-hidden="true" /></IconButton><IconButton label="علاقه‌مندی"><Heart size={17} aria-hidden="true" /></IconButton><Tooltip content="کپی شناسه" side="top"><IconButton label="کپی"><Copy size={17} aria-hidden="true" /></IconButton></Tooltip><DropdownMenu trigger={<MoreVertical size={18} aria-hidden="true" />} items={[{ id: 'edit', label: 'ویرایش', icon: <UserRound size={15} aria-hidden="true" /> }, { id: 'delete', label: 'حذف', danger: true }]} /></div></Card>
              <Card><div className={s.label}>قیمت و امتیاز</div><div className={s.stack}><Price price={61990000} oldPrice={67990000} size="lg" /><Rating rating={4.6} count={2541} /><div className={s.inline}><BadgeCircle discount={35} /><Chip tone="success">ارسال رایگان</Chip><Chip tone="warning">محدود</Chip></div></div></Card>
              <Card><div className={s.label}>لودینگ و پیشرفت</div><div className={s.stack}><div className={s.inline}><Spinner size={20} /><Spinner size={32} /><span className={s.muted}>در حال بارگذاری...</span></div><Progress value={72} label="تکمیل پروفایل" showValue tone="success" /></div></Card>
            </div>
            <div className={s.alertGrid}><Alert tone="success" title="عملیات موفق">کد تخفیف روی سفارش شما اعمال شد.</Alert><Alert tone="warning" title="توجه">این کالا فقط ۳ عدد موجود دارد.</Alert><Alert tone="danger" title="خطا" action={<Button size="sm" variant="ghost">تلاش دوباره</Button>}>ارتباط با سرویس پرداخت برقرار نشد.</Alert></div>
            <div className={s.feedbackDemo}><div><span className={s.label}>پیام‌های بازخورد</span><p className={s.muted}>توست‌ها برای تأیید عملیات و اطلاع‌رسانی لحظه‌ای استفاده می‌شوند.</p></div><ToastActions /></div>
          </section>

          <section className={s.section} id="forms">
            <div className={s.sectionHead}><div><span className={s.kicker}>کنترل‌های فرم</span><h2>فرم‌ها و کنترل‌های ورودی</h2></div></div>
            <Card>
              <div className={s.formGrid}>
                <FormField label="جستجوی کالا" hint="نام، برند یا شناسه کالا را وارد کنید."><Input placeholder="مثلاً آیفون ۱۵" startAdornment={<Search size={17} aria-hidden="true" />} /></FormField>
                <FormField label="دسته‌بندی" required><Select placeholder="انتخاب دسته‌بندی" options={DEMO_CATEGORIES.slice(0, 4).map((item) => ({ value: item.id, label: item.title }))} /></FormField>
                <FormField label="توضیحات"><Textarea placeholder="توضیحات تکمیلی سفارش..." /></FormField>
                <div className={s.controlGroup}><span className={s.label}>انتخاب‌ها</span><Checkbox defaultChecked label="ارسال سریع" description="تحویل در همان روز" /><Switch defaultChecked label="ذخیره اطلاعات برای خرید بعدی" /><RadioGroup name="kit-radio" value={radio} onChange={setRadio} options={[{ value: 'standard', label: 'ارسال عادی', description: '۲ تا ۳ روز کاری' }, { value: 'express', label: 'ارسال سریع', description: 'تحویل امروز' }]} /></div>
              </div>
            </Card>
            <div className={s.split}>
              <Card><div className={s.label}>تب‌ها و جداکننده</div><Tabs items={[{ id: 'overview', title: 'نمای کلی' }, { id: 'specs', title: 'مشخصات' }, { id: 'reviews', title: 'دیدگاه‌ها' }]} active={tab} onChange={setTab} /><Divider>یا</Divider><div className={s.muted}>محتوای فعال: {tab}</div></Card>
              <Card><div className={s.label}>آکاردئون</div><Accordion items={[{ id: 'delivery', title: 'ارسال سفارش چگونه انجام می‌شود؟', content: 'سفارش‌ها پس از تأیید پرداخت، بسته‌بندی و بر اساس روش انتخابی ارسال می‌شوند.' }, { id: 'return', title: 'شرایط بازگشت کالا چیست؟', content: 'تا ۷ روز پس از دریافت، در صورت رعایت شرایط، امکان ثبت درخواست بازگشت وجود دارد.' }]} defaultOpen={['delivery']} /></Card>
            </div>
          </section>

          <section className={s.section} id="commerce">
            <div className={s.sectionHead}><div><span className={s.kicker}>تجارت و محصول</span><h2>الگوهای فروشگاهی و محصول</h2></div><a href="/search" className={s.link}>مشاهده همه <ChevronLeft size={15} aria-hidden="true" /></a></div>
            <div className={s.categoryGrid}>{DEMO_CATEGORIES.slice(0, 6).map((category) => <CategoryCard key={category.id} category={category} count={128} href={`/search?cat=${category.id}`} />)}</div>
            <div className={s.brandGrid}><BrandCard name="سامسونگ" count={128} featured href="/search?brand=samsung" /><BrandCard name="اپل" count={84} href="/search?brand=apple" /><BrandCard name="شیائومی" count={61} href="/search?brand=xiaomi" /><BrandCard name="سونی" count={42} href="/search?brand=sony" /><BrandCard name="اسنوا" count={36} href="/search?brand=snova" /></div>
            <div className={s.mobileFilterBar}><span className={s.muted}>فیلتر و مرتب‌سازی نتایج</span><Button size="sm" variant="outline" startIcon={<SlidersHorizontal size={15} aria-hidden="true" />} onClick={() => setFilterOpen(true)}>فیلترها</Button></div>
            <div className={s.productLayout}><FilterSidebar sections={filters} values={filterValues} mobileOpen={filterOpen} onMobileClose={() => setFilterOpen(false)} onChange={(section, id, checked) => setFilterValues((current) => ({ ...current, [section]: checked ? [...(current[section] || []), id] : (current[section] || []).filter((item) => item !== id) }))} onClear={() => setFilterValues({})} /><div className={s.products}><SortBar value={sort} options={sortOptions} onChange={setSort} total={1248} /><ProductGrid products={DEMO_PRODUCTS.slice(0, 8)} variant="grid" columns={4} /></div></div>
            <HeroBanner eyebrow="پیشنهاد ویژه امروز" title="تا ۴۰٪ تخفیف روی کالاهای منتخب" description="تخفیف‌های محدود را از دست ندهید." actionLabel="خرید کنید" href="/search?sort=discount" tone="dark" image={<PlaceholderImage seed="amazing" label="٪" ratio="16:9" />} />
          </section>

          <section className={s.section} id="product">
            <div className={s.sectionHead}><div><span className={s.kicker}>جزئیات محصول</span><h2>صفحه محصول استاندارد</h2></div></div>
            <div className={s.productDetail}><ProductGallery images={[{ src: 'ph:201', label: 'S24 Ultra' }, { src: 'ph:202', label: 'نمای پشت' }, { src: 'ph:203', label: 'رنگ‌بندی' }]} favorite={favorite} onFavorite={() => setFavorite((current) => !current)} /><div className={s.productCopy}><ProductInfo product={product} colors={['مشکی', 'کرم', 'سبز']} sizes={['۱۲۸ گیگابایت', '۲۵۶ گیگابایت']} favorite={favorite} onFavorite={() => setFavorite((current) => !current)} onAddToCart={(count) => { cart.setQty(product.id, count); setQuantity(count); }} /><SellerCard seller={{ name: 'فروشگاه رسمی دیجی‌کیت', rating: 4.8, ratingCount: 1280, positiveRate: 96, location: 'تهران', verified: true }} onVisit={() => { window.location.href = '/products'; }} /></div></div>
            <div className={s.productLower}><ProductSpecs specs={[{ label: 'حافظه داخلی', value: '۲۵۶ گیگابایت', featured: true }, { label: 'فناوری صفحه‌نمایش', value: 'Dynamic AMOLED 2X' }, { label: 'ظرفیت باتری', value: '۵۰۰۰ میلی‌آمپرساعت' }, { label: 'اقلام همراه', value: 'دفترچه راهنما، کابل شارژ' }]} /><ReviewSummary rating={4.6} count={2541} distribution={{ 5: 1920, 4: 480, 3: 90, 2: 32, 1: 19 }} onWrite={() => { window.location.href = '/profile'; }} /></div>
          </section>

          <section className={s.section} id="reference">
            <div className={s.sectionHead}><div><span className={s.kicker}>الگوهای پورت‌شده</span><h2>الگوهای فروشگاهی و عملیاتی مرجع</h2></div><span className={s.count}>بدون API و state خارجی</span></div>
            <BannerCarousel items={[{ id: 'reference-banner-1', src: 'ph:reference-banner-1', alt: 'بنر پیشنهاد ویژه', href: '/products' }, { id: 'reference-banner-2', src: 'ph:reference-banner-2', alt: 'بنر کالای دیجیتال', href: '/products' }]} autoplay={false} />
            <div className={s.split}><CategoryList title="دسته‌بندی‌های محبوب" items={[{ id: 'mobile', name: 'موبایل', image: 'ph:reference-mobile', href: '/products' }, { id: 'laptop', name: 'لپ‌تاپ', image: 'ph:reference-laptop', href: '/products' }, { id: 'audio', name: 'هدفون', image: 'ph:reference-audio', href: '/products' }]} /><div className={s.stack}><OrdersSummary pending={3} delivered={12} total={15} /><OrderCard order={{ id: '۱۲۳۴۵', status: 'processing', total: 61990000, date: '۱۴۰۵/۰۶/۲۴', customer: 'سارا احمدی', items: [{ id: 'phone', title: 'گوشی موبایل', image: 'ph:reference-order-phone', quantity: 1 }, { id: 'case', title: 'قاب موبایل', image: 'ph:reference-order-case', quantity: 2 }] }} /></div></div>
            <div className={s.split}><Card><ReviewCard review={{ id: 'reference-review', title: 'تجربه خوب از محصول', rating: 5, comment: 'کیفیت ساخت و سرعت ارسال رضایت‌بخش بود.', status: 'approved', date: '۱۴۰۵/۰۶/۲۴', userName: 'سارا احمدی', product: { title: 'گوشی موبایل سامسونگ', image: 'ph:reference-review-phone' }, positivePoints: [{ id: 'quality', title: 'کیفیت ساخت بالا' }] }} /></Card><CartPreview items={[cartLine]} totalDiscount={product.price * quantity * .08} onQuantityChange={(_, nextQuantity) => setQuantity(nextQuantity)} onRemove={() => setQuantity(1)} onCheckout={() => { window.location.href = '/checkout'; }} /></div>
          </section>

          <section className={s.section} id="checkout">
            <div className={s.sectionHead}><div><span className={s.kicker}>سبد و پرداخت</span><h2>سبد خرید و چک‌اوت</h2></div></div>
            <CheckoutSteps current="shipping" steps={[{ id: 'cart', title: 'سبد خرید' }, { id: 'shipping', title: 'آدرس و ارسال' }, { id: 'payment', title: 'پرداخت' }]} />
            <div className={s.cartLayout}><Card><CartItem item={cartLine} onQuantityChange={setQuantity} onRemove={() => setQuantity(1)} onSave={() => setQuantity(1)} /><CouponField value={coupon} onApply={setCoupon} appliedCode={coupon || undefined} onRemove={() => setCoupon('')} /></Card><CartSummary itemsCount={quantity} subtotal={product.price * quantity} discount={product.price * quantity * .08} freeShippingThreshold={70000000} onCheckout={() => { window.location.href = '/checkout'; }} /></div>
            <div className={s.checkoutGrid}><div className={s.addresses}><AddressCard address={{ id: 'home', title: 'خانه', recipient: 'سارا احمدی', phone: '۰۹۱۲۱۲۳۴۵۶۷', province: 'تهران', city: 'تهران', details: 'خیابان ولیعصر، کوچه یاس، پلاک ۱۲', postalCode: '۱۲۳۴۵۶۷۸۹۰', isDefault: true }} selected={selectedAddress === 'home'} onSelect={() => setSelectedAddress('home')} /><AddressCard address={{ id: 'office', title: 'محل کار', recipient: 'سارا احمدی', province: 'تهران', city: 'تهران', details: 'میدان ونک، خیابان ملاصدرا' }} selected={selectedAddress === 'office'} onSelect={() => setSelectedAddress('office')} /></div><div className={s.shippingBox}><ShippingMethod name="shipping" value={radio} onChange={setRadio} options={[{ id: 'standard', title: 'ارسال عادی', description: 'تحویل تا ۳ روز کاری', price: 0 }, { id: 'express', title: 'ارسال سریع', description: 'تحویل امروز تا ساعت ۲۲', price: 89000 }]} /></div></div>
          </section>

          <section className={s.section} id="states">
            <div className={s.sectionHead}><div><span className={s.kicker}>وضعیت‌ها و داده‌ها</span><h2>وضعیت‌ها و داده‌های عملیاتی</h2></div></div>
            <div className={s.stateGrid}><Card><EmptyState title="لیست علاقه‌مندی خالی است" description="کالاهای مورد علاقه‌تان را اینجا ذخیره کنید." actionLabel="مشاهده محصولات" onAction={() => { window.location.href = '/favorites'; }} /></Card><Card><ErrorState title="بارگذاری ناموفق بود" description="اتصال شما را بررسی و دوباره تلاش کنید." onRetry={() => window.location.reload()} /></Card></div>
            <Card><div className={s.tableHead}><div><strong>آخرین سفارش‌ها</strong><span>آخرین وضعیت سفارش‌های مشتریان</span></div><span className={s.tableMeta}>۳ سفارش نمونه</span></div><DataTable columns={[{ key: 'id', title: 'شماره سفارش' }, { key: 'customer', title: 'مشتری' }, { key: 'amount', title: 'مبلغ' }, { key: 'status', title: 'وضعیت', render: (value) => <OrderStatus status={value as 'delivered' | 'processing' | 'shipped'} compact /> }, { key: 'action', title: 'عملیات', render: () => <IconButton label="عملیات بیشتر" size="sm" variant="ghost" onClick={() => { window.location.href = '/profile'; }}><MoreVertical size={16} aria-hidden="true" /></IconButton> }]} rows={tableRows} /><div className={s.tableFoot}><span className={s.muted}>نمایش ۳ از ۱۲۸ سفارش</span><Pagination page={page} totalPages={8} onChange={setPage} /></div></Card>
          </section>
        </main>

        {showTop && <button type="button" className={s.topButton} aria-label="بازگشت به بالای ویترین" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><ArrowUp size={16} aria-hidden="true" /><span>بالا</span></button>}

        <footer className={s.footer} id="showcase-about">
          <div><strong>دیجی‌کیت UI</strong><span>سیستم طراحی یکپارچه برای محصول دیجیتال فارسی</span></div>
          <div className={s.footerActions}><div className={s.inline}><Avatar name="دیجی‌کیت" size="sm" status="online" /><span className={s.muted}>ساخته‌شده برای RTL و دسترس‌پذیری</span></div><a href="#showcase-top" className={s.footerLink}>بازگشت به بالا <ChevronLeft size={15} aria-hidden="true" /></a></div>
        </footer>
      </div>
    </ToastProvider>
  );
}
