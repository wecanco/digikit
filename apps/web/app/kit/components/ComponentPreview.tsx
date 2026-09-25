'use client';

import { Component, createElement, type ErrorInfo, type ReactNode } from 'react';
import { Bell, Check, Heart, MoreVertical, ShoppingCart } from 'lucide-react';
import {
  Button,
  Card,
  FilterSidebar,
  Input,
  PlaceholderImage,
  ToastProvider,
  useToast,
} from '@digikit/ui';
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from '../../../lib/demo';
import {
  COMPONENT_MAP,
  CUSTOM_DEMO_MAP,
  type KitComponentEntry,
} from './registry.generated';
import s from './workbench.module.css';

type DemoValue = string | number | boolean;

export interface ComponentPreviewProps {
  entry: KitComponentEntry;
  values: Record<string, DemoValue>;
  onValueChange(key: string, value: DemoValue): void;
  onNotify(message: string, tone?: 'success' | 'error' | 'info'): void;
}

interface CustomDemoProps {
  values: Record<string, DemoValue>;
  onValueChange(key: string, value: DemoValue): void;
  onNotify(message: string, tone?: 'success' | 'error' | 'info'): void;
}

interface PreviewErrorBoundaryProps {
  children: ReactNode;
}

interface PreviewErrorBoundaryState {
  error: Error | null;
}

class PreviewErrorBoundary extends Component<PreviewErrorBoundaryProps, PreviewErrorBoundaryState> {
  state: PreviewErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): PreviewErrorBoundaryState {
    return { error };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    return undefined;
  }

  render() {
    if (this.state.error) {
      return <div className={s.previewFallback}><strong>دموی این حالت قابل رندر نیست.</strong><span>propهای اجباری را در metadata یا `demo.tsx` تعریف کنید.</span></div>;
    }
    return this.props.children;
  }
}

const product = DEMO_PRODUCTS[0];
const products = DEMO_PRODUCTS.slice(0, 4);
const address = {
  id: 'home',
  title: 'خانه',
  recipient: 'کاربر دیجی‌کیت',
  phone: '۰۹۱۲۱۲۳۴۵۶۷',
  province: 'تهران',
  city: 'تهران',
  details: 'خیابان ولیعصر، کوچه نمونه، پلاک ۱۲',
  postalCode: '۱۲۳۴۵۶۷۸۹۰',
  isDefault: true,
};
const filterSections = [
  { id: 'brand', title: 'برند', options: [{ id: 'samsung', label: 'سامسونگ', count: 128 }, { id: 'apple', label: 'اپل', count: 84 }, { id: 'xiaomi', label: 'شیائومی', count: 61 }] },
  { id: 'availability', title: 'وضعیت موجودی', options: [{ id: 'in-stock', label: 'فقط کالاهای موجود', count: 216 }] },
  { id: 'price', title: 'محدوده قیمت' },
];
const sortOptions = [
  { value: 'popular', label: 'پرفروش‌ترین' },
  { value: 'newest', label: 'جدیدترین' },
  { value: 'cheap', label: 'ارزان‌ترین' },
];
const serviceItems = [
  { icon: 'bolt', title: 'ارسال سریع', desc: 'تحویل مطمئن', color: '#ef394e', href: '/products' },
  { icon: 'book', title: 'راهنمای خرید', desc: 'انتخاب آسان', color: '#2563eb', href: '/kit' },
  { icon: 'credit', title: 'پرداخت امن', desc: 'با خیال راحت', color: '#00a049', href: '/checkout' },
];

function parseJson(value: DemoValue, fallback: unknown): unknown {
  if (typeof value !== 'string') return value ?? fallback;
  try {
    return JSON.parse(value) as DemoValue;
  } catch {
    return fallback;
  }
}

function valueOf(entry: KitComponentEntry, values: Record<string, DemoValue>, key: string, fallback: unknown): unknown {
  const control = entry.controls.find((item) => item.key === key);
  const value = values[key];
  if (value === undefined) return fallback;
  return control?.type === 'json' ? parseJson(value, fallback) : value;
}

