// پروب رفتاری دموی React روی :4301 — راستی‌آزمایی DOM/منطق (نه فقط ظاهر)
import { chromium } from 'playwright';

const BASE = 'http://localhost:4301';
const SEED = {
  'digikit-cart': JSON.stringify([1, 2]),
  'digikit-cart-qty': JSON.stringify({ '1': 2, '2': 1 }),
  'digikit-favs': JSON.stringify([3]),
  'digikit-user': JSON.stringify({ name: 'کاربر دیجی‌کیت', id: 'u1' }),
};

let pass = 0, fail = 0;
const check = (name, ok, extra = '') => {
  console.log(`${ok ? '✓' : '✗ FAIL'} ${name}${extra ? ` — ${extra}` : ''}`);
  ok ? pass++ : fail++;
};

let browser;
try {
  browser = await chromium.launch(process.env.DIGIKIT_CHROME_PATH ? { executablePath: process.env.DIGIKIT_CHROME_PATH } : { channel: 'chrome' });
} catch (error) {
  const detail = error instanceof Error ? error.message.split('\n')[0] : String(error);
  console.error(`Smoke check اجرا نشد: Chrome پیدا نشد (${detail}). مسیر Chrome را در DIGIKIT_CHROME_PATH تنظیم یا npx playwright install chrome را اجرا کنید.`);
  process.exit(2);
}

async function newPage(vp) {
  const ctx = await browser.newContext({ viewport: vp });
  await ctx.addInitScript((seed) => {
    for (const [k, v] of Object.entries(seed)) localStorage.setItem(k, v);
  }, SEED);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => check('no pageerror', false, e.message));
  return { ctx, page };
}

/* ───────── /chrome دسکتاپ ───────── */
{
  const { ctx, page } = await newPage({ width: 1440, height: 900 });
  await page.goto(BASE + '/chrome', { waitUntil: 'load' });
  await page.waitForTimeout(250);

  // ServiceTiles باید در دسکتاپ مخفی باشد
  // از طریق جستجوی متنی کاشی «پیشنهادها» که فقط در ServiceTiles است
  const tilePishnehad = page.getByText('پیشنهادها', { exact: true });
  check('ServiceTiles در دسکتاپ مخفی', (await tilePishnehad.count()) === 0 || !(await tilePishnehad.first().isVisible()));

  // ServicesStrip دسکتاپ: آیتم‌های لیست دسکتاپ («مدرسه و دانشگاه» فقط دسکتاپ است)
  const mehrad = page.getByText('مدرسه و دانشگاه', { exact: true });
  check('ServicesStrip دسکتاپ (مدرسه و دانشگاه)', await mehrad.first().isVisible().catch(() => false));

  // بج سبد هدر = ۲ (کاربر seed شده)
  const headerBadge = await page.locator('header [class*="badge"], header span').filter({ hasText: /^۲$/ }).first().isVisible().catch(() => false);
  check('بج سبد هدر = ۲', headerBadge);

  // نام کاربر به‌جای «ورود | ثبت‌نام»
  const userName = await page.getByText('کاربر دیجی‌کیت', { exact: true }).first().isVisible().catch(() => false);
  const loginPill = await page.getByText('ورود | ثبت‌نام').first().isVisible().catch(() => false);
  check('هدر: نام کاربر لاگین‌شده', userName && !loginPill);

  // BottomNav مخفی در دسکتاپ
  const bottomNav = page.getByRole('link', { name: 'دسته‌بندی' }).first();
  check('BottomNav مخفی در دسکتاپ', !(await bottomNav.isVisible().catch(() => false)));

  // مگامنو: کلیک روی تریگر → پنل + ۸ دسته + ساب‌های دسته فعال
  await page.getByText('دسته‌بندی کالاها').first().click();
  const megaVisible = await page.getByText('کالای دیجیتال', { exact: true }).first().isVisible().catch(() => false);
  check('مگامنو باز شد', megaVisible);
  const subLaptop = await page.getByText('لپ‌تاپ', { exact: true }).first().isVisible().catch(() => false);
  check('مگامنو: ساب‌های دسته فعال', subLaptop);
  // هاور دسته دوم → ساب‌ها عوض می‌شوند
  await page.getByText('مد و پوشاک', { exact: true }).first().hover();
  await page.waitForTimeout(350);
  const subShoes = await page.getByText('کفش', { exact: true }).first().isVisible().catch(() => false);
  check('مگامنو: تغییر ساب‌ها با هاور', subShoes);
  await page.keyboard.press('Escape');

  // (شمارش معکوس در /chrome نیست — در بخش /products بررسی می‌شود)

  // گرید: ۵ ستون در 1440 (grid variant، 5 از 1280)
  const grid = page.getByText('محبوب‌ترین کالاها', { exact: false }).locator('..').locator('..');
  const gridEl = page.locator('main div[class*="grid"], main [style*="cols"]').nth(1);
  const cols = await page.evaluate(() => {
    const els = [...document.querySelectorAll('main *')];
    const g = els.filter((e) => getComputedStyle(e).display === 'grid' && e.children.length > 5);
    return g.map((e) => getComputedStyle(e).gridTemplateColumns.split(' ').length);
  });
  check('گرید کالا چندستونی', cols.some((c) => c >= 4), JSON.stringify(cols));

  // فوتر: نام برند و متن‌های عمومی باید یکدست باشند.
  const body = await page.evaluate(() => document.body.innerText);
  check('برند «دیجی‌کیت کلاب»', body.includes('دیجی‌کیت کلاب') && !body.includes('دیجی‌کیت اکلاب'));
  check('برند «دیجی‌کیت پی/دیجی‌کیت فای»', body.includes('دیجی‌کیت پی') && body.includes('دیجی‌کیت فای'));

  // اسکرول‌تاپ: اول با opacity مخفی (isVisible برای opacity صفر True می‌دهد)، بعد از اسکرول پیدا
  const scrollBtn = page.getByRole('button', { name: 'بازگشت به بالا' });
  const opBefore = await scrollBtn.evaluate((el) => getComputedStyle(el).opacity).catch(() => '1');
  check('scroll-top ابتدا مخفی (opacity 0)', opBefore === '0', `opacity=${opBefore}`);
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(400);
  const opAfter = await scrollBtn.evaluate((el) => getComputedStyle(el).opacity).catch(() => '0');
  check('scroll-top بعد از اسکرول پیدا', opAfter !== '0' && opAfter !== '', `opacity=${opAfter}`);

  // ارتفاع نوار کمپین = 60px
  const campaignH = await page.evaluate(() => {
    const el = [...document.querySelectorAll('main *, body > *')].find((e) => e.textContent?.includes('جشنواره') && e.getBoundingClientRect().height < 100 && e.getBoundingClientRect().height > 20);
    return el ? Math.round(el.getBoundingClientRect().height) : 0;
  });
  check('نوار کمپین ~60px', campaignH >= 50 && campaignH <= 70, `${campaignH}px`);

  await ctx.close();
}

