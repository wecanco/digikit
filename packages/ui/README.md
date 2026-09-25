# `@digikit/ui`

`@digikit/ui` هسته‌ی React و TypeScript دیجی‌کیت است: مجموعه‌ای از کامپوننت‌های قابل ترکیب برای تجربه‌های فارسی، RTL، فروشگاه و پنل‌های عملیاتی.

راهنمای کلی repository، اجرای ویترین و فرآیند contribution در [`../../README.md`](../../README.md) و [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md) قرار دارد.

## نصب

اگر package در registry شما منتشر شده است:

```bash
npm install @digikit/ui react react-dom
```

برای توسعه‌ی نسخه‌ی محلی:

```bash
npm install /path/to/digikit/packages/ui
```

## راه‌اندازی CSS و فونت

در ریشه‌ی برنامه، فایل‌های پایه را فقط یک‌بار import کنید:

```tsx
import '@digikit/ui/fonts.css';
import '@digikit/ui/styles.css';
```

ریشه‌ی HTML را برای تجربه‌ی فارسی تنظیم کنید:

```tsx
<html lang="fa" dir="rtl">
  <body>{children}</body>
</html>
```

در Next.js، برای local link یا package‌ای که source TypeScript منتشر می‌کند، `@digikit/ui` را در `transpilePackages` قرار دهید:

```ts
const nextConfig = {
  transpilePackages: ['@digikit/ui'],
};
```

## نمونه‌ی استفاده

```tsx
import { Button, FormField, Input, Price } from '@digikit/ui';

export function CheckoutLine() {
  return (
    <section lang="fa" dir="rtl">
      <FormField label="کد تخفیف" hint="کد را بدون فاصله وارد کنید.">
        <Input placeholder="مثلاً DIGI20" />
      </FormField>
      <Price price={1290000} oldPrice={1490000} />
      <Button size="lg" fullWidth>ادامه‌ی خرید</Button>
    </section>
  );
}
```

کامپوننت‌های داده‌محور باید مدل UI را دریافت کنند؛ تبدیل پاسخ API به این مدل را در adapter انجام دهید:

```tsx
import { ProductInfo } from '@digikit/ui';
import type { Product } from '@digikit/ui';

const product: Product = {
  id: 1,
  title: 'گوشی موبایل نمونه',
  brand: 'دیجی‌کیت',
  cat: 'mobile',
  price: 61990000,
  oldPrice: 67380000,
  discount: 8,
  rating: 4.6,
  ratingCount: 2541,
  image: 'https://cdn.example.com/product.webp',
};

<ProductInfo product={product} onAddToCart={(quantity) => console.log(quantity)} />;
```

## قراردادهای طراحی

- styleها از tokenهای معنایی `--dk-*` استفاده می‌کنند؛ رنگ و فاصله را داخل component hard-code نکنید.
- برای RTL از logical properties استفاده کنید و layout را به `left` و `right` وابسته نکنید.
- focus قابل مشاهده، keyboard interaction، disabled، loading و `prefers-reduced-motion` بخشی از کیفیت پایه هستند.
- `data-theme="dark"` را روی هر ancestor قرار دهید تا tokenهای حالت تاریک فعال شوند.
- componentهای تعاملی مثل `Modal`، `BottomSheet`، `SearchOverlay` و hookها را در Client Component مصرف کنید.
- callbackهای خرید، پرداخت، ورود و حذف فقط event رابط کاربری‌اند؛ permission، API و مدیریت خطا با برنامه‌ی مصرف‌کننده است.

## گروه‌های component

### پایه و نمایش

`Button`, `IconButton`, `Card`, `Avatar`, `BadgeCircle`, `Chip`, `Price`, `Rating`, `Progress`, `Spinner`, `Skeleton`, `Divider`, `Tooltip`, `Alert`

### فرم و تعامل

`Input`, `SearchPill`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `FormField`, `DropdownMenu`, `Tabs`, `Stepper`, `Accordion`

### ناوبری و پوسته

`Header`, `Footer`, `Layout`, `MegaMenu`, `BottomNav`, `CampaignStrip`, `Breadcrumb`, `Modal`, `BottomSheet`, `Pagination`, `ScrollCarousel`, `SearchOverlay`, `SectionHeader`

### تجارت، سبد و عملیات

`CategoryCard`, `BrandCard`, `HeroBanner`, کارت‌های محصول، `ProductGrid`, `ProductGallery`, `ProductInfo`, `ProductSpecs`, `FilterSidebar`, `SortBar`, `SellerCard`, `ReviewSummary`, `CartItem`, `CartSummary`, `CouponField`, `CheckoutSteps`, `AddressCard`, `ShippingMethod`, `DataTable`, `OrderStatus`, `EmptyState`, `ErrorState`, `Countdown`, `ToastProvider`

## فرمت و تصویر

برای نمایش عدد و قیمت از formatterهای صادرشده استفاده کنید:

```tsx
import { faNum, fmt, toFa } from '@digikit/ui';

fmt(1290000); // جداکننده‌ی قیمت
faNum(2541);  // ارقام فارسی
toFa('123');  // تبدیل رشته‌ی عددی
```

مقدارهایی مثل `ph:101` در دمو با `PlaceholderImage` به تصویر نمونه تبدیل می‌شوند. در محیط واقعی URL نهایی CDN، نسبت تصویر و متن جایگزین را مشخص کنید.

## storage دمو

hookهای `useCart`، `useFavs`، `useUser`، `useAddresses` و `useOrders` فقط برای دمو و local-first هستند:

```ts
import { DIGIKIT_STORAGE_KEYS, DIGIKIT_STORAGE_EVENTS } from '@digikit/ui';

DIGIKIT_STORAGE_KEYS.cart;
DIGIKIT_STORAGE_KEYS.favorites;
DIGIKIT_STORAGE_KEYS.user;
DIGIKIT_STORAGE_KEYS.addresses;
DIGIKIT_STORAGE_KEYS.checkout;
```

کلیدها با `digikit-` شروع می‌شوند و قرارداد production، حساب کاربری یا پرداخت نیستند. در برنامه‌ی واقعی adapter ذخیره‌سازی یا state manager خود را به lifecycle کامپوننت‌ها وصل کنید.

## ساخت component جدید

هر component را در پوشه‌ی مستقل بسازید:

```text
packages/ui/src/components/PromoBanner/
├── index.tsx
├── styles.module.css
├── component.meta.json   # اختیاری؛ label و کنترل‌های راهنمای /kit
└── demo.tsx              # اختیاری؛ سناریوی تعاملی اختصاصی
```

خروجی را named export کنید و از ریشه‌ی repository generatorها را اجرا کنید:

```bash
npm run generate
```

`gen-barrel.mjs` exportهای `packages/ui/src/index.ts` را تولید می‌کند و `gen-kit-registry.mjs` component را در راهنمای `/kit` ثبت می‌کند. برای metadata می‌توانید گروه، توضیح، tag، propهای پیش‌فرض و کنترل‌های `text`، `number`، `boolean`، `select`، `json` و `color` را تعریف کنید.

برای جزئیات API contribution و چک‌لیست review به [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md) مراجعه کنید.
