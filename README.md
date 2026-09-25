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
- صفحه‌ساز local-first با drag & drop، لایه‌ها، inspector، undo/redo، قالب آماده و reusable block
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

- `/`: هاب کاشی‌محور و دسترسی سریع به تمام بخش‌های دمو
- `/shop`: پوسته‌ی کامل فروشگاهی نمونه
- `/kit`: راهنمای تعاملی تمام exportهای قابل رندر
- `/kit/showcase`: ویترین ترکیبی و سناریوهای واقعی‌تر
- `/builder`: صفحه‌ساز محلی برای چیدن componentها، طراحی layout master و خروجی گرفتن بدون backend
- `/builder/dashboard`: داشبورد مدیریت، ساخت، duplicate، حذف و backup صفحات
- `/chrome`: مسیر قدیمی پوسته که به `/shop` هدایت می‌شود
- `/products`: گونه‌های مختلف کارت و گرید محصول
- `/product`, `/categories`, `/search`, `/amazing` و `/supermarket`: مسیرهای محصول، دسته‌بندی، جستجو و کمپین
- `/cart` و `/checkout`: سناریوی نمایشی سبد و تکمیل خرید
- `/profile`, `/favorites`, `/login` و `/sell`: مسیرهای حساب کاربری و همکاری
- `/mag` و `/mag-post`: مجله و صفحه‌ی مقاله

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
npm run test:builder
```

`test:builder` جریان چندصفحه‌ای، import/export، تعارض تب‌ها، قالب خدمات، خروجی HTML/TSX، responsive و بازیابی داده‌ی معیوب را بررسی می‌کند و به Chrome نصب‌شده یا متغیر `DIGIKIT_CHROME_PATH` نیاز دارد. این بررسی‌ها جایگزین تست محصول، backend یا مرورگرهای واقعی نیستند.

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

## صفحه‌ساز local-only

صفحه‌ساز در `/builder/dashboard` و `/builder` کاملاً بدون API، backend، database، server action یا `fetch` کار می‌کند. مدل serializable صفحه، layout master، وضعیت انتشار محلی، تاریخچه نسخه‌ها، assetهای تصویری و reusable blockها در `localStorage` ذخیره می‌شوند و صفحه فعال، viewport و theme با cookie مرورگر حفظ می‌شوند. workspaceهای قدیمی هنگام load به schema جدید مهاجرت می‌کنند و layout master اولیه را دریافت می‌کنند.

قابلیت‌های اصلی:

- کشیدن componentها و جابه‌جایی nodeها با drag & drop بومی HTML5 و منوی راست‌کلیک برای تنظیمات، reorder، duplicate، copy/paste، reusable و حذف
- گرید واقعی چندستونه با slot مستقل برای هر ستون؛ componentها از بوم یا درخت لایه‌ها بین بخش‌ها و ستون‌ها جابه‌جا می‌شوند و درخت لایه‌ها ستون‌ها را به‌صورت تو‌در‌تو نشان می‌دهد
- ساخت صفحه خالی یا شروع از قالب‌های landing، campaign، product و معرفی خدمات
- inspector برای props، استایل responsive دسکتاپ/تبلت/موبایل، متادیتای صفحه، فهرست محصولات قابل ویرایش، asset picker و آپلود تصویر محلی تا ۲ مگابایت
- لایه‌ها، انتخاب node، duplicate، حذف، reorder، undo/redo، بازیابی نسخه‌های ذخیره‌شده و تأیید accessible برای همه‌ی حذف‌ها، بازنشانی‌ها و جایگزینی workspace
- ناوبری، دکمه‌ی نویگیشن موبایل، مزیت، پرسش‌وپاسخ، پاورقی و لینک‌های داخلی، در کنار المان‌های فروشگاهی و چیدمان
- طراحی `layout master` از مسیر `/builder?layout=master`؛ صفحه‌ها با یک toggle از آن ارث می‌برند، جایگاه «محتوای صفحه» دارند و هنگام ویرایش صفحه، پوسته‌ی master به‌صورت کم‌رنگ دیده می‌شود
- خروجی `JSON`، بسته‌ی `.digikit.json`، کل workspace، `TSX`، HTML استاتیک و چاپ/PDF مرورگر

ویرایش‌ها با تأخیر کوتاه در `localStorage` ذخیره می‌شوند؛ تب‌های همان مرورگر تغییرات را دریافت می‌کنند. اگر دو تب هم‌زمان ویرایش شوند، تغییرات تب حاضر **خودکار روی تب دیگر نوشته نمی‌شود**: هشدار ثابت، دانلود پشتیبان تغییرات این تب و دریافت نسخه‌ی تب دیگر در دسترس است؛ merge خودکار وجود ندارد. اگر داده‌ی ذخیره‌شده آسیب ببیند، بازنویسی خودکار انجام نمی‌شود و امکان دانلود متن خام و بازنشانی با تأیید وجود دارد. کوکی‌ها فقط صفحه‌ی فعال، تم و اندازه‌ی بوم را نگه می‌دارند. داده‌ها بین مرورگر، پروفایل یا دستگاه‌ها sync نمی‌شوند و پاک‌کردن site data آن‌ها را حذف می‌کند. برای انتقال و backup از «پشتیبان workspace» استفاده کنید؛ ورود این فایل با تأیید، کل workspace فعلی را جایگزین می‌کند و بازنشانی آن را پاک می‌کند. بسته‌ی صفحه تصویرها و بلوک‌های reusable را همراه سند می‌آورد؛ `JSON` خام فقط سند صفحه را دارد. فایل ورودی حداکثر ۱۵ مگابایت است.

`HTML` یک فایل مستقل با layout master ترکیب‌شده، محتوای صفحه، گرید محصولات قابل ویرایش و تصاویر محلی inline است؛ `TSX` به نصب `@digikit/ui` و stylesheet آن در اپ مقصد نیاز دارد. در هر دو نوع خروجی، لینک‌های نمونه را برای مقصد واقعی خود تنظیم کنید. وضعیت «انتشار محلی» تنها برچسب مدیریت در همین مرورگر است و صفحه را روی هاست عمومی منتشر نمی‌کند. خروجی PDF با قابلیت چاپ/PDF مرورگر انجام می‌شود؛ بارگذاری و sync سروری، احراز هویت و فروش واقعی جزو این صفحه‌ساز بدون backend نیستند.

### چک‌لیست تکمیل صفحه‌ساز محلی

- [x] مدیریت چند صفحه، قالب‌های فروشگاهی و خدماتی، وضعیت محلی، جستجو و مرتب‌سازی داشبورد
- [x] چیدمان تو‌در‌تو و جابه‌جایی با drag & drop یا دکمه‌ها، لایه‌ها، ویرایش محتوا و استایل responsive
- [x] پیش‌نمایش و خروجی مستقل HTML، خروجی TSX، نسخه‌ها، undo/redo و تصویر و بلوک reusable
- [x] پشتیبان کامل، import اعتبارسنجی‌شده، حفاظت تعارض تب‌ها و امکان بازیابی داده‌ی معیوب
- [x] گرید چندستونه‌ی واقعی، درگ‌ودراپ cross-section/cross-column، نمایش ستون‌ها در لایه‌ها و انتقال از خود outline
- [x] layout master قابل ویرایش، ارث‌بری per-page، جایگاه محتوای صفحه، نمایش کم‌رنگ در ادیتور و compose در خروجی‌ها
- [x] کیبورد و صفحه‌ی کوچک؛ تست خودکار مرورگر با `npm run test:builder` پس از `npm run build` و `npm run start --workspace=@digikit/web` (نیازمند Chrome یا `DIGIKIT_CHROME_PATH`)
- [ ] انتشار روی دامنه عمومی، جمع‌آوری فرم، سبد و سفارش واقعی، همکاری زنده و sync بین دستگاه‌ها: عمداً خارج از نسخه‌ی بدون backend است؛ نشان «انتشار محلی» معادل انتشار اینترنتی نیست.

## مجوز

این پروژه با مجوز [MIT](LICENSE) منتشر می‌شود.