/* ───────── /chrome موبایل ───────── */
{
  const { ctx, page } = await newPage({ width: 390, height: 844 });
  await page.goto(BASE + '/chrome', { waitUntil: 'load' });
  await page.waitForTimeout(250);

  check('ServiceTiles موبایل پیدا (کاشی قرمز ٪)', await page.getByText('٪', { exact: true }).first().isVisible().catch(() => false));
  const navTabs = await page.getByRole('link', { name: /سبد خرید/ }).first().isVisible().catch(() => false);
  check('BottomNav موبایل پیدا', navTabs);
  const navBadge = await page.evaluate(() => {
    const links = [...document.querySelectorAll('a')];
    const cart = links.find((a) => a.textContent?.includes('سبد خرید'));
    const spans = [...(cart?.querySelectorAll('span') || [])];
    return spans.map((s) => s.textContent).join('|');
  });
  check('بج سبد BottomNav = ۲', navBadge.includes('۲'), JSON.stringify(navBadge));

  // اوورلی جستجو موبایل
  await page.getByText('جستجو در دیجی‌کیت').first().click();
  await page.waitForTimeout(400);
  check('اوورلی جستجو: جستجوهای اخیر', await page.getByText('جستجوهای اخیر').isVisible().catch(() => false));
  check('اوورلی جستجو: دسته‌بندی‌های محبوب', await page.getByText('دسته‌بندی‌های محبوب').isVisible().catch(() => false));
  await page.getByRole('button', { name: 'بازگشت' }).click().catch(async () => {
    await page.keyboard.press('Escape');
  });

  // گرید ۲ ستونه
  const cols2 = await page.evaluate(() => {
    const els = [...document.querySelectorAll('main *')];
    const g = els.filter((e) => getComputedStyle(e).display === 'grid' && e.children.length > 4);
    return g.map((e) => getComputedStyle(e).gridTemplateColumns.split(' ').length);
  });
  check('گرید موبایل ۲ ستونه', cols2.some((c) => c === 2), JSON.stringify(cols2));

  await ctx.close();
}

