# دیجی‌کیت | DigiKit UI

دیجی‌کیت یک **سیستم طراحی React و TypeScript** برای محصولات فارسی، تجربه‌های فروشگاهی و پنل‌های عملیاتی RTL است. هدف پروژه ارائه‌ی کامپوننت‌های قابل ترکیب، قراردادهای داده‌ی روشن، توکن‌های معنایی و یک راهنمای تعاملی برای تیم‌های محصول و جامعه‌ی توسعه‌دهندگان است.

هسته‌ی قابل استفاده‌ی پروژه در `packages/ui` قرار دارد و راهنمای زنده و نمونه‌های اتصال آن در `apps/web` اجرا می‌شود.

> وضعیت فعلی: API و نام‌گذاری‌ها ممکن است در نسخه‌های اولیه تغییر کنند. قبل از استفاده در محصول، قرارداد کامپوننت‌ها و محدودیت‌های بخش «دمو و داده‌ی نمونه» را بررسی کنید.

## قابلیت‌ها

- کامپوننت‌های پایه، فرم، ناوبری، تجارت، سبد خرید و وضعیت‌های عملیاتی
- پشتیبانی از `lang="fa"`، `dir="rtl"`، اعداد و متن فارسی
- توکن‌های طراحی برای رنگ، فاصله، تایپوگرافی، شعاع، سایه و حالت تاریک
- پشتیبانی از حالت‌های `focus`، `disabled`، `loading` و کاهش حرکت
- راهنمای تعاملی `/kit` با جست‌وجو، فیلتر، کنترل prop، پیش‌نمایش چند اندازه و کد قابل کپی
- مدل‌های TypeScript مشترک برای محصول، دسته، آدرس، سبد، فروشنده و گالری

## شروع سریع

### پیش‌نیازها

- Node.js نسخه‌ی `20.9` یا بالاتر
- npm نسخه‌ی `10` یا بالاتر

### نصب و اجرای راهنما

```bash
git clone https://github.com/wecanco/digikit.git
cd digikit
npm ci
npm run generate
npm run dev
```

سپس `http://localhost:4300/kit` را باز کنید. `npm run dev` راهنمای Next.js را اجرا می‌کند؛ همین راهنما نقطه‌ی شروع پیشنهادی برای شناخت و استفاده از UI kit است.

مسیرهای مهم:

- `/kit`: راهنمای تعاملی تمام exportهای قابل رندر
- `/kit/showcase`: ویترین ترکیبی و سناریوهای واقعی‌تر
- `/`: پوسته‌ی نمونه‌ی فروشگاه
- `/products`: گونه‌های مختلف کارت و گرید محصول
- `/cart` و `/checkout`: سناریوی نمایشی سبد و پرداخت

## نصب و استفاده در پروژه‌ی دیگر

اگر `@digikit/ui` در registry پروژه‌ی شما منتشر شده است:

```bash
npm install @digikit/ui react react-dom
```

برای استفاده از نسخه‌ی محلی پیش از انتشار package، می‌توانید package را مستقیماً از checkout نصب کنید:

```bash
npm install /path/to/digikit/packages/ui
```

فایل‌های پایه را فقط یک‌بار در ریشه‌ی برنامه import کنید:

```tsx
// app/layout.tsx یا src/main.tsx
import '@digikit/ui/fonts.css';
import '@digikit/ui/styles.css';
```

سپس کامپوننت‌ها و typeها را از package root دریافت کنید:

