import type { ReactNode } from 'react';
import {
  Alert,
  Button,
  Card,
  Divider,
  HeroBanner,
  Price,
  ProductGrid,
  SectionHeader,
} from '@digikit/ui';
import { resolveBuilderProducts, safeBuilderHref } from './builder-products';
import type { BuilderDefinition, BuilderProps } from './builder.types';

export const LOCAL_IMAGE_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 420"%3E%3Crect width="1200" height="420" fill="%23e8edf3"/%3E%3Cpath d="M0 330 250 210l180 90 180-140 260 190 180-100 150 100v70H0z" fill="%23c6d0dc"/%3E%3Ccircle cx="930" cy="125" r="58" fill="%23a9b7c7"/%3E%3Ctext x="600" y="220" text-anchor="middle" fill="%23536276" font-family="Arial,sans-serif" font-size="42"%3EDigiKit%3C/text%3E%3C/svg%3E';

function stringValue(props: BuilderProps, key: string, fallback = ''): string {
  const value = props[key];
  return typeof value === 'string' ? value : fallback;
}

function numberValue(props: BuilderProps, key: string, fallback: number): number {
  const value = props[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function navigationButtonSymbol(value: string): string {
  return ({ menu: '☰', close: '×', back: '‹', more: '⋯', search: '⌕' } as Record<string, string>)[value] || '☰';
}

const textField = (key: string, label: string, placeholder?: string) => ({ key, label, type: 'text' as const, placeholder });
const textareaField = (key: string, label: string, placeholder?: string) => ({ key, label, type: 'textarea' as const, placeholder });
const selectField = (key: string, label: string, options: { label: string; value: string }[]) => ({ key, label, type: 'select' as const, options });
const numberField = (key: string, label: string, min: number, max: number, step = 1) => ({ key, label, type: 'number' as const, min, max, step });
const colorField = (key: string, label: string) => ({ key, label, type: 'color' as const });
const urlField = (key: string, label: string) => ({ key, label, type: 'url' as const, placeholder: '/products' });

export const BUILDER_DEFINITIONS: BuilderDefinition[] = [
  {
    type: 'builder/root',
    label: 'صفحه',
    category: 'layout',
    description: 'ریشه‌ی صفحه و محل قرارگیری تمام بخش‌ها.',
    icon: '⌂',
    defaultProps: {},
    fields: [],
    canHaveChildren: true,
    render: (_props, children) => <main>{children}</main>,
  },
  {
    type: 'builder/navigation',
    label: 'ناوبری صفحه',
    category: 'layout',
    description: 'عنوان برند و سه لینک برای بالای صفحه.',
    icon: '☰',
    defaultProps: { brand: 'نام برند', firstLabel: 'خانه', firstHref: '/', secondLabel: 'محصولات', secondHref: '/products', thirdLabel: 'تماس', thirdHref: '#contact' },
    fields: [textField('brand', 'نام برند'), textField('firstLabel', 'لینک اول'), urlField('firstHref', 'آدرس لینک اول'), textField('secondLabel', 'لینک دوم'), urlField('secondHref', 'آدرس لینک دوم'), textField('thirdLabel', 'لینک سوم'), urlField('thirdHref', 'آدرس لینک سوم')],
    render: (props, _children, context) => <nav aria-label="ناوبری صفحه" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, padding: '20px 24px', background: '#ffffff' }}><strong>{stringValue(props, 'brand', 'نام برند')}</strong><div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>{(['first', 'second', 'third'] as const).map((item) => stringValue(props, `${item}Label`) ? <a key={item} href={context.mode === 'editor' ? undefined : safeBuilderHref(stringValue(props, `${item}Href`), '#')} style={{ color: 'inherit', textDecoration: 'none' }}>{stringValue(props, `${item}Label`)}</a> : null)}</div></nav>,
  },
  {
    type: 'builder/navigation-button',
    label: 'دکمه نویگیشن',
    category: 'layout',
    description: 'دکمه‌ی منوی موبایل، بازگشت یا دسترسی سریع در header.',
    icon: '☰',
    defaultProps: { label: 'منو', ariaLabel: 'باز کردن منو', href: '#menu', icon: 'menu', variant: 'outline' },
    fields: [textField('label', 'متن دکمه', 'منو'), textField('ariaLabel', 'برچسب دسترسی', 'باز کردن منو'), urlField('href', 'آدرس مقصد'), selectField('icon', 'نماد', [{ label: 'منو', value: 'menu' }, { label: 'بستن', value: 'close' }, { label: 'بازگشت', value: 'back' }, { label: 'بیشتر', value: 'more' }, { label: 'جستجو', value: 'search' }]), selectField('variant', 'گونه', [{ label: 'خط‌دار', value: 'outline' }, { label: 'پررنگ', value: 'solid' }, { label: 'ساده', value: 'ghost' }])],
    render: (props, _children, context) => {
      const variant = stringValue(props, 'variant', 'outline');
      const isSolid = variant === 'solid';
      const isGhost = variant === 'ghost';
      const label = stringValue(props, 'label', 'منو');
      return <a href={context.mode === 'editor' ? undefined : safeBuilderHref(stringValue(props, 'href'), '#')} aria-label={stringValue(props, 'ariaLabel', label || 'دکمه نویگیشن')} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 40, padding: '0 14px', border: `1px solid ${isGhost ? 'transparent' : isSolid ? '#25384e' : '#d5dce6'}`, borderRadius: 10, background: isSolid ? '#25384e' : 'transparent', color: isSolid ? '#fff' : '#25384e', textDecoration: 'none', fontSize: 13, fontWeight: 800 }}><span aria-hidden="true" style={{ fontSize: 20, lineHeight: 1 }}>{navigationButtonSymbol(stringValue(props, 'icon', 'menu'))}</span>{label && <span>{label}</span>}</a>;
    },
  },
  {
    type: 'builder/page-slot',
    label: 'جایگاه محتوای صفحه',
    category: 'layout',
    description: 'محل نمایش محتوای هر صفحه در layout master.',
    icon: '◎',
    defaultProps: {},
    fields: [],
    render: (_props, children, context) => {
      const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children);
      return hasChildren ? children : <div style={{ minHeight: 180, display: 'grid', placeItems: 'center', padding: 28, border: '1px dashed #9aa8ba', borderRadius: 16, background: '#f7f9fc', color: '#526176', textAlign: 'center' }}>{context.mode === 'editor' ? 'محتوای صفحه اینجا قرار می‌گیرد' : null}</div>;
    },
  },
  {
    type: 'builder/section',
    label: 'بخش صفحه',
    category: 'layout',
    description: 'یک بخش قابل ترکیب برای چیدن ماژول‌ها.',
    icon: '▤',
    defaultProps: { background: '#ffffff', padding: 32, maxWidth: 1200, anchor: '' },
    fields: [textField('anchor', 'شناسه لینک داخلی', 'services'), colorField('background', 'رنگ پس‌زمینه'), numberField('padding', 'فاصله داخلی', 0, 160, 4), numberField('maxWidth', 'حداکثر عرض', 640, 1800, 8)],
    canHaveChildren: true,
    render: (props, children) => <section id={stringValue(props, 'anchor').replace(/[^a-zA-Z0-9_-]/g, '') || undefined} style={{ background: stringValue(props, 'background', '#ffffff'), paddingBlock: numberValue(props, 'padding', 32), maxWidth: numberValue(props, 'maxWidth', 1200), marginInline: 'auto', width: '100%' }}>{children}</section>,
  },
  {
    type: 'builder/grid',
    label: 'گرید محتوا',
    category: 'layout',
    description: 'چیدمان چندستونه برای چند component.',
    icon: '▦',
    defaultProps: { columns: 2, gap: 16 },
    fields: [numberField('columns', 'تعداد ستون', 1, 4), numberField('gap', 'فاصله', 0, 64, 4)],
    canHaveChildren: true,
    render: (props, children) => <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.max(1, Math.min(4, Math.round(numberValue(props, 'columns', 2))))}, minmax(0, 1fr))`, gap: numberValue(props, 'gap', 16) }}>{children}</div>,
  },
  {
    type: 'builder/card',
    label: 'کارت',
    category: 'layout',
    description: 'سطح محتوایی برای قرار دادن چند component.',
    icon: '▣',
    defaultProps: { variant: 'elevated', padding: 'md' },
    fields: [selectField('variant', 'گونه', [{ label: 'برجسته', value: 'elevated' }, { label: 'خط‌دار', value: 'outlined' }, { label: 'ساده', value: 'flat' }, { label: 'شفاف', value: 'ghost' }]), selectField('padding', 'فاصله داخلی', [{ label: 'بدون فاصله', value: 'none' }, { label: 'کم', value: 'sm' }, { label: 'متوسط', value: 'md' }, { label: 'زیاد', value: 'lg' }])],
    canHaveChildren: true,
    render: (props, children) => <Card variant={stringValue(props, 'variant', 'elevated') as 'elevated' | 'outlined' | 'flat' | 'ghost'} padding={stringValue(props, 'padding', 'md') as 'none' | 'sm' | 'md' | 'lg'}>{children}</Card>,
  },
  {
    type: 'builder/heading',
    label: 'عنوان',
    category: 'content',
    description: 'عنوان متنی با سطح و تراز قابل انتخاب.',
    icon: 'T',
    defaultProps: { text: 'عنوان بخش', level: 'h2', align: 'right' },
    fields: [textField('text', 'متن عنوان', 'عنوان بخش'), selectField('level', 'سطح عنوان', [{ label: 'H1', value: 'h1' }, { label: 'H2', value: 'h2' }, { label: 'H3', value: 'h3' }]), selectField('align', 'تراز', [{ label: 'راست', value: 'right' }, { label: 'مرکز', value: 'center' }, { label: 'چپ', value: 'left' }])],
    render: (props) => {
      const level = stringValue(props, 'level', 'h2');
      const title = stringValue(props, 'text', 'عنوان بخش');
      const align = stringValue(props, 'align', 'right') as 'right' | 'center' | 'left';
      if (level === 'h1') return <h1 style={{ textAlign: align }}>{title}</h1>;
      if (level === 'h3') return <h3 style={{ textAlign: align }}>{title}</h3>;
      return <h2 style={{ textAlign: align }}>{title}</h2>;
    },
  },
  {
    type: 'builder/text',
    label: 'متن',
    category: 'content',
    description: 'متن پاراگرافی برای معرفی یا توضیح.',
    icon: '¶',
    defaultProps: { text: 'این متن نمونه را از پنل تنظیمات تغییر بده.', align: 'right' },
    fields: [textareaField('text', 'متن', 'متن صفحه'), selectField('align', 'تراز', [{ label: 'راست', value: 'right' }, { label: 'مرکز', value: 'center' }, { label: 'چپ', value: 'left' }])],
    render: (props) => <p style={{ textAlign: stringValue(props, 'align', 'right') as 'right' | 'center' | 'left', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>{stringValue(props, 'text', '')}</p>,
  },
  {
    type: 'builder/feature',
    label: 'مزیت و ویژگی',
    category: 'content',
    description: 'یک مزیت کلیدی با برچسب و توضیح کوتاه.',
    icon: '✳',
    defaultProps: { eyebrow: 'چرا ما؟', title: 'تجربه‌ای ساده و مطمئن', description: 'ارزش اصلی محصول یا خدمت را اینجا توضیح بده.' },
    fields: [textField('eyebrow', 'برچسب'), textField('title', 'عنوان مزیت'), textareaField('description', 'توضیح')],
    render: (props) => <article style={{ display: 'grid', gap: 10, padding: 24, border: '1px solid #e2e6ec', borderRadius: 16, background: '#fff' }}><small>{stringValue(props, 'eyebrow')}</small><h3 style={{ margin: 0 }}>{stringValue(props, 'title')}</h3><p style={{ margin: 0, lineHeight: 1.8 }}>{stringValue(props, 'description')}</p></article>,
  },
  {
    type: 'builder/faq',
    label: 'پرسش و پاسخ',
    category: 'content',
    description: 'یک پرسش بازشونده با پاسخ قابل ویرایش.',
    icon: '?',
    defaultProps: { question: 'چطور شروع کنیم؟', answer: 'پاسخ این پرسش را از پنل تنظیمات بنویس.' },
    fields: [textField('question', 'پرسش'), textareaField('answer', 'پاسخ')],
    render: (props) => <details style={{ padding: 20, border: '1px solid #e2e6ec', borderRadius: 12, background: '#fff' }}><summary style={{ cursor: 'pointer', fontWeight: 700 }}>{stringValue(props, 'question')}</summary><p style={{ lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>{stringValue(props, 'answer')}</p></details>,
  },
  {
    type: 'builder/button',
    label: 'دکمه',
    category: 'content',
    description: 'فراخوان اقدام با گونه‌های استاندارد DigiKit.',
    icon: '↗',
    defaultProps: { label: 'مشاهده محصولات', variant: 'primary', size: 'md', href: '/products' },
    fields: [textField('label', 'متن دکمه'), selectField('variant', 'گونه', [{ label: 'اصلی', value: 'primary' }, { label: 'ثانویه', value: 'secondary' }, { label: 'خط‌دار', value: 'outline' }, { label: 'شفاف', value: 'ghost' }, { label: 'خطر', value: 'danger' }]), selectField('size', 'اندازه', [{ label: 'کوچک', value: 'sm' }, { label: 'متوسط', value: 'md' }, { label: 'بزرگ', value: 'lg' }]), urlField('href', 'مسیر لینک')],
    render: (props, _children, context) => <Button variant={stringValue(props, 'variant', 'primary') as 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'} size={stringValue(props, 'size', 'md') as 'sm' | 'md' | 'lg'} onClick={(event) => { if (context.mode === 'editor') event.preventDefault(); else if (stringValue(props, 'href')) window.location.assign(safeBuilderHref(stringValue(props, 'href'))); }}>{stringValue(props, 'label', 'دکمه')}</Button>,
  },
  {
    type: 'builder/hero',
    label: 'بنر قهرمان',
    category: 'commerce',
    description: 'ماژول آماده برای معرفی کمپین یا صفحه.',
    icon: '✦',
    defaultProps: { eyebrow: 'کمپین ویژه', title: 'یک شروع حرفه‌ای برای صفحه‌ی تو', description: 'محتوای بنر را از پنل سمت راست ویرایش کن.', actionLabel: 'شروع کن', href: '/products', tone: 'primary' },
    fields: [textField('eyebrow', 'برچسب کوچک'), textField('title', 'عنوان'), textareaField('description', 'توضیح'), textField('actionLabel', 'متن اقدام'), urlField('href', 'مسیر اقدام'), selectField('tone', 'رنگ', [{ label: 'اصلی', value: 'primary' }, { label: 'تیره', value: 'dark' }, { label: 'موفق', value: 'success' }, { label: 'کرم', value: 'cream' }])],
    render: (props, _children, context) => <HeroBanner eyebrow={stringValue(props, 'eyebrow')} title={stringValue(props, 'title', 'عنوان بنر')} description={stringValue(props, 'description')} actionLabel={stringValue(props, 'actionLabel')} href={context.mode === 'editor' ? undefined : safeBuilderHref(stringValue(props, 'href'))} tone={stringValue(props, 'tone', 'primary') as 'primary' | 'dark' | 'success' | 'cream'} />,
  },
  {
    type: 'builder/section-header',
    label: 'سرتیتر بخش',
    category: 'commerce',
    description: 'سرتیتر استاندارد برای بخش‌های فروشگاهی.',
    icon: '≡',
    defaultProps: { title: 'پیشنهادهای منتخب', seeAllHref: '/products' },
    fields: [textField('title', 'عنوان'), urlField('seeAllHref', 'مسیر مشاهده همه')],
    render: (props, _children, context) => <SectionHeader title={stringValue(props, 'title', 'عنوان بخش')} seeAllHref={context.mode === 'editor' ? undefined : safeBuilderHref(stringValue(props, 'seeAllHref'))} />,
  },
  {
    type: 'builder/product-grid',
    label: 'گرید محصولات',
    category: 'commerce',
    description: 'نمایش محصولات نمونه در قالب گرید responsive.',
    icon: '🛒',
    defaultProps: { variant: 'grid', columns: 4 },
    fields: [selectField('variant', 'گونه گرید', [{ label: 'ساده', value: 'grid' }, { label: 'خط‌مویی', value: 'bareGrid' }]), numberField('columns', 'تعداد ستون دسکتاپ', 2, 6)],
    render: (props) => <ProductGrid products={resolveBuilderProducts(props.items).map((product) => ({ ...product, href: safeBuilderHref(product.href || ''), image: product.image.startsWith('ph:') || /^(https?:\/\/|data:image\/|\/(?!\/))/i.test(product.image) ? product.image : `ph:${product.id}` }))} variant={stringValue(props, 'variant', 'grid') as 'grid' | 'bareGrid'} columns={numberValue(props, 'columns', 4)} />,
  },
  {
    type: 'builder/image',
    label: 'تصویر',
    category: 'content',
    description: 'تصویر با URL و متن جایگزین.',
    icon: '▧',
    defaultProps: { src: LOCAL_IMAGE_PLACEHOLDER, alt: 'تصویر نمونه', radius: 16 },
    fields: [urlField('src', 'آدرس تصویر'), textField('alt', 'متن جایگزین'), numberField('radius', 'گردی گوشه', 0, 48, 2)],
    render: (props) => <img src={stringValue(props, 'src')} alt={stringValue(props, 'alt', 'تصویر')} style={{ display: 'block', width: '100%', borderRadius: numberValue(props, 'radius', 16), objectFit: 'cover' }} />,
  },
  {
    type: 'builder/alert',
    label: 'پیام وضعیت',
    category: 'content',
    description: 'پیام اطلاع‌رسانی با toneهای استاندارد.',
    icon: '!',
    defaultProps: { tone: 'info', title: 'نکته مهم', text: 'این پیام از پنل تنظیمات قابل ویرایش است.' },
    fields: [selectField('tone', 'گونه', [{ label: 'اطلاعات', value: 'info' }, { label: 'موفق', value: 'success' }, { label: 'هشدار', value: 'warning' }, { label: 'خطا', value: 'danger' }]), textField('title', 'عنوان'), textareaField('text', 'متن پیام')],
    render: (props) => <Alert tone={stringValue(props, 'tone', 'info') as 'info' | 'success' | 'warning' | 'danger'} title={stringValue(props, 'title')}>{stringValue(props, 'text')}</Alert>,
  },
  {
    type: 'builder/price',
    label: 'قیمت',
    category: 'commerce',
    description: 'نمایش قیمت با فرمت فارسی و تخفیف.',
    icon: '₺',
    defaultProps: { price: 1290000, oldPrice: 1490000, size: 'md' },
    fields: [numberField('price', 'قیمت فعلی', 0, 1000000000, 1000), numberField('oldPrice', 'قیمت قبلی', 0, 1000000000, 1000), selectField('size', 'اندازه', [{ label: 'کوچک', value: 'sm' }, { label: 'متوسط', value: 'md' }, { label: 'بزرگ', value: 'lg' }])],
    render: (props) => <Price price={numberValue(props, 'price', 0)} oldPrice={numberValue(props, 'oldPrice', 0)} size={stringValue(props, 'size', 'md') as 'sm' | 'md' | 'lg'} />,
  },
  {
    type: 'builder/divider',
    label: 'جداکننده',
    category: 'decorative',
    description: 'خط جداکننده برای بخش‌های صفحه.',
    icon: '—',
    defaultProps: {},
    fields: [],
    render: () => <Divider />,
  },
  {
    type: 'builder/footer',
    label: 'پاورقی',
    category: 'layout',
    description: 'پایان صفحه با نام برند و توضیح.',
    icon: '▤',
    defaultProps: { brand: 'نام برند', description: 'با ما در ارتباط باشید.', anchor: 'contact' },
    fields: [textField('anchor', 'شناسه لینک داخلی', 'contact'), textField('brand', 'نام برند'), textareaField('description', 'متن پاورقی')],
    render: (props) => <footer id={stringValue(props, 'anchor').replace(/[^a-zA-Z0-9_-]/g, '') || undefined} style={{ padding: '32px 24px', background: '#25384e', color: '#fff' }}><strong>{stringValue(props, 'brand')}</strong><p style={{ marginBottom: 0, lineHeight: 1.8 }}>{stringValue(props, 'description')}</p></footer>,
  },
  {
    type: 'builder/spacer',
    label: 'فاصله',
    category: 'decorative',
    description: 'ایجاد فاصله‌ی عمودی کنترل‌شده.',
    icon: '↕',
    defaultProps: { height: 24 },
    fields: [numberField('height', 'ارتفاع', 4, 240, 4)],
    render: (props) => <div aria-hidden="true" style={{ height: numberValue(props, 'height', 24) }} />,
  },
];

export const BUILDER_DEFINITION_MAP = new Map(BUILDER_DEFINITIONS.map((definition) => [definition.type, definition]));

export function getBuilderDefinition(type: string): BuilderDefinition {
  return BUILDER_DEFINITION_MAP.get(type) || BUILDER_DEFINITIONS[0];
}

export function getBuilderProps(definition: BuilderDefinition): BuilderProps {
  return JSON.parse(JSON.stringify(definition.defaultProps)) as BuilderProps;
}