/* ───────── / پریمیتیوها ───────── */
{
  const { ctx, page } = await newPage({ width: 1440, height: 900 });
  await page.goto(BASE + '/', { waitUntil: 'load' });

  // توست
  await page.getByRole('button', { name: 'موفق' }).click();
  await page.waitForTimeout(300);
  check('توست موفق نمایش', await page.getByText('به سبد خرید اضافه شد').isVisible().catch(() => false));
  await page.waitForTimeout(3200);
  check('توست خودکار بسته شد', !(await page.getByText('به سبد خرید اضافه شد').isVisible().catch(() => false)));

  // استپر
  const stepperBtns = page.getByRole('button', { name: /افزایش|کاهش|\+/ });
  const plus = page.locator('button:has(svg.lucide-plus)').first();
  await plus.click();
  await page.waitForTimeout(150);
  const qtyTxt = await page.evaluate(() => {
    const arts = [...document.querySelectorAll('button')];
    return '';
  });
  const stepperVal = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => b.querySelector('svg.lucide-plus'));
    const wrap = btn?.closest('div');
    return [...(wrap?.querySelectorAll('span') || [])].map((s) => s.textContent).join('|');
  });
  check('استپر: کلیک + → ۲', stepperVal.includes('۲'), stepperVal);

  // تب‌ها (role="tab" دارند)
  await page.getByRole('tab', { name: 'علاقه‌مندی‌ها' }).click();
  await page.waitForTimeout(150);
  const tabActive = await page.evaluate(() => {
    const t = [...document.querySelectorAll('button')].find((b) => b.textContent?.includes('علاقه‌مندی‌ها'));
    return t ? getComputedStyle(t).color + '/' + getComputedStyle(t).fontWeight : '';
  });
  check('تب فعال شد', !!tabActive, tabActive);

  // مودال
  await page.getByRole('button', { name: 'باز کردن مودال' }).click();
  await page.waitForTimeout(300);
  check('مودال باز', await page.getByText('انتخاب رنگ').isVisible().catch(() => false));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  check('مودال با Escape بسته', !(await page.getByText('انتخاب رنگ').isVisible().catch(() => false)));

  // بات‌شیت
  await page.getByRole('button', { name: 'باز کردن بات‌شیت' }).click();
  await page.waitForTimeout(300);
  check('بات‌شیت باز', await page.getByText('گزینه‌های مرتب‌سازی').isVisible().catch(() => false));
  await page.keyboard.press('Escape');

  // کاروسل: دکمه‌های فلش در دسکتاپ
  const arrows = await page.locator('button:has(svg.lucide-chevron-left), button:has(svg.lucide-chevron-right)').count();
  check('کاروسل: فلش‌های ناوبری', arrows >= 2, `${arrows} دکمه`);

  await ctx.close();
}

/* ───────── /products ───────── */
{
  const { ctx, page } = await newPage({ width: 1440, height: 900 });
  await page.goto(BASE + '/products', { waitUntil: 'load' });

  // گرید مویی: ۴ ستون (این صفحه <main> ندارد — کل بدنه را می‌گردیم)
  const hairline = await page.evaluate(() => {
    const els = [...document.querySelectorAll('body *')];
    const g = els.find((e) => getComputedStyle(e).display === 'grid' && getComputedStyle(e).gap?.includes('px') && e.children.length >= 8);
    return g ? { cols: getComputedStyle(g).gridTemplateColumns.split(' ').length, gap: getComputedStyle(g).gap, bg: getComputedStyle(g).backgroundColor } : null;
  });
  check('گرید مویی ۴ ستونه', hairline?.cols === 4, JSON.stringify(hairline));

  // شمارش معکوس این صفحه تیک می‌خورد
  const cdText = () =>
    page.evaluate(() =>
      [...document.querySelectorAll('[dir="ltr"]')]
        .map((e) => e.textContent?.trim() || '')
        .find((t) => /^\d{2}:\d{2}:\d{2}$/.test(t)) || '',
    );
  const t1 = await cdText();
  await page.waitForTimeout(2200);
  const t2 = await cdText();
  check('شمارش معکوس تیک می‌خورد', t1 && t2 && t1 !== t2, `${t1} → ${t2}`);

  // ردیف PLP: کالای id=1 در سبد است → استپر با ۲ (دکمه‌ها فقط آیکون‌اند؛ مقدار در span است)
  const rowStepper = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('article')].filter((r) => r.querySelector('button'));
    const row = rows.find((r) => r.textContent?.includes('Galaxy S24'));
    if (!row) return '';
    return [...row.querySelectorAll('button, span')].map((b) => b.textContent?.trim()).join('|');
  });
  check('کارت ردیفی: استپر برای کالای درون سبد', rowStepper.includes('۲'), rowStepper.slice(0, 80));

  // کارت سوپر: دکمه افزودن سبز
  const superPlus = await page.evaluate(() => {
    const arts = [...document.querySelectorAll('article')];
    const sup = arts.find((a) => a.textContent?.includes('برنج ایرانی'));
    const btn = sup?.querySelector('button');
    return btn ? getComputedStyle(btn).backgroundColor : '';
  });
  check('کارت سوپر: دکمه سبز افزوده', /0,\s*160|00a049|#00a049/i.test(superPlus), superPlus);

  // بج تخفیف روی بندانگشتی ردیفی
  const rowBadge = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('article')];
    const row = rows.find((r) => r.textContent?.includes('Redmi Note 13'));
    return row ? (row.textContent?.includes('٪') ? 'has' : 'none') : 'no-row';
  });
  check('کارت ردیفی: بج درصد', rowBadge === 'has', rowBadge);

  await ctx.close();
}

await browser.close();
console.log(`\n─────\nرد شد: ${pass} | مردود: ${fail}`);
process.exit(fail ? 1 : 0);
