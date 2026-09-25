# راهنمای مشارکت در دیجی‌کیت

از contribution شما استقبال می‌کنیم. دیجی‌کیت زمانی ارزشمندتر می‌شود که componentها مسئله‌ی واقعی را حل کنند، API قابل فهم داشته باشند و برای فارسی، RTL، موبایل و keyboard قابل اعتماد بمانند.

## قبل از شروع

- برای component جدید، تغییر API یا تغییر بصری بزرگ ابتدا issue باز کنید.
- در issue توضیح دهید مشکل چیست، چه گروهی از کاربران از آن استفاده می‌کنند و چرا componentهای فعلی کافی نیستند.
- برای خطا، مسیر بازتولید، نتیجه‌ی فعلی و نتیجه‌ی مورد انتظار را بنویسید.
- تغییرهای کوچک و مستقل را به pull requestهای جدا تقسیم کنید.

## آماده‌سازی محیط

```bash
git clone https://github.com/wecanco/digikit.git
cd digikit
npm ci
npm run generate
```

پیش‌نیازها Node.js `20.9+` و npm `10+` هستند.

## چرخه‌ی افزودن component

1. **مسئله و scope:** use case، گروه component و مرز مسئولیت را مشخص کنید.
2. **API:** نام component، propها، typeها، controlled بودن، callbackها و رفتار حالت‌های edge را طراحی کنید.
3. **پیاده‌سازی:** در `packages/ui/src/components/<Name>/` فایل `index.tsx` و `styles.module.css` بسازید.
4. **کیفیت پایه:** tokenهای `--dk-*`، logical properties، `dir="rtl"`، focus، keyboard، disabled، loading و reduced motion را بررسی کنید.
5. **راهنمای تعاملی:** برای propهای قابل تنظیم `component.meta.json` و برای state یا سناریوی پیچیده `demo.tsx` اضافه کنید.
6. **تولید خروجی:** `npm run generate` را اجرا کنید تا barrel و registry به‌روز شوند.
7. **اعتبارسنجی:** typecheck، build و در صورت نیاز smoke check را اجرا کنید.
8. **مستندسازی:** مثال مصرف، محدودیت‌ها، تغییرهای breaking و اثر responsive را در PR بنویسید.

## قرارداد component

- export اصلی را به‌صورت named export ارائه کنید.
- type مربوط به propها را کنار component export کنید.
- state کسب‌وکاری، درخواست شبکه، permission و ذخیره‌سازی واقعی را داخل component عمومی قرار ندهید.
- متن‌های قابل نمایش را از prop دریافت کنید یا با نمونه‌ی فارسی و قابل فهم ارائه دهید.
- برای تصویر، `alt` و برای icon button، `aria-label` الزامی است.
- مقدارهای API را به مدل‌های `@digikit/ui` در adapter تبدیل کنید؛ component را به schema سرویس گره نزنید.

## دستورات بررسی

```bash
npm run generate
npm run typecheck
npm run build
npm run pack:ui
```

برای smoke check مرورگر، بعد از اجرای سرور production در ترمینال جداگانه:

```bash
npm run start --workspace=@digikit/web
npm run test:smoke
```

smoke check به Chrome نصب‌شده نیاز دارد. اگر محیط شما Chrome یا وابستگی لازم را ندارد، محدودیت محیط را در PR ذکر کنید و نتیجه را به‌عنوان failure محصول گزارش نکنید.

## pull request

عنوان و توضیح PR باید مسئله و نتیجه را روشن کند. PRهای component جدید بهتر است این موارد را داشته باشند:

- نمونه‌ی مصرف یا لینک route راهنمای `/kit?component=<slug>`
- فهرست propها و حالت‌های اصلی
- بررسی موبایل، تبلت، دسکتاپ و RTL
- بررسی keyboard و screen reader برای تعامل‌ها
- توضیح تغییرات API و سازگاری عقب‌رو
- خروجی `npm run typecheck` و `npm run build`

در صورت تغییر تصویر، screenshot قبل/بعد را در متن PR قرار دهید؛ فایل‌های screenshot و build را به repository commit نکنید.

## review و انتشار

هر تغییر از سه زاویه بررسی می‌شود: API و typeها، رفتار و دسترس‌پذیری، و هماهنگی بصری با tokenها. تغییرهای breaking باید با دلیل، مسیر مهاجرت و تغییر نسخه مشخص شوند. بعد از تأیید review، maintainerها registry تولیدشده و release note را هماهنگ می‌کنند.

افزودن component به‌تنهایی به معنی تعهد به API دائمی نیست؛ در نسخه‌های اولیه ممکن است نام، prop یا گروه‌بندی اصلاح شود.

## کد رفتاری و داده‌ی نمونه

`apps/web` فقط ویترین و راهنمای UI است و backend یا تراکنش واقعی ندارد. از داده‌های نمونه برای بازتولید state استفاده کنید و اطلاعات شخصی، credential یا endpoint داخلی را وارد issue و PR نکنید.

## پرسش یا پیشنهاد

اگر درباره‌ی scope یک component یا قرارداد API مطمئن نیستید، قبل از شروع issue باز کنید تا تصمیم با feedback جامعه گرفته شود.