function jsonValue<T>(entry: KitComponentEntry, values: Record<string, DemoValue>, key: string, fallback: T): T {
  return valueOf(entry, values, key, fallback) as T;
}

function textValue(entry: KitComponentEntry, values: Record<string, DemoValue>, key: string, fallback = ''): string {
  const value = valueOf(entry, values, key, fallback);
  return value == null ? fallback : String(value);
}

function numberValue(entry: KitComponentEntry, values: Record<string, DemoValue>, key: string, fallback: number): number {
  const value = valueOf(entry, values, key, fallback);
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function booleanValue(entry: KitComponentEntry, values: Record<string, DemoValue>, key: string, fallback = false): boolean {
  return Boolean(valueOf(entry, values, key, fallback));
}

function controlProps(entry: KitComponentEntry, values: Record<string, DemoValue>) {
  const props: Record<string, unknown> = { ...entry.defaultProps };
  for (const control of entry.controls) {
    if (values[control.key] === undefined) continue;
    if (control.type === 'json') {
      const parsed = parseJson(values[control.key], undefined);
      if (parsed !== undefined) props[control.key] = parsed;
      continue;
    }
    props[control.key] = values[control.key];
  }
  return props;
}

function ToastActions({ onNotify }: Pick<CustomDemoProps, 'onNotify'>) {
  const toast = useToast();
  return (
    <div className={s.demoStack}>
      <div className={s.demoRow}>
        <Button size="sm" startIcon={<ShoppingCart size={15} aria-hidden="true" />} onClick={() => toast.show('کالا با موفقیت به سبد اضافه شد', 'success')}>موفق</Button>
        <Button size="sm" variant="outline" onClick={() => toast.show('این یک پیام اطلاع‌رسانی است', 'info')}>اطلاع</Button>
        <Button size="sm" variant="danger" onClick={() => { toast.show('خطا در برقراری ارتباط', 'error'); onNotify('توست خطا نمایش داده شد', 'error'); }}>خطا</Button>
      </div>
      <span className={s.demoHint}>این provider را یک‌بار در ریشه‌ی پروژه قرار دهید.</span>
    </div>
  );
}

function baseProps(entry: KitComponentEntry): Record<string, unknown> {
  const name = entry.exportName;
  switch (name) {
    case 'Accordion':
      return { items: [{ id: 'one', title: 'ویژگی‌های اصلی', content: 'این محتوای نمونه‌ی آکاردئون است.' }, { id: 'two', title: 'جزئیات ارسال', content: 'ارسال سریع و استاندارد قابل انتخاب است.' }] };
    case 'AddressCard':
      return { address, onSelect: undefined };
    case 'BrandCard':
      return { name: 'سامسونگ', count: 128, featured: true };
    case 'Breadcrumb':
      return { items: [{ label: 'خانه', href: '/' }, { label: 'موبایل', href: '/search?cat=mobile' }, { label: 'گوشی موبایل' }] };
    case 'CartItem':
      return { item: { product, qty: 2, selectedColor: '#111827', selectedVariant: '۲۵۶ گیگابایت' } };
    case 'CategoryCard':
      return { category: DEMO_CATEGORIES[0] };
    case 'CartSummary':
      return { itemsCount: 2, subtotal: 123980000, discount: 9900000, shipping: 0, freeShippingThreshold: 70000000 };
    case 'CheckoutSteps':
      return { steps: [{ id: 'cart', title: 'سبد خرید' }, { id: 'shipping', title: 'آدرس و ارسال' }, { id: 'payment', title: 'پرداخت' }], current: 'shipping' };
    case 'DataTable':
      return { columns: [{ key: 'id', title: 'شماره سفارش' }, { key: 'customer', title: 'مشتری' }, { key: 'amount', title: 'مبلغ' }, { key: 'status', title: 'وضعیت' }], rows: [{ id: '۱۲۳۴۵', customer: 'سارا احمدی', amount: '۶۱٬۹۹۰٬۰۰۰', status: 'تحویل‌شده' }, { id: '۱۲۳۴۶', customer: 'مهدی رضایی', amount: '۹٬۴۹۰٬۰۰۰', status: 'در حال پردازش' }] };
    case 'DropdownMenu':
      return { trigger: <Button size="sm" variant="outline">باز کردن منو</Button>, items: [{ id: 'edit', label: 'ویرایش' }, { id: 'delete', label: 'حذف', danger: true }] };
    case 'ConfirmDialog':
      return { open: false, title: 'حذف کالا', description: 'آیا از حذف این مورد مطمئن هستید؟' };
    case 'FilterDialog':
      return { open: false, children: <FilterSidebar sections={filterSections} values={{ brand: ['samsung'] }} /> };
    case 'SearchDialog':
      return { open: false, value: 'گوشی', results: [{ id: '1', label: 'گوشی موبایل سامسونگ', description: '۱۲۸ نتیجه' }, { id: '2', label: 'قاب گوشی موبایل', description: '۳۴ نتیجه' }] };
    case 'EmptyState':
      return { title: 'موردی پیدا نشد', description: 'برای شروع، یک گزینه را انتخاب کنید.' };
    case 'FilterSidebar':
      return { sections: filterSections, values: { brand: ['samsung'] } };
    case 'FormField':
      return { children: <Input placeholder="۰۹۱۲۱۲۳۴۵۶۷" /> };
    case 'Header':
      return { categories: DEMO_CATEGORIES };
    case 'HeroBanner':
      return { title: 'تجربه‌ای تازه برای خرید آنلاین', image: <PlaceholderImage seed="kit-hero" label="DigiKit" ratio="16:9" /> };
    case 'Layout':
      return { categories: DEMO_CATEGORIES, children: <div className={s.layoutDemoContent}><strong>محتوای صفحه</strong><span>Header، Footer و BottomNav را یک‌جا نمایش می‌دهد.</span></div> };
    case 'MegaMenu':
      return { categories: DEMO_CATEGORIES, open: true };
    case 'OrderStatus':
      return { status: 'processing' };
    case 'Pagination':
      return { page: 2, totalPages: 8 };
    case 'PlaceholderImage':
      return { seed: 's24-ultra', label: 'سامسونگ', ratio: '1:1' };
    case 'Price':
      return { price: 1290000, oldPrice: 1890000 };
    case 'ProductCardAmazing':
    case 'ProductCardGrid':
    case 'ProductCardMobile':
    case 'ProductCardRow':
      return { product };
    case 'ProductCardSuper':
      return { product: { ...product, cat: 'super', title: 'برنج ایرانی هاشمی درجه یک ۱۰ کیلوگرمی' } };
    case 'ProductGallery':
      return { images: [{ src: 'ph:1', alt: 'نمای اصلی محصول', label: 'نمای اصلی' }, { src: 'ph:1-side', alt: 'نمای کناری', label: 'نمای کناری' }, { src: 'ph:1-box', alt: 'جعبه محصول', label: 'جعبه' }] };
    case 'ProductGrid':
      return { products };
    case 'ProductInfo':
      return { product, colors: ['مشکی', 'نقره‌ای', 'بنفش'], sizes: ['۲۵۶ گیگابایت', '۵۱۲ گیگابایت'] };
    case 'ProductSpecs':
      return { specs: [{ label: 'حافظه داخلی', value: '۲۵۶ گیگابایت', featured: true }, { label: 'ظرفیت باتری', value: '۵۰۰۰ میلی‌آمپرساعت' }, { label: 'گارانتی', value: '۱۸ ماه شرکتی' }] };
    case 'Progress':
      return { value: 68 };
    case 'RadioGroup':
      return { name: 'shipping', value: 'standard', options: [{ value: 'standard', label: 'ارسال عادی', description: 'تحویل تا ۳ روز کاری' }, { value: 'express', label: 'ارسال سریع', description: 'تحویل امروز' }] };
    case 'Rating':
      return { rating: 4.6, count: 2541 };
    case 'ReviewSummary':
      return { rating: 4.6, count: 2541, distribution: { 5: 1920, 4: 480, 3: 90, 2: 32, 1: 19 } };
    case 'ScrollCarousel':
      return { children: <div className={s.carouselItems}>{products.map((item) => <Card key={item.id} padding="sm"><strong>{item.brand}</strong><span>{item.title.slice(0, 24)}…</span></Card>)}</div> };
    case 'Select':
      return { options: [{ value: 'popular', label: 'پرفروش‌ترین' }, { value: 'newest', label: 'جدیدترین' }, { value: 'cheap', label: 'ارزان‌ترین' }] };
    case 'SectionHeader':
      return { title: 'محبوب‌ترین‌ها' };
    case 'SellerCard':
      return { seller: { name: 'فروشگاه رسمی دیجی‌کیت', rating: 4.8, ratingCount: 1280, positiveRate: 96, location: 'تهران', verified: true } };
    case 'ServiceTiles':
    case 'ServicesStrip':
      return { items: serviceItems };
    case 'ShippingMethod':
      return { name: 'shipping', value: 'standard', options: [{ id: 'standard', title: 'ارسال عادی', description: 'تحویل تا ۳ روز کاری', price: 0 }, { id: 'express', title: 'ارسال سریع', description: 'تحویل امروز تا ساعت ۲۲', price: 89000 }] };
    case 'SortBar':
      return { value: 'popular', options: sortOptions, total: 128 };
    case 'Stepper':
      return { value: 2 };
    case 'Tabs':
      return { items: [{ id: 'overview', title: 'نمای کلی' }, { id: 'specs', title: 'مشخصات' }, { id: 'reviews', title: 'دیدگاه‌ها' }], active: 'overview' };
    case 'Tooltip':
      return { content: 'برای مشاهده جزئیات کلیک کنید.' };
    default:
      return {};
  }
}

function buildProps(
  entry: KitComponentEntry,
  values: Record<string, DemoValue>,
  onValueChange: ComponentPreviewProps['onValueChange'],
  onNotify: ComponentPreviewProps['onNotify'],
): Record<string, unknown> {
  const props = { ...baseProps(entry), ...controlProps(entry, values) };
  const name = entry.exportName;
  const set = (key: string, value: DemoValue) => onValueChange(key, value);

  switch (name) {
    case 'Accordion':
      props.items = jsonValue(entry, values, 'items', props.items);
      props.multiple = booleanValue(entry, values, 'multiple');
      break;
    case 'AddressCard':
      props.address = jsonValue(entry, values, 'address', address);
      props.selected = booleanValue(entry, values, 'selected', true);
      props.selectable = booleanValue(entry, values, 'selectable', true);
      props.onSelect = () => { set('selected', true); onNotify('آدرس انتخاب شد', 'success'); };
      props.onEdit = () => onNotify('رویداد ویرایش آدرس اجرا شد', 'info');
      props.onDelete = () => onNotify('رویداد حذف آدرس اجرا شد', 'info');
      break;
    case 'Alert':
      props.children = textValue(entry, values, 'children', 'کد تخفیف روی سفارش شما اعمال شد.');
      break;
    case 'BottomSheet':
    case 'Modal':
    case 'MegaMenu':
    case 'SearchOverlay':
      props.open = booleanValue(entry, values, 'open', name === 'MegaMenu');
      props.onClose = () => set('open', false);
      break;
    case 'Button':
      props.children = textValue(entry, values, 'children', 'افزودن به سبد');
      props.startIcon = <ShoppingCart size={15} aria-hidden="true" />;
      props.onClick = () => onNotify('رویداد کلیک دکمه اجرا شد', 'success');
      break;
    case 'Card':
      props.children = textValue(entry, values, 'children', 'محتوای کارت دیجی‌کیت');
      break;
    case 'CartItem': {
      const item = jsonValue(entry, values, 'item', { product, qty: 2 });
      props.item = item;
      props.onQuantityChange = (quantity: number) => onNotify(`تعداد به ${quantity} تغییر کرد`, 'info');
      props.onRemove = () => onNotify('رویداد حذف کالا اجرا شد', 'info');
      props.onSave = () => onNotify('کالا برای بعد ذخیره شد', 'success');
      break;
    }
    case 'CartSummary':
      props.onCheckout = () => onNotify('رویداد ادامه فرایند خرید اجرا شد', 'success');
      break;
    case 'Checkbox':
      props.checked = booleanValue(entry, values, 'checked', true);
      props.onChange = (event: React.ChangeEvent<HTMLInputElement>) => set('checked', event.target.checked);
      break;
    case 'CheckoutSteps':
      props.steps = jsonValue(entry, values, 'steps', props.steps);
      props.current = textValue(entry, values, 'current', 'shipping');
      props.onChange = (id: string) => { set('current', id); onNotify(`مرحله «${id}» انتخاب شد`, 'info'); };
      break;
    case 'CouponField':
      props.onApply = (code: string) => { set('value', code); set('appliedCode', code); onNotify('کد تخفیف اعمال شد', 'success'); };
      props.onRemove = () => { set('appliedCode', ''); onNotify('کد تخفیف حذف شد', 'info'); };
      break;
    case 'DataTable':
      props.columns = jsonValue(entry, values, 'columns', props.columns);
      props.rows = jsonValue(entry, values, 'rows', props.rows);
      break;
    case 'Divider':
      props.children = textValue(entry, values, 'children', '') || undefined;
      break;
    case 'DropdownMenu':
      props.trigger = <span className={s.menuTrigger}>باز کردن منو <MoreVertical size={15} aria-hidden="true" /></span>;
      props.items = jsonValue(entry, values, 'items', [{ id: 'edit', label: 'ویرایش' }, { id: 'delete', label: 'حذف', danger: true }]).map((item: Record<string, unknown>) => ({ ...item, onSelect: () => onNotify(`گزینه «${String(item.label || item.id)}» انتخاب شد`, 'info') }));
      break;
    case 'ConfirmDialog':
      props.open = booleanValue(entry, values, 'open', false);
      props.onClose = () => set('open', false);
      props.onConfirm = () => { set('open', false); onNotify('عملیات تأیید شد', 'success'); };
      break;
    case 'FilterDialog':
      props.open = booleanValue(entry, values, 'open', false);
      props.onClose = () => set('open', false);
      props.onApply = () => { set('open', false); onNotify('فیلترها اعمال شدند', 'success'); };
      props.onReset = () => onNotify('فیلترها پاک شدند', 'info');
      break;
    case 'SearchDialog':
      props.open = booleanValue(entry, values, 'open', false);
      props.onClose = () => set('open', false);
      props.value = textValue(entry, values, 'value', 'گوشی');
      props.onChange = (value: string) => set('value', value);
      props.onSubmit = (value: string) => onNotify(`جستجو برای «${value}» اجرا شد`, 'info');
      break;
    case 'EmptyState':
      props.onAction = () => onNotify('رویداد اقدام وضعیت خالی اجرا شد', 'info');
      break;
    case 'ErrorState':
      props.onRetry = () => onNotify('تلاش دوباره اجرا شد', 'info');
      break;
    case 'FilterSidebar':
      props.sections = jsonValue(entry, values, 'sections', filterSections);
      props.values = jsonValue(entry, values, 'values', { brand: ['samsung'] });
      props.mobileOpen = booleanValue(entry, values, 'mobileOpen', true);
      props.onChange = (sectionId: string, optionId: string, checked: boolean) => {
        const current = jsonValue<Record<string, string[]>>(entry, values, 'values', {});
        const next = { ...current, [sectionId]: checked ? [...(current[sectionId] || []), optionId] : (current[sectionId] || []).filter((item) => item !== optionId) };
        set('values', JSON.stringify(next));
      };
      props.onClear = () => set('values', JSON.stringify({}));
      props.onApply = () => onNotify('فیلترها اعمال شدند', 'success');
      props.onMobileClose = () => set('mobileOpen', false);
      break;
    case 'FormField':
      props.children = <Input placeholder="۰۹۱۲۱۲۳۴۵۶۷" />;
      break;
    case 'HeroBanner':
      props.image = <PlaceholderImage seed="kit-hero" label="DigiKit" ratio="16:9" />;
      props.onAction = () => onNotify('رویداد بنر اجرا شد', 'info');
      break;
    case 'IconButton':
      props.children = <Heart size={17} aria-hidden="true" />;
      props.onClick = () => onNotify('رویداد دکمه آیکونی اجرا شد', 'success');
      break;
    case 'Input':
      props['aria-label'] = 'ورودی نمونه';
      break;
    case 'Layout':
      props.children = <div className={s.layoutDemoContent}><strong>محتوای صفحه</strong><span>Header، Footer و BottomNav را یک‌جا نمایش می‌دهد.</span></div>;
      props.categories = DEMO_CATEGORIES;
      break;
    case 'Modal':
      props.children = <div className={s.modalDemo}><Check size={17} aria-hidden="true" /> محتوای قابل جایگزینی مودال</div>;
      break;
    case 'Pagination':
      props.onChange = (page: number) => set('page', page);
      break;
    case 'ProductGallery':
      props.images = jsonValue(entry, values, 'images', baseProps(entry).images);
      props.favorite = booleanValue(entry, values, 'favorite', false);
      props.onFavorite = () => set('favorite', !booleanValue(entry, values, 'favorite', false));
      props.onZoom = () => onNotify('بزرگ‌نمایی تصویر اجرا شد', 'info');
      break;
    case 'ProductGrid':
      props.products = jsonValue(entry, values, 'products', products);
      break;
    case 'ProductInfo':
      props.product = jsonValue(entry, values, 'product', product);
      props.colors = jsonValue(entry, values, 'colors', ['مشکی', 'نقره‌ای', 'بنفش']);
      props.sizes = jsonValue(entry, values, 'sizes', ['۲۵۶ گیگابایت', '۵۱۲ گیگابایت']);
      props.onAddToCart = (quantity: number) => onNotify(`تعداد ${quantity} به سبد اضافه شد`, 'success');
      props.onFavorite = () => onNotify('وضعیت علاقه‌مندی تغییر کرد', 'info');
      break;
    case 'ProductSpecs':
      props.specs = jsonValue(entry, values, 'specs', props.specs);
      break;
    case 'RadioGroup':
      props.options = jsonValue(entry, values, 'options', props.options);
      props.onChange = (value: string) => set('value', value);
      break;
    case 'ReviewSummary':
      props.distribution = jsonValue(entry, values, 'distribution', { 5: 1920, 4: 480, 3: 90, 2: 32, 1: 19 });
      props.onWrite = () => onNotify('رویداد ثبت دیدگاه اجرا شد', 'info');
      break;
    case 'ScrollCarousel':
      props.children = <div className={s.carouselItems}>{products.map((item) => <Card key={item.id} padding="sm"><strong>{item.brand}</strong><span>{item.title.slice(0, 24)}…</span></Card>)}</div>;
      break;
    case 'Select':
      props.options = jsonValue(entry, values, 'options', props.options);
      props['aria-label'] = 'انتخابگر نمونه';
      break;
    case 'SellerCard':
      props.seller = jsonValue(entry, values, 'seller', { name: 'فروشگاه رسمی دیجی‌کیت', rating: 4.8, ratingCount: 1280, positiveRate: 96, location: 'تهران', verified: true });
      props.onVisit = () => onNotify('رویداد مشاهده فروشنده اجرا شد', 'info');
      break;
    case 'ServicesStrip':
      props.items = jsonValue(entry, values, 'items', serviceItems);
      break;
    case 'ServiceTiles':
      props.items = jsonValue(entry, values, 'items', serviceItems);
      break;
    case 'ShippingMethod':
      props.options = jsonValue(entry, values, 'options', [{ id: 'standard', title: 'ارسال عادی', description: 'تحویل تا ۳ روز کاری', price: 0 }, { id: 'express', title: 'ارسال سریع', description: 'تحویل امروز تا ساعت ۲۲', price: 89000 }]);
      props.onChange = (value: string) => set('value', value);
      break;
    case 'SortBar':
      props.options = jsonValue(entry, values, 'options', sortOptions);
      props.onChange = (value: string) => set('value', value);
      break;
    case 'Stepper':
      props.onChange = (value: number) => set('value', value);
      break;
    case 'Switch':
      props.checked = booleanValue(entry, values, 'checked', true);
      props.onChange = (event: React.ChangeEvent<HTMLInputElement>) => set('checked', event.target.checked);
      break;
    case 'Tabs':
      props.items = jsonValue(entry, values, 'items', props.items);
      props.onChange = (id: string) => set('active', id);
      break;
    case 'Textarea':
      props['aria-label'] = 'ناحیه متن نمونه';
      props.defaultValue = 'یک توضیح نمونه برای سفارش.';
      break;
    case 'Tooltip':
      props.children = <Button size="sm" variant="outline" startIcon={<Bell size={15} aria-hidden="true" />}>حرکت ماوس</Button>;
      break;
    case 'BottomNav':
      break;
    case 'SearchOverlay':
      props.recents = jsonValue(entry, values, 'recents', ['گوشی سامسونگ', 'لپ‌تاپ ایسوس']);
      props.onSearch = (query: string) => onNotify(`جستجو برای «${query}» اجرا شد`, 'info');
      break;
    case 'ToastProvider':
      break;
    default:
      break;
  }

  return props;
}

function OverlayLauncher({
  entry,
  values,
  onValueChange,
  children,
}: Pick<ComponentPreviewProps, 'entry' | 'values' | 'onValueChange'> & { children: ReactNode }) {
  const open = booleanValue(entry, values, 'open', false);
  if (open) return <>{children}</>;
  return <div className={s.launcher}><p>برای مشاهده‌ی حالت تعاملی، پنل را باز کنید.</p><Button size="sm" onClick={() => onValueChange('open', true)}>نمایش {entry.label}</Button></div>;
}

export function ComponentPreview({ entry, values, onValueChange, onNotify }: ComponentPreviewProps) {
  const CustomDemo = CUSTOM_DEMO_MAP[entry.exportName] as React.ComponentType<CustomDemoProps> | undefined;
  if (CustomDemo) return <CustomDemo values={values} onValueChange={onValueChange} onNotify={onNotify} />;

  const Component = COMPONENT_MAP[entry.exportName];
  if (!Component) {
    return <div className={s.previewFallback}><strong>دموی این کامپوننت آماده نیست.</strong><span>با افزودن `demo.tsx` کنار کامپوننت، renderer اختصاصی آن خودکار بارگذاری می‌شود.</span></div>;
  }

  const props = buildProps(entry, values, onValueChange, onNotify);
  if (entry.exportName === 'ToastProvider') {
    return <PreviewErrorBoundary key={entry.exportName}>{createElement(Component, { children: <ToastActions onNotify={onNotify} /> })}</PreviewErrorBoundary>;
  }
  const rendered = <PreviewErrorBoundary key={entry.exportName}>{createElement(Component, props)}</PreviewErrorBoundary>;
  if (['BottomSheet', 'Modal', 'MegaMenu', 'SearchOverlay', 'ConfirmDialog', 'FilterDialog', 'SearchDialog'].includes(entry.exportName)) {
    return <OverlayLauncher entry={entry} values={values} onValueChange={onValueChange}>{rendered}</OverlayLauncher>;
  }
  return rendered;
}