```tsx
import { Button, FormField, Input, Price } from '@digikit/ui';

export function CheckoutSummary() {
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

در Next.js، اگر package به‌صورت source یا local link مصرف می‌شود، آن را در `transpilePackages` قرار دهید:

```ts
const nextConfig = {
  transpilePackages: ['@digikit/ui'],
};
```

کامپوننت‌هایی که state، event یا browser API دارند باید در زنجیره‌ی Client Component استفاده شوند. callbackهای خرید، ورود، checkout و پرداخت فقط eventهای UI هستند؛ احراز هویت، API، permission، idempotency و خطاهای شبکه باید در لایه‌ی محصول پیاده‌سازی شوند.

## اصول مصرف

- ریشه‌ی صفحه را با `lang="fa" dir="rtl"` تنظیم کنید.
- برای layout از logical properties مثل `margin-inline` و `padding-block` استفاده کنید.
- رنگ و فاصله را از توکن‌های `--dk-*` بگیرید و مقدارهای بصری را داخل کامپوننت hard-code نکنید.
- برای مقدارهای API، ابتدا adapter بنویسید و سپس مدل‌های صادرشده از `@digikit/ui` را به کامپوننت بدهید.
- کامپوننت‌های controlled مثل `ProductInfo`، `CartItem`، `AddressCard` و `ShippingMethod` باید state نهایی را از صفحه یا store بگیرند.
- برای جدول‌ها، مقدارهای حساس را mask کنید و permission را خارج از UI کنترل کنید.
- برای تصویر نمونه از `ph:<seed>` استفاده می‌شود؛ در محصول واقعی URL نهایی CDN و `alt` معنادار بدهید.

## گروه‌های کامپوننت

- **پایه و نمایش:** `Button`, `IconButton`, `Card`, `Avatar`, `BadgeCircle`, `Chip`, `Price`, `Rating`, `Progress`, `Spinner`, `Skeleton`, `Alert`, `Tooltip`
- **فرم و تعامل:** `Input`, `SearchPill`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `FormField`, `DropdownMenu`, `Tabs`, `Stepper`, `Accordion`
- **ناوبری و پوسته:** `Header`, `Footer`, `Layout`, `MegaMenu`, `BottomNav`, `CampaignStrip`, `Breadcrumb`, `Modal`, `BottomSheet`, `Pagination`, `SearchOverlay`, `ScrollCarousel`, `SectionHeader`
- **تجارت و محصول:** `CategoryCard`, `BrandCard`, کارت‌های محصول، `ProductGrid`, `ProductGallery`, `ProductInfo`, `ProductSpecs`, `HeroBanner`, `FilterSidebar`, `SortBar`, `SellerCard`, `ReviewSummary`
- **سبد و عملیات:** `CartItem`, `CartSummary`, `CouponField`, `CheckoutSteps`, `AddressCard`, `ShippingMethod`, `DataTable`, `OrderStatus`, `EmptyState`, `ErrorState`, `Countdown`, `ToastProvider`

## ساختار پروژه

```text
packages/ui/
├── src/components/<Component>/
│   ├── index.tsx
│   └── styles.module.css
├── src/hooks/                 # hookهای نمونه‌ی local-first
├── src/styles/                # tokenها و فونت Vazir با اعداد فارسی
├── src/types.ts               # قراردادهای داده‌ی مشترک
└── src/index.ts               # barrel تولیدشده

apps/web/
├── app/kit/                   # راهنمای تعاملی و ویترین componentها
├── app/                      # صفحه‌های نمونه‌ی محصول و فروشگاه
└── lib/demo.ts                # داده‌های نمایشی بدون backend

tools/
├── gen-barrel.mjs             # تولید exportهای package
├── gen-kit-registry.mjs       # تولید registry راهنمای /kit
└── kit-registry.defaults.mjs  # label و کنترل پیش‌فرض componentها
```

فایل‌های build، cache، screenshot و داده‌های تحقیقاتی عمداً در repository نگه‌داری نمی‌شوند. خروجی‌های موقت را در `.artifacts/` بسازید؛ این مسیر در `.gitignore` قرار دارد.

## توسعه‌ی محلی

```bash
npm run generate       # barrel و registry راهنما
npm run typecheck      # بررسی TypeScript اپ راهنما
npm run build          # build اپ راهنما
npm run pack:ui        # ساخت tarball محلی package
```

برای بررسی رفتاری اختیاری، ابتدا در یک ترمینال سرور production را اجرا کنید و سپس smoke check را در ترمینال دوم بزنید:

```bash
npm run start --workspace=@digikit/web
npm run test:smoke
```

این بررسی به Chrome نصب‌شده نیاز دارد و جایگزین تست محصول، backend یا مرورگرهای واقعی نیست.

## مشارکت جامعه

دیجی‌کیت با contributionهای کوچک، قابل بررسی و قابل استفاده‌ی مجدد رشد می‌کند. مسیر پیشنهادی برای هر تغییر:

1. برای component جدید یا تغییر API، ابتدا یک issue با مسئله، مخاطب و نمونه‌ی مصرف باز کنید.
2. API و حالت‌های اصلی را قبل از جزئیات بصری مشخص کنید؛ نام propها، controlled بودن و رفتار keyboard را مستند کنید.
3. component را در پوشه‌ی مستقل `packages/ui/src/components/<Name>/` بسازید.
4. برای ورود خودکار به `/kit`، در صورت نیاز `component.meta.json` و برای سناریوهای پیچیده `demo.tsx` اضافه کنید.
5. `npm run generate`، `npm run typecheck` و `npm run build` را اجرا کنید.
6. در pull request، رفتار RTL، responsive، accessibility، حالت‌های loading/disabled و تغییرات breaking را توضیح دهید.

جزئیات قرارداد contribution، روند review و چک‌لیست pull request در [`CONTRIBUTING.md`](CONTRIBUTING.md) آمده است.

## داده و محدودیت دمو

اپ `apps/web` backend یا حساب واقعی ندارد. hookهای `useCart`، `useFavs`، `useUser`، `useAddresses` و `useOrders` فقط برای نمایش و تست UI از local storage استفاده می‌کنند و کلیدهای آن‌ها با `digikit-` شروع می‌شود. این storage قرارداد هویت، پرداخت یا production نیست؛ در محصول واقعی آن را با adapter یا state manager خود جایگزین کنید.

## مجوز

این پروژه با مجوز [MIT](LICENSE) منتشر می‌شود.
